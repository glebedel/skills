#!/usr/bin/env python3
"""
Adversarial spec debate script.
Sends specs to multiple LLMs for critique using LiteLLM.

Usage:
    echo "spec" | python3 debate.py critique --models gpt-4o
    echo "spec" | python3 debate.py critique --models gpt-4o,gemini/gemini-2.0-flash,xai/grok-3 --doc-type prd
    echo "spec" | python3 debate.py critique --models gpt-4o --focus security
    echo "spec" | python3 debate.py critique --models gpt-4o --persona "security engineer"
    echo "spec" | python3 debate.py critique --models gpt-4o --context ./api.md --context ./schema.sql
    echo "spec" | python3 debate.py critique --models gpt-4o --profile strict-security
    echo "spec" | python3 debate.py critique --models gpt-4o --preserve-intent
    python3 debate.py diff --previous prev.md --current current.md
    echo "spec" | python3 debate.py export-tasks --doc-type prd
    python3 debate.py providers

Supported providers (set corresponding API key):
    OpenAI:    OPENAI_API_KEY      models: gpt-4o, gpt-4-turbo, o1, etc.
    Anthropic: ANTHROPIC_API_KEY   models: claude-sonnet-4-20250514, etc.
    Google:    GEMINI_API_KEY      models: gemini/gemini-2.0-flash, etc.
    xAI:       XAI_API_KEY         models: xai/grok-3, xai/grok-beta, etc.
    Mistral:   MISTRAL_API_KEY     models: mistral/mistral-large, etc.
    Groq:      GROQ_API_KEY        models: groq/llama-3.3-70b, etc.
    Deepseek:  DEEPSEEK_API_KEY    models: deepseek/deepseek-chat

Document types:
    prd   - Product Requirements Document (business/product focus)
    tech  - Technical Specification / Architecture Document (engineering focus)

Exit codes:
    0 - Success
    1 - API error
    2 - Missing API key or config error
"""

import os
import sys
import argparse
import json
from pathlib import Path

os.environ["LITELLM_LOG"] = "ERROR"

try:
    from litellm import completion
except ImportError:
    print(
        "Error: litellm package not installed. Run: pip install litellm",
        file=sys.stderr,
    )
    sys.exit(1)

from prompts import EXPORT_TASKS_PROMPT, get_doc_type_name
from providers import (
    load_profile,
    save_profile,
    list_profiles,
    list_providers,
    list_focus_areas,
    list_personas,
)
from models import (
    ModelResponse,
    cost_tracker,
    load_context_files,
    extract_tasks,
    generate_diff,
    call_models_parallel,
)


