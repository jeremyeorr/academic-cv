# Academic CV Builder

A web-based tool for creating academic CVs and bio-bibliographies in UCSD Bio-Bib format.

## Features

### Personal Information
- Enter your name, department, and professional titles
- Store your basic biographical information

### Employment & Education
- Track your employment history with positions, institutions, and dates
- Document your educational background including degrees and institutions

### Professional Data
- **University Service**: Committee memberships and administrative roles
- **Professional Memberships**: Societies and organizations
- **Honors & Awards**: Recognition and achievements
- **Grants**: Current and previous funding (with agency, amount, role)
- **External Professional Activities**:
  - National committee service
  - Editorial board memberships
  - Ad hoc review work
  - National and international presentations
- **Diversity Contributions**: DEI-related activities and initiatives
- **Other Activities**: Local professional and community presentations
- **Student Instructional Activities**:
  - Teaching courses
  - Formal teaching roles
  - Supervisory activities
  - Mentorship

### Bibliography Management
Organize your scholarly work into categories:

**Primary Work:**
- Original Peer-Reviewed Publications
- Reviews (Invited)
- Books & Chapters
- Editorials
- Commentary
- Case Reports

**Other Work:**
- Abstracts
- Popular Works
- Additional Products

**Work in Progress:** Track manuscripts under development

### PubMed/MEDLINE Import
Import publications directly from PubMed:
1. Click **Import** → **PubMed Publications**
2. Upload a `.txt` file exported from PubMed (MEDLINE format) or paste the text directly
3. Click **Parse Publications** to extract citations
4. Select which publications to import
5. Click **Import X Publications**

**Features:**
- Automatic duplicate detection (by PMID or text matching)
- Automatic categorization (peer-reviewed, reviews, books/chapters)
- Publications sorted by year (oldest to newest)
- Smart feedback showing imported vs. skipped duplicates

### Export Options
- **Export DOCX**: Generate a formatted Microsoft Word document
- **Export JSON**: Save your CV data for backup or sharing
- **Load JSON**: Restore a previously saved CV

### Preview
Click the **Preview** button to see a formatted preview of your CV before exporting.

## Tips

- Save your work regularly using **Export JSON**
- Use the MEDLINE import feature to quickly add publications from PubMed
- The duplicate detection will prevent re-importing the same publications
- Publications are automatically sorted with oldest first, newest last
- All form fields auto-save as you type

## File Formats

### MEDLINE Format
When exporting from PubMed:
1. Select your publications
2. Choose "Send to" → "File"
3. Format: "MEDLINE"
4. Create file
5. Upload the `.txt` file to this tool

### JSON Format
Your CV is stored in JSON format with the following structure:
- `personalInfo`: Basic biographical data
- `employmentHistory`: Array of employment records
- `education`: Array of educational credentials
- `professionalData`: Object containing all professional activities
- `bibliography`: Object containing all publications organized by type

## Technical Notes

- Built with React (embedded in a single HTML file)
- Uses TailwindCSS for styling
- Exports to DOCX using docx.js library
- All data is stored in browser memory (save JSON for persistence)

## License

See LICENSE file for details.
