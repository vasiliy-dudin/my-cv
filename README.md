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

### Build Mode

Build HTML and generate PDF with interactive YAML file name prompt:

```bash
pnpm run build
```

Build with YAML file name as parameter:

```bash
pnpm run build google
```

This will use `cv-google.yaml` and generate a corresponding PDF without prompting.

### Development Mode

Development mode with interactive YAML file name prompt:

```bash
pnpm run dev
```

Development mode with YAML file name as parameter:

```bash
pnpm run dev google
```

Development mode will generate HTML from the corresponding YAML file and start a development server with live reload on YAML changes.

## File Structure

- `src/data/cv-{name}.yaml` - CV data files for different companies/positions
- `src/data/site.yaml` - Site-wide metadata
- `src/data/cv.private.yaml` - Private data (optional, overrides public data)
- `.tmp/index.html` - Generated HTML for preview
- `dist/cv-{name}.pdf` - Generated PDF files

## Examples

### Interactive Mode Examples

To create a CV for Google with interactive prompt:

```bash
pnpm run build
# When prompted, enter: google
# This will use src/data/cv-google.yaml and create dist/cv-google.pdf
```

To work on a CV in development mode with interactive prompt:

```bash
pnpm run dev
# When prompted, enter: google
# This will start a dev server and watch src/data/cv-google.yaml for changes
```

### Parameter Mode Examples

To create a CV for Google directly with parameter:

```bash
pnpm run build google
# This will use src/data/cv-google.yaml and create dist/cv-google.pdf
```

To work on a CV in development mode with parameter:

```bash
pnpm run dev google
# This will start a dev server and watch src/data/cv-google.yaml for changes
```
