from weasyprint import HTML
import os
import sys

# Get company name from command line arguments
company_name = 'default'
if len(sys.argv) > 1:
    company_name = sys.argv[1]

# Ensure dist directory exists
os.makedirs("dist", exist_ok=True)

# Use company name for PDF filename
output_filename = f"cv{'-' + company_name if company_name != 'default' else ''}.pdf"
output_path = os.path.join("dist", output_filename)

HTML(".tmp/index.html").write_pdf(
    output_path,
    pdf_version="1.7",
    uncompressed=True,
    pdf_variant="pdf/ua-1",
    full_fonts=True
)

print(f"PDF successfully created: {output_path}")
