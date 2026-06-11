"""Export the FastAPI OpenAPI document to a committed JSON file at the repo root.

Usage: python -m scripts.export_openapi [--check]

The app import path and output filename are configurable via env vars so each
repo scaffolded from base_app names its contract file correctly without editing
this script:

    OPENAPI_APP_IMPORT       module:attr path to the FastAPI app (default app.main:app)
    OPENAPI_OUTPUT_FILENAME  output file at the repo root (default base-app.openapi.json)

With --check the script generates the document in memory and exits non-zero if it
differs from the committed file, without writing. The CI gate uses this to fail a
PR whose committed contract is stale.
"""

import argparse
import importlib
import json
import os
import sys

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_APP_IMPORT = "app.main:app"
DEFAULT_OUTPUT_FILENAME = "base-app.openapi.json"


def load_app(import_path: str):
    """Import and return the FastAPI app from a 'module:attr' path."""
    if ":" not in import_path:
        raise ValueError(f"OPENAPI_APP_IMPORT must be 'module:attr', got {import_path!r}")
    module_name, attr = import_path.split(":", 1)
    module = importlib.import_module(module_name)
    return getattr(module, attr)


def render(import_path: str) -> str:
    """Return the OpenAPI document as a deterministic JSON string."""
    app = load_app(import_path)
    document = app.openapi()
    return json.dumps(document, indent=2, ensure_ascii=False) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="export_openapi")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if the committed file is stale; do not write.",
    )
    args = parser.parse_args(argv)

    import_path = os.environ.get("OPENAPI_APP_IMPORT", DEFAULT_APP_IMPORT)
    filename = os.environ.get("OPENAPI_OUTPUT_FILENAME", DEFAULT_OUTPUT_FILENAME)
    output_path = os.path.join(_REPO_ROOT, filename)

    generated = render(import_path)

    if args.check:
        if not os.path.isfile(output_path):
            print(f"FAIL: {filename} does not exist. Run: python -m scripts.export_openapi")
            return 1
        with open(output_path, encoding="utf-8") as f:
            committed = f.read()
        if committed != generated:
            print(
                f"FAIL: {filename} is out of date. "
                f"Regenerate with: python -m scripts.export_openapi"
            )
            return 1
        print(f"OK: {filename} matches the generated OpenAPI document.")
        return 0

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(generated)
    print(f"Wrote {filename}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