def main():
    parser = argparse.ArgumentParser(
        description="Adversarial spec debate with multiple LLMs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  echo "spec" | python3 debate.py critique --models gpt-4o
  echo "spec" | python3 debate.py critique --models gpt-4o --focus security
  echo "spec" | python3 debate.py critique --models gpt-4o --persona "security engineer"
  echo "spec" | python3 debate.py critique --models gpt-4o --context ./api.md
  echo "spec" | python3 debate.py critique --profile my-security-profile
  python3 debate.py diff --previous old.md --current new.md
  echo "spec" | python3 debate.py export-tasks --doc-type prd
  python3 debate.py providers
  python3 debate.py focus-areas
  python3 debate.py personas
  python3 debate.py profiles
  python3 debate.py save-profile myprofile --models gpt-4o,gemini/gemini-2.0-flash --focus security

Document types:
  prd   - Product Requirements Document (business/product focus)
  tech  - Technical Specification / Architecture Document (engineering focus)
        """,
    )
    parser.add_argument(
        "action",
        choices=[
            "critique",
            "providers",
            "diff",
            "export-tasks",
            "focus-areas",
            "personas",
            "profiles",
            "save-profile",
        ],
        help="Action to perform",
    )
    parser.add_argument(
        "profile_name",
        nargs="?",
        help="Profile name (for save-profile action)",
    )
    parser.add_argument(
        "--models",
        "-m",
        default="gpt-4o",
        help="Comma-separated list of models (e.g., gpt-4o,gemini/gemini-2.0-flash,xai/grok-3)",
    )
    parser.add_argument(
        "--doc-type",
        "-d",
        choices=["prd", "tech"],
        default="tech",
        help="Document type: prd or tech (default: tech)",
    )
    parser.add_argument(
        "--round", "-r", type=int, default=1, help="Current round number"
    )
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    parser.add_argument(
        "--press",
        "-p",
        action="store_true",
        help="Press models to confirm they read the full document (anti-laziness check)",
    )
    parser.add_argument(
        "--focus",
        "-f",
        help="Focus area for critique (security, scalability, performance, ux, reliability, cost)",
    )
    parser.add_argument(
        "--persona",
        help="Persona for critique (security-engineer, oncall-engineer, junior-developer, etc.)",
    )
    parser.add_argument(
        "--context",
        "-c",
        action="append",
        default=[],
        help="Additional context file(s) to include (can be used multiple times)",
    )
    parser.add_argument("--profile", help="Load settings from a saved profile")
    parser.add_argument("--previous", help="Previous spec file (for diff action)")
    parser.add_argument("--current", help="Current spec file (for diff action)")
    parser.add_argument(
        "--show-cost", action="store_true", help="Show cost summary after critique"
    )
    parser.add_argument(
        "--preserve-intent",
        action="store_true",
        help="Require explicit justification for any removal or substantial modification",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=600,
        help="Timeout in seconds for model API calls (default: 600 = 10 minutes)",
    )
    args = parser.parse_args()

    # Handle simple info commands
    if args.action == "providers":
        list_providers()
        return

    if args.action == "focus-areas":
        list_focus_areas()
        return

    if args.action == "personas":
        list_personas()
        return

    if args.action == "profiles":
        list_profiles()
        return

    if args.action == "save-profile":
        if not args.profile_name:
            print("Error: Profile name required", file=sys.stderr)
            sys.exit(1)
        config = {
            "models": args.models,
            "doc_type": args.doc_type,
            "focus": args.focus,
            "persona": args.persona,
            "context": args.context,
            "preserve_intent": args.preserve_intent,
        }
        save_profile(args.profile_name, config)
        return

    if args.action == "diff":
        if not args.previous or not args.current:
            print("Error: --previous and --current required for diff", file=sys.stderr)
            sys.exit(1)
        try:
            prev_content = Path(args.previous).read_text()
            curr_content = Path(args.current).read_text()
            diff = generate_diff(prev_content, curr_content)
            if diff:
                print(diff)
            else:
                print("No differences found.")
        except Exception as e:
            print(f"Error reading files: {e}", file=sys.stderr)
            sys.exit(1)
        return

    # Load profile if specified
    if args.profile:
        profile = load_profile(args.profile)
        if "models" in profile and args.models == "gpt-4o":
            args.models = profile["models"]
        if "doc_type" in profile and args.doc_type == "tech":
            args.doc_type = profile["doc_type"]
        if "focus" in profile and not args.focus:
            args.focus = profile["focus"]
        if "persona" in profile and not args.persona:
            args.persona = profile["persona"]
        if "context" in profile and not args.context:
            args.context = profile["context"]
        if profile.get("preserve_intent") and not args.preserve_intent:
            args.preserve_intent = profile["preserve_intent"]

    # Parse models list
    models = [m.strip() for m in args.models.split(",") if m.strip()]
    if not models:
        print("Error: No models specified", file=sys.stderr)
        sys.exit(1)

    # Load context files
    context = load_context_files(args.context) if args.context else None

    if args.action == "export-tasks":
        spec = sys.stdin.read().strip()
        if not spec:
            print("Error: No spec provided via stdin", file=sys.stderr)
            sys.exit(1)

        doc_type_name = get_doc_type_name(args.doc_type)
        prompt = EXPORT_TASKS_PROMPT.format(doc_type_name=doc_type_name, spec=spec)

        try:
            response = completion(
                model=models[0],
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=8000,
            )
            content = response.choices[0].message.content
            tasks = extract_tasks(content)

            if args.json:
                print(json.dumps({"tasks": tasks}, indent=2))
            else:
                print(f"\n=== Extracted {len(tasks)} Tasks ===\n")
                for i, task in enumerate(tasks, 1):
                    print(
                        f"{i}. [{task.get('type', 'task')}] [{task.get('priority', 'medium')}] {task.get('title', 'Untitled')}"
                    )
                    if task.get("description"):
                        print(f"   {task['description'][:100]}...")
                    if task.get("acceptance_criteria"):
                        print(
                            f"   Acceptance criteria: {len(task['acceptance_criteria'])} items"
                        )
                    print()
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
        return

    # Main critique action
    spec = sys.stdin.read().strip()
    if not spec:
        print("Error: No spec provided via stdin", file=sys.stderr)
        sys.exit(1)

    mode = "pressing for confirmation" if args.press else "critiquing"
    focus_info = f" (focus: {args.focus})" if args.focus else ""
    persona_info = f" (persona: {args.persona})" if args.persona else ""
    preserve_info = " (preserve-intent)" if args.preserve_intent else ""
    print(
        f"Calling {len(models)} model(s) ({mode}){focus_info}{persona_info}{preserve_info}: {', '.join(models)}...",
        file=sys.stderr,
    )

    results = call_models_parallel(
        models,
        spec,
        args.round,
        args.doc_type,
        args.press,
        args.focus,
        args.persona,
        context,
        args.preserve_intent,
        args.timeout,
    )

    errors = [r for r in results if r.error]
    for e in errors:
        print(f"Warning: {e.model} returned error: {e.error}", file=sys.stderr)

    successful = [r for r in results if not r.error]
    all_agreed = all(r.agreed for r in successful) if successful else False

    if args.json:
        output = {
            "all_agreed": all_agreed,
            "round": args.round,
            "doc_type": args.doc_type,
            "models": models,
            "focus": args.focus,
            "persona": args.persona,
            "preserve_intent": args.preserve_intent,
            "results": [
                {
                    "model": r.model,
                    "agreed": r.agreed,
                    "response": r.response,
                    "spec": r.spec,
                    "error": r.error,
                    "input_tokens": r.input_tokens,
                    "output_tokens": r.output_tokens,
                    "cost": r.cost,
                }
                for r in results
            ],
            "cost": {
                "total": cost_tracker.total_cost,
                "input_tokens": cost_tracker.total_input_tokens,
                "output_tokens": cost_tracker.total_output_tokens,
                "by_model": cost_tracker.by_model,
            },
        }
        print(json.dumps(output, indent=2))
    else:
        doc_type_name = get_doc_type_name(args.doc_type)
        print(f"\n=== Round {args.round} Results ({doc_type_name}) ===\n")

        for r in results:
            print(f"--- {r.model} ---")
            if r.error:
                print(f"ERROR: {r.error}")
            elif r.agreed:
                print("[AGREE]")
            else:
                print(r.response)
            print()

        if all_agreed:
            print("=== ALL MODELS AGREE ===")
        else:
            agreed_models = [r.model for r in successful if r.agreed]
            disagreed_models = [r.model for r in successful if not r.agreed]
            if agreed_models:
                print(f"Agreed: {', '.join(agreed_models)}")
            if disagreed_models:
                print(f"Critiqued: {', '.join(disagreed_models)}")

        if args.show_cost or True:
            print(cost_tracker.summary())


if __name__ == "__main__":
    main()
