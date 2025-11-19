# CV Generator

Simple CV generator that builds HTML from templates and generates PDF using WeasyPrint.

All content is stored in simple YAML files, making it easy to quickly adapt your CV for specific job openings.

## Tech Stack

- **Templates**: [Nunjucks](https://mozilla.github.io/nunjucks/)
- **PDF**: [WeasyPrint](https://weasyprint.org/) (Python)

## Setup

Install dependencies:

```bash
pnpm install
```

Setup Python environment (WSL on Windows):

```bash
# In WSL
python3 -m venv venv
source venv/bin/activate
pip install weasyprint
```

## Usage

Build HTML and generate PDF:

```bash
pnpm run build
```

Or run separately:

```bash
# Build HTML only
pnpm run _build-html

# Generate PDF only (requires HTML build first)
pnpm run _build-pdf
```
