# Academic CV Builder

A web-based tool for building academic CVs and bio-bib documents in the UCSD Bio-Bib format.

## Features

- **Interactive CV Builder**: Build your academic CV with a clean, intuitive interface
- **UCSD Bio-Bib Format**: Follows the standard UCSD Academic Biography/Bibliography form structure
- **PubMed Integration**: Import publications directly from PubMed using MEDLINE format
- **Duplicate Detection**: Automatically detects and skips duplicate publications during import
- **Export Options**:
  - Export to DOCX (Word format) for submission
  - Export to JSON for backup and portability
- **Comprehensive Sections**:
  - Personal Information
  - Employment History
  - Education & Certifications
  - Professional Data (grants, service, awards, etc.)
  - Bibliography (publications, abstracts, work in progress)

## Getting Started

1. Open `index.html` in a web browser
2. Start building your CV by filling in each section
3. Use the Import feature to add publications from PubMed
4. Export your completed CV as DOCX or JSON

## Importing Publications from PubMed

1. Go to [PubMed](https://pubmed.ncbi.nlm.nih.gov/)
2. Search for your publications
3. Select the citations you want to import
4. Click "Send to" → "File" → Format: "MEDLINE"
5. Download the .txt file
6. In the CV Builder, click "Import" and upload the file

The tool will automatically categorize publications into:
- Original Peer-Reviewed Work
- Review and Invited Articles
- Books and Book Chapters

## File Structure

- `index.html` - Main application (single-page application)
- `biobib-cv-builder-v2.jsx` - React component source (embedded in HTML)

## Technical Details

Built with:
- React 18
- TailwindCSS for styling
- docx library for Word document generation
- Pure JavaScript MEDLINE parser

No build step required - runs entirely in the browser.

## License

See LICENSE file for details.
