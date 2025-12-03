from weasyprint import HTML
import os
import sys

# Get command line arguments
file_name = 'default'
output_dir = 'dist'
custom_pdf_name = None

# Get file name from command line arguments
if len(sys.argv) > 1:
    file_name = sys.argv[1]

# Get output directory if specified
if len(sys.argv) > 2:
    output_dir = sys.argv[2]

# Get custom PDF name if specified
if len(sys.argv) > 3:
    custom_pdf_name = sys.argv[3]
    # Remove quotes if present
    if (custom_pdf_name.startswith('"') and custom_pdf_name.endswith('"')) or \
       (custom_pdf_name.startswith('\'') and custom_pdf_name.endswith('\'')):
        custom_pdf_name = custom_pdf_name[1:-1]

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Use custom PDF name if provided, otherwise use YAML file name
if custom_pdf_name:
    output_filename = f"{custom_pdf_name}.pdf"
else:
    output_filename = f"{file_name}.pdf"

output_path = os.path.join(output_dir, output_filename)

HTML(".tmp/index.html").write_pdf(
    output_path,
    pdf_version="1.7",
    uncompressed=True,
    pdf_variant="pdf/ua-1",
    full_fonts=True
)

print(f"PDF successfully created: {output_path}")
