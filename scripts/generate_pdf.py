from weasyprint import HTML
import os

# Ensure dist directory exists
os.makedirs("dist", exist_ok=True)

HTML(".tmp/index.html").write_pdf(
    "dist/cv.pdf",
    pdf_version="1.7",
    uncompressed=True,
    pdf_variant="pdf/ua-1",
    full_fonts=True
)

print("PDF successfully created: dist/cv.pdf")
