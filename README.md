# CV Generator

A simple CV generator that creates HTML from templates and PDF from HTML.

## Installation

```bash
pnpm install

# In WSL for WeasyPrint
python3 -m venv venv
source venv/bin/activate
pip install weasyprint
```

## Usage

### Basic Commands

```bash
# Create PDF with interactive YAML file selection
pnpm run build

# Create PDF for a specific YAML file
pnpm run build google

# Development mode with auto-refresh
pnpm run dev google
```

### Parameters

```bash
# Save to public folder instead of dist
pnpm run build cv-general public

# Set output PDF filename
pnpm run build cv-general pdf-name=my-resume

# Filename with spaces (in quotes)
pnpm run build cv-general pdf-name="My CV 2025"

# Combine parameters
pnpm run build cv-general public pdf-name="My CV"
```

## File Structure

- `src/data/{name}.yaml` - CV data for different companies/positions
- `src/data/site.yaml` - Common metadata
- `src/data/cv.private.yaml` - Personal data (optional)
- `.tmp/index.html` - Generated HTML for preview
- `dist/{name}.pdf` - Generated PDF files
