"""Provider configuration and profile management."""

import os
import sys
import json
from pathlib import Path

from prompts import FOCUS_AREAS, PERSONAS

PROFILES_DIR = Path.home() / ".config" / "adversarial-spec" / "profiles"

# Cost per 1M tokens (approximate)
MODEL_COSTS = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    "gpt-4": {"input": 30.00, "output": 60.00},
    "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
    "o1": {"input": 15.00, "output": 60.00},
    "o1-mini": {"input": 3.00, "output": 12.00},
    "claude-sonnet-4-20250514": {"input": 3.00, "output": 15.00},
    "claude-opus-4-20250514": {"input": 15.00, "output": 75.00},
    "gemini/gemini-2.0-flash": {"input": 0.075, "output": 0.30},
    "gemini/gemini-pro": {"input": 0.50, "output": 1.50},
    "xai/grok-3": {"input": 3.00, "output": 15.00},
    "xai/grok-beta": {"input": 5.00, "output": 15.00},
    "mistral/mistral-large": {"input": 2.00, "output": 6.00},
    "groq/llama-3.3-70b-versatile": {"input": 0.59, "output": 0.79},
    "deepseek/deepseek-chat": {"input": 0.14, "output": 0.28},
}

DEFAULT_COST = {"input": 5.00, "output": 15.00}


def load_profile(profile_name: str) -> dict:
    """Load a saved profile by name."""
    profile_path = PROFILES_DIR / f"{profile_name}.json"
    if not profile_path.exists():
        print(
            f"Error: Profile '{profile_name}' not found at {profile_path}",
            file=sys.stderr,
        )
        sys.exit(2)

    try:
        return json.loads(profile_path.read_text())
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in profile '{profile_name}': {e}", file=sys.stderr)
        sys.exit(2)


def save_profile(profile_name: str, config: dict):
    """Save a profile to disk."""
    PROFILES_DIR.mkdir(parents=True, exist_ok=True)
    profile_path = PROFILES_DIR / f"{profile_name}.json"
    profile_path.write_text(json.dumps(config, indent=2))
    print(f"Profile saved to {profile_path}")


def list_profiles():
    """List all saved profiles."""
    print("Saved Profiles:\n")
    if not PROFILES_DIR.exists():
        print("  No profiles found.")
        print(f"\n  Profiles are stored in: {PROFILES_DIR}")
        print(
            "\n  Create a profile with: python3 debate.py save-profile <name> --models ... --focus ..."
        )
        return

    profiles = list(PROFILES_DIR.glob("*.json"))
    if not profiles:
        print("  No profiles found.")
        return

    for p in sorted(profiles):
        try:
            config = json.loads(p.read_text())
            name = p.stem
            models = config.get("models", "not set")
            focus = config.get("focus", "none")
            persona = config.get("persona", "none")
            preserve = "yes" if config.get("preserve_intent") else "no"
            print(f"  {name}")
            print(f"    models: {models}")
            print(f"    focus: {focus}")
            print(f"    persona: {persona}")
            print(f"    preserve-intent: {preserve}")
            print()
        except Exception:
            print(f"  {p.stem} [error reading]")


def list_providers():
    """List all supported providers and their API key status."""
    providers = [
        ("OpenAI", "OPENAI_API_KEY", "gpt-4o, gpt-4-turbo, o1"),
        (
            "Anthropic",
            "ANTHROPIC_API_KEY",
            "claude-sonnet-4-20250514, claude-opus-4-20250514",
        ),
        ("Google", "GEMINI_API_KEY", "gemini/gemini-2.0-flash, gemini/gemini-pro"),
        ("xAI", "XAI_API_KEY", "xai/grok-3, xai/grok-beta"),
        ("Mistral", "MISTRAL_API_KEY", "mistral/mistral-large, mistral/codestral"),
        ("Groq", "GROQ_API_KEY", "groq/llama-3.3-70b-versatile"),
        ("Together", "TOGETHER_API_KEY", "together_ai/meta-llama/Llama-3-70b"),
        ("Deepseek", "DEEPSEEK_API_KEY", "deepseek/deepseek-chat"),
    ]

    print("Supported providers:\n")

    for name, key, models in providers:
        status = "[set]" if os.environ.get(key) else "[not set]"
        print(f"  {name:12} {key:24} {status}")
        print(f"             Example models: {models}")
        print()


def list_focus_areas():
    """List available focus areas."""
    print("Available focus areas (--focus):\n")
    for name, description in FOCUS_AREAS.items():
        first_line = (
            description.strip().split("\n")[1]
            if "\n" in description
            else description[:60]
        )
        print(f"  {name:15} {first_line.strip()[:60]}")
    print()


def list_personas():
    """List available personas."""
    print("Available personas (--persona):\n")
    for name, description in PERSONAS.items():
        print(f"  {name}")
        print(f"    {description[:80]}...")
        print()
