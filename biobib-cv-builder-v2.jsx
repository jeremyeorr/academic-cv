import React, { useState, useRef, useCallback } from 'react';

// Initial empty CV state matching biobib structure
const emptyCV = {
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    department: '',
    titles: []
  },
  employmentHistory: [],
  education: [],
  subspecializations: [],
  professionalData: {
    universityService: [],
    memberships: [],
    honorsAwards: [],
    currentGrants: [],
    previousGrants: [],
    externalProfessional: {
      nationalCommittee: [],
      editorialBoard: [],
      adHocReview: [],
      nationalPresentations: [],
      internationalPresentations: []
    },
    diversityContributions: [],
    otherActivities: {
      localProfessional: [],
      communityPresentations: []
    },
    studentInstructional: {
      teachingCourses: [],
      formalTeaching: [],
      supervisory: [],
      mentorship: []
    },
    externalReviews: []
  },
  bibliography: {
    primaryWork: {
      originalPeerReviewed: [],
      reviewInvited: [],
      booksChapters: [],
      editorials: [],
      commentary: [],
      caseReports: []
    },
    otherWork: {
      abstracts: [],
      popularWorks: [],
      additionalProducts: []
    },
    workInProgress: []
  },
  publicationsLink: '',
  lastUpdated: null
};

// Icons as simple SVG components
const Icons = {
  Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ChevronDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  GraduationCap: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Award: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  BookOpen: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Globe: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Database: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  File: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  AlertCircle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  QuestionCircle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// ==================== MEDLINE PARSER ====================
function parseMedline(text) {
  // Normalize line endings (handle Windows \r\n and old Mac \r)
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const publications = [];
  const records = text.split(/\n\nPMID-/).map((r, i) => i === 0 ? r : 'PMID-' + r);
  
  for (const record of records) {
    if (!record.trim()) continue;
    
    const fields = {};
    let currentField = null;
    let currentValue = [];
    
    const lines = record.split('\n');
    for (const line of lines) {
      // Check if this is a new field (2-4 char code followed by dash and space)
      const fieldMatch = line.match(/^([A-Z]{2,4})\s*-\s*(.*)$/);
      if (fieldMatch) {
        // Save previous field
        if (currentField) {
          if (!fields[currentField]) fields[currentField] = [];
          fields[currentField].push(currentValue.join(' ').trim());
        }
        currentField = fieldMatch[1];
        currentValue = [fieldMatch[2]];
      } else if (currentField && line.match(/^\s{2,}/)) {
        // Continuation line (starts with whitespace)
        currentValue.push(line.trim());
      }
    }
    // Save last field
    if (currentField) {
      if (!fields[currentField]) fields[currentField] = [];
      fields[currentField].push(currentValue.join(' ').trim());
    }
    
    // Build citation
    if (fields.TI && fields.TI[0]) {
      const authors = (fields.AU || []).join(', ');
      const title = fields.TI[0];
      const journal = fields.TA ? fields.TA[0] : (fields.JT ? fields.JT[0] : '');
      const year = fields.DP ? fields.DP[0].substring(0, 4) : '';
      const volume = fields.VI ? fields.VI[0] : '';
      const issue = fields.IP ? fields.IP[0] : '';
      const pages = fields.PG ? fields.PG[0] : '';
      const pmid = fields.PMID ? fields.PMID[0] : '';
      const doi = fields.LID ? fields.LID.find(l => l.includes('[doi]'))?.replace(' [doi]', '') : '';
      
      // Determine publication type
      const pubTypes = fields.PT || [];
      const isReview = pubTypes.some(pt => pt.toLowerCase().includes('review'));
      const isBookChapter = pubTypes.some(pt => pt.toLowerCase().includes('book') || pt.toLowerCase().includes('chapter'));
      
      // Format citation
      let citation = '';
      if (authors) citation += authors + '. ';
      citation += title;
      if (!title.endsWith('.')) citation += '.';
      if (journal) {
        citation += ' ' + journal + '.';
        if (year) citation += ' ' + year;
        if (volume) {
          citation += ';' + volume;
          if (issue) citation += '(' + issue + ')';
        }
        if (pages) citation += ':' + pages;
        citation += '.';
      }
      if (doi) citation += ' doi:' + doi;
      if (pmid) citation += ' PMID:' + pmid;
      
      publications.push({
        id: Date.now() + Math.random(),
        text: citation.trim(),
        pmid,
        year: parseInt(year) || 0,
        isReview,
        isBookChapter
      });
    }
  }
  
  // Sort by year ascending (newest last)
  publications.sort((a, b) => a.year - b.year);
  
  return publications;
}

// ==================== DOCX TEXT EXTRACTOR ====================
async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Simple ZIP parser to find document.xml
  // Look for PK signature and find word/document.xml
  let text = '';
  
  try {
    // Use JSZip-like approach - find the document.xml content
    const decoder = new TextDecoder('utf-8');
    const content = decoder.decode(uint8Array);
    
    // Extract text between <w:t> tags (Word text elements)
    const textMatches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    if (textMatches) {
      text = textMatches
        .map(match => {
          const inner = match.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
          return inner ? inner[1] : '';
        })
        .join(' ')
        .replace(/\s+/g, ' ');
    }
  } catch (e) {
    console.error('DOCX parsing error:', e);
  }
  
  return text;
}

// Parse extracted DOCX text into CV structure
function parseDocxToCV(text) {
  const cv = JSON.parse(JSON.stringify(emptyCV));
  
  // Try to find name patterns
  const namePatterns = [
    /Name:\s*([^,\n]+),\s*([^\n]+)/i,
    /([A-Z][a-z]+)\s+([A-Z]\.?\s+)?([A-Z][a-z]+)/,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[1] && match[1].includes(',')) {
        // Last, First format
        cv.personalInfo.lastName = match[1].trim();
        const firstMiddle = (match[2] || '').split(' ');
        cv.personalInfo.firstName = firstMiddle[0] || '';
        cv.personalInfo.middleName = firstMiddle.slice(1).join(' ') || '';
      }
      break;
    }
  }
  
  // Try to find department
  const deptMatch = text.match(/Department[:\s]+([^\n,]+)/i);
  if (deptMatch) cv.personalInfo.department = deptMatch[1].trim();
  
  // Try to find title
  const titleMatch = text.match(/Title[s]?[:\s]+([^\n]+)/i);
  if (titleMatch) {
    cv.personalInfo.titles = [{ id: Date.now(), text: titleMatch[1].trim() }];
  }
  
  return cv;
}

// Section configurations
const sections = [
  { id: 'personal', title: 'Personal Information', icon: 'User' },
  { id: 'employment', title: 'Employment History', icon: 'Briefcase' },
  { id: 'education', title: 'Education', icon: 'GraduationCap' },
  { id: 'professional', title: 'Professional Data', icon: 'Award' },
  { id: 'bibliography', title: 'Bibliography', icon: 'BookOpen' }
];

const professionalSubsections = [
  { id: 'universityService', title: 'University Service', description: 'Departmental, college, Academic Senate, campuswide, systemwide', type: 'simple' },
  { id: 'memberships', title: 'Memberships', description: 'Scholarly societies, professional boards, civic organizations', type: 'simple' },
  { id: 'honorsAwards', title: 'Honors and Awards', description: 'Include dates received', type: 'simple' },
  { id: 'grants', title: 'Contracts and Grants', description: 'Current and previous contracts and grants', type: 'grants' },
  { id: 'externalProfessional', title: 'External Professional Activities', description: 'Technical service, reviewer roles, committee service', type: 'nested', 
    subsections: [
      { id: 'nationalCommittee', title: 'National Committee Service' },
      { id: 'editorialBoard', title: 'Editorial Board' },
      { id: 'adHocReview', title: 'Ad Hoc Review' },
      { id: 'nationalPresentations', title: 'National Presentations' },
      { id: 'internationalPresentations', title: 'International Presentations' }
    ]
  },
  { id: 'diversityContributions', title: 'Diversity Contributions', description: 'Promoting diversity in scholarship, teaching, and service', type: 'simple' },
  { id: 'otherActivities', title: 'Other Activities', description: 'Community service and other activities', type: 'nested',
    subsections: [
      { id: 'localProfessional', title: 'Local Professional Presentations' },
      { id: 'communityPresentations', title: 'Community Presentations' }
    ]
  },
  { id: 'studentInstructional', title: 'Student Instructional Activities', description: '', type: 'studentInstructional',
    subsections: [
      { id: 'teachingCourses', title: 'Teaching of Students in Courses' },
      { id: 'formalTeaching', title: 'Formal Teaching of Residents, Clinical Fellows and Research Fellows' },
      { id: 'supervisory', title: 'Supervisory and Training Responsibilities' },
      { id: 'mentorship', title: 'Mentorship of Trainees' }
    ]
  },
  { id: 'externalReviews', title: 'External Reviews', description: 'Independent reviews or feature articles appearing in journals or online venues, major newspapers, books, or catalogs', type: 'simple' }
];

const bibliographySubsections = {
  primaryWork: [
    { id: 'originalPeerReviewed', title: 'Original Peer-Reviewed Work' },
    { id: 'reviewInvited', title: 'Review and Invited Articles' },
    { id: 'booksChapters', title: 'Books and Book Chapters' },
    { id: 'editorials', title: 'Editorials' },
    { id: 'commentary', title: 'Commentary' },
    { id: 'caseReports', title: 'Case Reports' }
  ],
  otherWork: [
    { id: 'abstracts', title: 'Abstracts' },
    { id: 'popularWorks', title: 'Popular Works' },
    { id: 'additionalProducts', title: 'Additional Products' }
  ]
};

// Input component
const Input = ({ label, value, onChange, placeholder, multiline, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-xs font-medium text-slate-600">{label}</label>}
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
      />
    )}
  </div>
);

// Button component
const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }) => {
  const baseStyles = "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-200 disabled:opacity-50";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-slate-600 hover:bg-slate-100",
    pubmed: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
  };
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

// Collapsible Section
const CollapsibleSection = ({ title, iconName, children, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = Icons[iconName] || Icons.FileText;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
          <Icon />
        </div>
        <span className="flex-1 text-left font-medium text-slate-700 text-sm">{title}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
        {isOpen ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Simple List Editor
const SimpleListEditor = ({ items, setItems, placeholder }) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), text: newItem.trim() }]);
      setNewItem('');
    }
  };

  const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], text: value };
    setItems(updated);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id || index} className="flex gap-2 items-start">
          <textarea
            value={item.text || item}
            onChange={(e) => updateItem(index, e.target.value)}
            rows={2}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
          <button onClick={() => deleteItem(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <Icons.Trash />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <textarea
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="flex-1 px-3 py-2 bg-white border-2 border-dashed border-teal-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
        <Button onClick={addItem} size="sm" className="self-end"><Icons.Plus /></Button>
      </div>
    </div>
  );
};

// List Item Editor for structured entries
const ListItemEditor = ({ items, setItems, fields, itemName }) => {
  const [newItem, setNewItem] = useState({});

  const addItem = () => {
    if (Object.values(newItem).some(v => v && v.trim())) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({});
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id || index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">{itemName} #{index + 1}</span>
            <button onClick={() => deleteItem(index)} className="p-1 text-slate-400 hover:text-red-500 rounded">
              <Icons.Trash />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fields.map(field => (
              <Input
                key={field.id}
                label={field.label}
                value={item[field.id] || ''}
                onChange={(value) => updateItem(index, field.id, value)}
                placeholder={field.placeholder}
                className={field.fullWidth ? 'col-span-2' : ''}
              />
            ))}
          </div>
        </div>
      ))}
      
      <div className="p-3 bg-teal-50/50 rounded-lg border-2 border-dashed border-teal-200 space-y-2">
        <span className="text-xs font-medium text-teal-600">Add New {itemName}</span>
        <div className="grid grid-cols-2 gap-2">
          {fields.map(field => (
            <Input
              key={field.id}
              label={field.label}
              value={newItem[field.id] || ''}
              onChange={(value) => setNewItem({ ...newItem, [field.id]: value })}
              placeholder={field.placeholder}
              className={field.fullWidth ? 'col-span-2' : ''}
            />
          ))}
        </div>
        <Button onClick={addItem} size="sm"><Icons.Plus /> save/add</Button>
      </div>
    </div>
  );
};

// Import Modal Component
const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState(null);
  const [medlineText, setMedlineText] = useState('');
  const [parsedPubs, setParsedPubs] = useState([]);
  const [selectedPubs, setSelectedPubs] = useState(new Set());
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleMedlineParse = () => {
    const pubs = parseMedline(medlineText);
    setParsedPubs(pubs);
    setSelectedPubs(new Set(pubs.map(p => p.id)));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setMedlineText(text);
      const pubs = parseMedline(text);
      setParsedPubs(pubs);
      setSelectedPubs(new Set(pubs.map(p => p.id)));
    }
  };

  const handleImportPubs = () => {
    const selected = parsedPubs.filter(p => selectedPubs.has(p.id));
    const reviews = selected.filter(p => p.isReview);
    const books = selected.filter(p => p.isBookChapter);
    const original = selected.filter(p => !p.isReview && !p.isBookChapter);
    
    onImport({
      type: 'publications',
      data: { original, reviews, books }
    });
    onClose();
  };

  const togglePub = (id) => {
    const newSelected = new Set(selectedPubs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPubs(newSelected);
  };

  const selectAll = () => setSelectedPubs(new Set(parsedPubs.map(p => p.id)));
  const selectNone = () => setSelectedPubs(new Set());

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between bg-gradient-to-r from-teal-600 to-blue-600">
          <h2 className="font-bold text-white text-lg">Import Data</h2>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg">
            <Icons.X />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!importType ? (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Choose what you'd like to import:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setImportType('medline')}
                  className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-200">
                    <Icons.Database />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">PubMed Publications</h3>
                  <p className="text-sm text-slate-500">Import from MEDLINE format export</p>
                </button>
                
                <button
                  onClick={() => setImportType('docx')}
                  className="p-6 border-2 border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 mb-3 group-hover:bg-teal-200">
                    <Icons.File />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Previous Bio-Bib (DOCX)</h3>
                  <p className="text-sm text-slate-500">Import from existing Word document</p>
                </button>
              </div>
            </div>
          ) : importType === 'medline' ? (
            <div className="space-y-4">
              <button onClick={() => { setImportType(null); setParsedPubs([]); setMedlineText(''); }} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
                ← Back to options
              </button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Icons.Database /> Import from PubMed (MEDLINE Format)
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  To export from PubMed: Search → Select citations → Send to → Choose "File" → Format "MEDLINE"
                </p>
                
                <div className="flex gap-2 mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Icons.Upload /> Upload .txt file
                  </Button>
                </div>
                
                <textarea
                  value={medlineText}
                  onChange={(e) => setMedlineText(e.target.value)}
                  placeholder="Or paste MEDLINE formatted text here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                
                {medlineText && parsedPubs.length === 0 && (
                  <Button variant="pubmed" size="sm" onClick={handleMedlineParse} className="mt-2">
                    Parse Publications
                  </Button>
                )}
              </div>
              
              {parsedPubs.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">
                      Found {parsedPubs.length} publications ({selectedPubs.size} selected)
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={selectAll} className="text-xs text-teal-600 hover:underline">Select all</button>
                      <span className="text-slate-300">|</span>
                      <button onClick={selectNone} className="text-xs text-teal-600 hover:underline">Select none</button>
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {parsedPubs.map(pub => (
                      <label
                        key={pub.id}
                        className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPubs.has(pub.id)}
                          onChange={() => togglePub(pub.id)}
                          className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 line-clamp-2">{pub.text}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs text-slate-400">{pub.year}</span>
                            {pub.isReview && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded">Review</span>}
                            {pub.isBookChapter && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">Book/Chapter</span>}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <Button onClick={handleImportPubs} disabled={selectedPubs.size === 0}>
                    Import {selectedPubs.size} Publications
                  </Button>
                </div>
              )}
            </div>
          ) : importType === 'docx' ? (
            <div className="space-y-4">
              <button onClick={() => setImportType(null)} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
                ← Back to options
              </button>
              
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                  <Icons.File /> Import from Previous Bio-Bib
                </h3>
                <p className="text-sm text-teal-700 mb-4">
                  Upload your existing Bio-Bib Word document (.docx). We'll extract what we can, but you may need to review and adjust the imported data.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-800 flex items-start gap-2">
                    <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Note:</strong> DOCX parsing may not capture all formatting perfectly. For best results, 
                      export your CV data as JSON from this tool and re-import it later. Publications are better 
                      imported via the PubMed/MEDLINE option.
                    </span>
                  </p>
                </div>
                
                <input
                  type="file"
                  accept=".docx"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const text = await extractTextFromDocx(file);
                      const cvData = parseDocxToCV(text);
                      onImport({ type: 'cv', data: cvData });
                      onClose();
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700 file:cursor-pointer"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// README Modal Component
const ReadmeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between bg-gradient-to-r from-teal-600 to-blue-600">
          <h2 className="font-bold text-white text-lg">Help & Documentation</h2>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-lg">
            <Icons.X />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Academic CV Builder</h1>
            <p className="text-slate-600 mb-4">A web-based tool for creating academic CVs and bio-bibliographies in UCSD Bio-Bib format.</p>

            <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">Features</h2>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li>Enter your name, department, and professional titles</li>
              <li>Store your basic biographical information</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Employment & Education</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li>Track your employment history with positions, institutions, and dates</li>
              <li>Document your educational background including degrees and institutions</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Professional Data</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li><strong>University Service:</strong> Committee memberships and administrative roles</li>
              <li><strong>Professional Memberships:</strong> Societies and organizations</li>
              <li><strong>Honors & Awards:</strong> Recognition and achievements</li>
              <li><strong>Grants:</strong> Current and previous funding (with agency, amount, role)</li>
              <li><strong>External Professional Activities:</strong> National committee service, editorial boards, ad hoc reviews, presentations</li>
              <li><strong>Diversity Contributions:</strong> DEI-related activities and initiatives</li>
              <li><strong>Student Instructional Activities:</strong> Teaching, supervision, mentorship</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Bibliography Management</h3>
            <p className="text-slate-600 mb-2">Organize your scholarly work into categories:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li><strong>Primary Work:</strong> Original peer-reviewed publications, reviews, books & chapters, editorials, commentary, case reports</li>
              <li><strong>Other Work:</strong> Abstracts, popular works, additional products</li>
              <li><strong>Work in Progress:</strong> Track manuscripts under development</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">PubMed/MEDLINE Import</h3>
            <p className="text-slate-600 mb-2">Import publications directly from PubMed:</p>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 mb-2">
              <li>Click <strong>Import</strong> → <strong>PubMed Publications</strong></li>
              <li>Upload a .txt file exported from PubMed (MEDLINE format) or paste the text directly</li>
              <li>Click <strong>Parse Publications</strong> to extract citations</li>
              <li>Select which publications to import</li>
              <li>Click <strong>Import X Publications</strong></li>
            </ol>
            <p className="text-slate-600 font-semibold mb-1">Features:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li>Automatic duplicate detection (by PMID or text matching)</li>
              <li>Automatic categorization (peer-reviewed, reviews, books/chapters)</li>
              <li>Publications sorted by year (oldest to newest)</li>
              <li>Smart feedback showing imported vs. skipped duplicates</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Export Options</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li><strong>Export DOCX:</strong> Generate a formatted Microsoft Word document</li>
              <li><strong>Export JSON:</strong> Save your CV data for backup or sharing</li>
              <li><strong>Load JSON:</strong> Restore a previously saved CV</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-2">Preview</h3>
            <p className="text-slate-600 mb-4">Click the <strong>Preview</strong> button to see a formatted preview of your CV before exporting.</p>

            <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">Tips</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
              <li>Save your work regularly using <strong>Export JSON</strong></li>
              <li>Use the MEDLINE import feature to quickly add publications from PubMed</li>
              <li>The duplicate detection will prevent re-importing the same publications</li>
              <li>Publications are automatically sorted with oldest first, newest last</li>
              <li>All form fields auto-save as you type</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">Exporting from PubMed</h2>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 mb-4">
              <li>Select your publications on PubMed</li>
              <li>Choose "Send to" → "File"</li>
              <li>Format: "MEDLINE"</li>
              <li>Create file</li>
              <li>Upload the .txt file to this tool using <strong>Import</strong> → <strong>PubMed Publications</strong></li>
            </ol>
          </div>
        </div>

        <div className="px-5 py-3 border-t bg-slate-50 flex justify-end">
          <Button onClick={onClose} size="sm">Close</Button>
        </div>
      </div>
    </div>
  );
};

// Main Application
export default function BioBibBuilder() {
  const [cv, setCV] = useState(emptyCV);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showReadme, setShowReadme] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const updateCV = useCallback((path, value) => {
    setCV(prev => {
      const newCV = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newCV;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      newCV.lastUpdated = new Date().toISOString();
      return newCV;
    });
  }, []);

  // Helper function to check if a publication already exists
  const isDuplicate = (newPub, existingPubs) => {
    for (const existing of existingPubs) {
      // Get PMID from both new and existing publication
      const newPmid = newPub.pmid;
      const existingPmid = typeof existing === 'object' ? existing.pmid : null;

      // If both have PMID and they match, it's a duplicate
      if (newPmid && existingPmid && newPmid === existingPmid) {
        return true;
      }

      // Fall back to text comparison if no PMID match
      const newText = newPub.text || newPub;
      const existingText = typeof existing === 'object' ? (existing.text || existing) : existing;

      // Check if texts are identical (case-insensitive, trimmed)
      if (typeof newText === 'string' && typeof existingText === 'string') {
        if (newText.trim().toLowerCase() === existingText.trim().toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  };

  const handleImport = ({ type, data }) => {
    if (type === 'cv') {
      setCV(prev => ({ ...prev, ...data, lastUpdated: new Date().toISOString() }));
      setMessage({ type: 'success', text: 'CV data imported! Please review and complete.' });
    } else if (type === 'publications') {
      let importedCount = 0;
      let skippedCount = 0;

      setCV(prev => {
        const newCV = JSON.parse(JSON.stringify(prev));

        // Filter out duplicates from original peer-reviewed
        const newOriginal = data.original.filter(pub => {
          const exists = isDuplicate(pub, newCV.bibliography.primaryWork.originalPeerReviewed);
          if (exists) skippedCount++;
          else importedCount++;
          return !exists;
        });

        // Filter out duplicates from reviews
        const newReviews = data.reviews.filter(pub => {
          const exists = isDuplicate(pub, newCV.bibliography.primaryWork.reviewInvited);
          if (exists) skippedCount++;
          else importedCount++;
          return !exists;
        });

        // Filter out duplicates from books/chapters
        const newBooks = data.books.filter(pub => {
          const exists = isDuplicate(pub, newCV.bibliography.primaryWork.booksChapters);
          if (exists) skippedCount++;
          else importedCount++;
          return !exists;
        });

        newCV.bibliography.primaryWork.originalPeerReviewed = [
          ...newCV.bibliography.primaryWork.originalPeerReviewed,
          ...newOriginal
        ];
        newCV.bibliography.primaryWork.reviewInvited = [
          ...newCV.bibliography.primaryWork.reviewInvited,
          ...newReviews
        ];
        newCV.bibliography.primaryWork.booksChapters = [
          ...newCV.bibliography.primaryWork.booksChapters,
          ...newBooks
        ];
        newCV.lastUpdated = new Date().toISOString();
        return newCV;
      });

      let message = '';
      if (importedCount > 0 && skippedCount > 0) {
        message = `Imported ${importedCount} publication${importedCount !== 1 ? 's' : ''}, skipped ${skippedCount} duplicate${skippedCount !== 1 ? 's' : ''}`;
      } else if (importedCount > 0) {
        message = `Imported ${importedCount} publication${importedCount !== 1 ? 's' : ''}!`;
      } else {
        message = `All ${skippedCount} publication${skippedCount !== 1 ? 's were' : ' was'} already present`;
      }

      setMessage({ type: 'success', text: message });
      setActiveSection('bibliography');
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        setCV({ ...emptyCV, ...parsed, lastUpdated: new Date().toISOString() });
        setMessage({ type: 'success', text: 'CV loaded successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Please use a .json file or use Import for other formats.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to parse file.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(cv, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biobib_${cv.personalInfo.lastName || 'cv'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'JSON exported!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Export to DOCX using docx library (loaded from CDN)
  const exportDOCX = async () => {
    setMessage({ type: 'success', text: 'Generating DOCX... please wait' });
    
    try {
      // Dynamically load docx library from CDN if not already loaded
      if (!window.docx) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/docx.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak } = window.docx;

      // Helper functions
      const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
      const borders = { top: border, bottom: border, left: border, right: border };
      const noBorders = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

      const sectionHeading = (text) => new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text, bold: true })],
        spacing: { before: 400, after: 200 }
      });

      const subsectionHeading = (text) => new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text, bold: true })],
        spacing: { before: 300, after: 150 }
      });

      const subsubsectionHeading = (text) => new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22 })],
        spacing: { before: 200, after: 100 }
      });

      const normalParagraph = (text, indent = false) => new Paragraph({
        children: [new TextRun({ text: text || '', size: 22 })],
        indent: indent ? { left: 360 } : undefined,
        spacing: { after: 100 }
      });

      // Tab-separated entry with date first: "date\tfield1\tfield2..."
      const tabbedEntry = (fields, indent = true) => new Paragraph({
        children: fields.map((field, i) => 
          new TextRun({ text: (field || '') + (i < fields.length - 1 ? '\t' : ''), size: 22 })
        ),
        indent: indent ? { left: 360 } : undefined,
        spacing: { after: 100 },
        tabStops: [
          { type: 'left', position: 1800 },  // First tab stop at 1.25 inches
          { type: 'left', position: 5400 },  // Second tab stop
          { type: 'left', position: 7200 },  // Third tab stop
        ]
      });

      const children = [];

      // Title
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'UCSD ACADEMIC BIOGRAPHY/BIBLIOGRAPHY FORM', bold: true, size: 28 })],
        spacing: { after: 400 }
      }));

      // Personal Info
      const fullName = `${cv.personalInfo.lastName || ''}, ${cv.personalInfo.firstName || ''}${cv.personalInfo.middleName ? ' ' + cv.personalInfo.middleName : ''}`;
      const titlesText = cv.personalInfo.titles?.map(t => t.text || t).join('; ') || '';
      
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Name:', bold: true, size: 22 })] })] }),
              new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: fullName, size: 22 })] })] }),
              new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Title(s):', bold: true, size: 22 })] })] }),
              new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: titlesText, size: 22 })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Department:', bold: true, size: 22 })] })] }),
              new TableCell({ borders: noBorders, columnSpan: 3, children: [new Paragraph({ children: [new TextRun({ text: cv.personalInfo.department || '', size: 22 })] })] }),
            ]
          })
        ]
      }));

      children.push(new Paragraph({ spacing: { before: 300 } }));

      // Section I: Employment and Education
      children.push(sectionHeading('Section I: Employment History and Education'));
      children.push(subsectionHeading('Previous Applicable Employment'));

      if (cv.employmentHistory?.length > 0) {
        const empRows = [
          new TableRow({
            children: ['Period', 'Institution', 'Location', 'Position'].map(text =>
              new TableCell({ borders, shading: { fill: "E8E8E8", type: ShadingType.CLEAR }, 
                children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })] })] })
            )
          })
        ];
        cv.employmentHistory.forEach(emp => {
          empRows.push(new TableRow({
            children: [
              `${emp.fromDate || ''}-${emp.toDate || ''}`,
              emp.institution || '',
              emp.location || '',
              emp.position || ''
            ].map(text => new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })] }))
          }));
        });
        children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: empRows }));
      }

      children.push(subsectionHeading('Education'));
      if (cv.education?.length > 0) {
        const eduRows = [
          new TableRow({
            children: ['Institution', 'Dates', 'Location', 'Major', 'Degree', 'Year'].map(text =>
              new TableCell({ borders, shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })] })] })
            )
          })
        ];
        cv.education.forEach(edu => {
          eduRows.push(new TableRow({
            children: [
              edu.institution || '', edu.dates || '', edu.location || '',
              edu.major || '', edu.degree || '', edu.dateReceived || ''
            ].map(text => new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })] }))
          }));
        });
        children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: eduRows }));
      }

      // Certifications
      if (cv.subspecializations?.length > 0) {
        children.push(subsectionHeading('Sub-specializations, Board Certifications, Licenses'));
        cv.subspecializations.forEach(cert => {
          children.push(tabbedEntry([cert.date || '', cert.text || '']));
        });
      }

      // Section II: Professional Data
      children.push(new Paragraph({ children: [new PageBreak()] }));
      children.push(sectionHeading('Section II: Professional Data'));

      // University Service
      if (cv.professionalData.universityService?.length > 0) {
        children.push(subsectionHeading('(a) University Service'));
        cv.professionalData.universityService.forEach(item => {
          children.push(tabbedEntry([item.date || '', item.text || '']));
        });
      }

      // Memberships
      if (cv.professionalData.memberships?.length > 0) {
        children.push(subsectionHeading('(b) Memberships'));
        cv.professionalData.memberships.forEach(item => {
          children.push(tabbedEntry([item.date || '', item.text || '']));
        });
      }

      // Honors and Awards
      if (cv.professionalData.honorsAwards?.length > 0) {
        children.push(subsectionHeading('(c) Honors and Awards'));
        cv.professionalData.honorsAwards.forEach(item => {
          children.push(tabbedEntry([item.date || '', item.text || '']));
        });
      }

      // Grants
      const hasCurrentGrants = cv.professionalData.currentGrants?.length > 0;
      const hasPreviousGrants = cv.professionalData.previousGrants?.length > 0;
      if (hasCurrentGrants || hasPreviousGrants) {
        children.push(subsectionHeading('(d) Contracts and Grants'));
        
        const createGrantTable = (grants, title) => {
          if (!grants?.length) return;
          children.push(subsubsectionHeading(title));
          const rows = [
            new TableRow({
              children: ['Title', 'Agency', 'Grant #', 'Amount', 'Period', 'Role'].map(text =>
                new TableCell({ borders, shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })] })
              )
            })
          ];
          grants.forEach(g => {
            rows.push(new TableRow({
              children: [g.title, g.agency, g.grantNumber, g.amount, g.period, g.role].map(text =>
                new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text: text || '', size: 18 })] })] })
              )
            }));
          });
          children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
        };
        
        createGrantTable(cv.professionalData.currentGrants, 'Current Grants');
        createGrantTable(cv.professionalData.previousGrants, 'Previous Grants');
      }

      // External Professional Activities
      const extProf = cv.professionalData.externalProfessional;
      if (extProf && Object.values(extProf).some(arr => arr?.length > 0)) {
        children.push(subsectionHeading('(e) External Professional Activities'));
        const subSections = [
          { key: 'nationalCommittee', title: 'National Committee Service' },
          { key: 'editorialBoard', title: 'Editorial Board' },
          { key: 'adHocReview', title: 'Ad Hoc Review' },
          { key: 'nationalPresentations', title: 'National Presentations' },
          { key: 'internationalPresentations', title: 'International Presentations' }
        ];
        subSections.forEach(({ key, title }) => {
          if (extProf[key]?.length > 0) {
            children.push(subsubsectionHeading(title));
            extProf[key].forEach(item => {
              children.push(tabbedEntry([item.date || '', item.text || '']));
            });
          }
        });
      }

      // Diversity Contributions
      if (cv.professionalData.diversityContributions?.length > 0) {
        children.push(subsectionHeading('(f) Most Significant Contributions to Promoting Diversity'));
        cv.professionalData.diversityContributions.forEach(item => {
          children.push(tabbedEntry([item.date || '', item.text || '']));
        });
      }

      // Other Activities
      const otherAct = cv.professionalData.otherActivities;
      if (otherAct && (otherAct.localProfessional?.length > 0 || otherAct.communityPresentations?.length > 0)) {
        children.push(subsectionHeading('(g) Other Activities'));
        if (otherAct.localProfessional?.length > 0) {
          children.push(subsubsectionHeading('Local Professional Presentations'));
          otherAct.localProfessional.forEach(item => {
            children.push(tabbedEntry([item.date || '', item.text || '']));
          });
        }
        if (otherAct.communityPresentations?.length > 0) {
          children.push(subsubsectionHeading('Community Presentations'));
          otherAct.communityPresentations.forEach(item => {
            children.push(tabbedEntry([item.date || '', item.text || '']));
          });
        }
      }

      // Student Instructional
      const studentInst = cv.professionalData.studentInstructional;
      if (studentInst && (studentInst.teachingCourses?.length > 0 || studentInst.formalTeaching?.length > 0 || 
          studentInst.supervisory?.length > 0 || studentInst.mentorship?.length > 0)) {
        children.push(subsectionHeading('(h) Student Instructional Activities'));
        
        if (studentInst.teachingCourses?.length > 0) {
          children.push(subsubsectionHeading('Teaching of Students in Courses'));
          studentInst.teachingCourses.forEach(item => {
            children.push(tabbedEntry([item.dates || '', item.course || '', item.teachingLoad || '']));
          });
        }
        if (studentInst.formalTeaching?.length > 0) {
          children.push(subsubsectionHeading('Formal Teaching of Residents, Clinical Fellows and Research Fellows'));
          studentInst.formalTeaching.forEach(item => {
            children.push(tabbedEntry([item.dates || '', item.course || '', item.teachingLoad || '']));
          });
        }
        if (studentInst.supervisory?.length > 0) {
          children.push(subsubsectionHeading('Supervisory and Training Responsibilities'));
          studentInst.supervisory.forEach(item => {
            children.push(tabbedEntry([item.dates || '', item.role || '', item.timeCommitment || '']));
          });
        }
        if (studentInst.mentorship?.length > 0) {
          children.push(subsubsectionHeading('Mentorship of Trainees'));
          const mentorRows = [
            new TableRow({
              children: ['Years', 'Student', 'Mentor Role', 'Interaction', 'Type', 'Institution'].map(text =>
                new TableCell({ borders, shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })] })
              )
            })
          ];
          studentInst.mentorship.forEach(m => {
            mentorRows.push(new TableRow({
              children: [m.years, m.student, m.mentorRole, m.interaction, m.menteeType, m.institution].map(text =>
                new TableCell({ borders, children: [new Paragraph({ children: [new TextRun({ text: text || '', size: 18 })] })] })
              )
            }));
          });
          children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: mentorRows }));
        }
      }

      // Section III: Bibliography
      children.push(new Paragraph({ children: [new PageBreak()] }));
      children.push(sectionHeading('Section III: Bibliography'));
      children.push(subsectionHeading('A. PRIMARY PUBLISHED OR CREATIVE WORK'));

      let pubNumber = 1;
      const primaryWork = cv.bibliography?.primaryWork || {};
      const pubSections = [
        { key: 'originalPeerReviewed', title: 'I. Original Peer-Reviewed Work' },
        { key: 'reviewInvited', title: 'II. Review and Invited Articles' },
        { key: 'booksChapters', title: 'III. Books and Book Chapters' },
        { key: 'editorials', title: 'IV. Editorials' },
        { key: 'commentary', title: 'V. Commentary' },
        { key: 'caseReports', title: 'VI. Case Reports' }
      ];
      
      pubSections.forEach(({ key, title }) => {
        if (primaryWork[key]?.length > 0) {
          children.push(subsubsectionHeading(title));
          primaryWork[key].forEach(pub => {
            children.push(normalParagraph(`${pubNumber}. ${pub.text || pub}`, true));
            pubNumber++;
          });
        }
      });

      // Other Work
      const otherWork = cv.bibliography?.otherWork || {};
      if (otherWork.abstracts?.length > 0 || otherWork.popularWorks?.length > 0 || otherWork.additionalProducts?.length > 0) {
        children.push(subsectionHeading('B. OTHER WORK'));
        const otherSections = [
          { key: 'abstracts', title: 'I. Abstracts' },
          { key: 'popularWorks', title: 'II. Popular Works' },
          { key: 'additionalProducts', title: 'III. Additional Products of Major Research' }
        ];
        otherSections.forEach(({ key, title }) => {
          if (otherWork[key]?.length > 0) {
            children.push(subsubsectionHeading(title));
            otherWork[key].forEach(pub => {
              children.push(normalParagraph(`${pubNumber}. ${pub.text || pub}`, true));
              pubNumber++;
            });
          }
        });
      }

      // Work in Progress
      if (cv.bibliography?.workInProgress?.length > 0) {
        children.push(subsectionHeading('C. WORK IN PROGRESS'));
        cv.bibliography.workInProgress.forEach(pub => {
          children.push(normalParagraph(`${pubNumber}. ${pub.text || pub}`, true));
          pubNumber++;
        });
      }

      // Publications Link
      if (cv.publicationsLink) {
        children.push(new Paragraph({ spacing: { before: 300 } }));
        children.push(normalParagraph(`Selected publications can be found at: ${cv.publicationsLink}`));
      }

      // Create document
      const doc = new Document({
        styles: {
          default: { document: { run: { font: "Arial", size: 22 } } },
          paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 28, bold: true, font: "Arial" }, paragraph: { spacing: { before: 400, after: 200 } } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 24, bold: true, font: "Arial" }, paragraph: { spacing: { before: 300, after: 150 } } },
          ]
        },
        sections: [{
          properties: {
            page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
          },
          children
        }]
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `biobib_${cv.personalInfo.lastName || 'cv'}_${new Date().toISOString().split('T')[0]}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'DOCX exported successfully!' });
    } catch (err) {
      console.error('DOCX export error:', err);
      setMessage({ type: 'error', text: 'Failed to export DOCX. Try exporting JSON instead.' });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  const pubCount = (arr) => arr?.length || 0;
  const totalPubs = 
    pubCount(cv.bibliography.primaryWork.originalPeerReviewed) +
    pubCount(cv.bibliography.primaryWork.reviewInvited) +
    pubCount(cv.bibliography.primaryWork.booksChapters) +
    pubCount(cv.bibliography.primaryWork.refereedProceedings) +
    pubCount(cv.bibliography.otherWork.otherProceedings) +
    pubCount(cv.bibliography.otherWork.abstracts) +
    pubCount(cv.bibliography.otherWork.popularWorks) +
    pubCount(cv.bibliography.otherWork.additionalProducts);

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Input label="First Name" value={cv.personalInfo.firstName} onChange={(v) => updateCV('personalInfo.firstName', v)} placeholder="First" />
        <Input label="Middle Name" value={cv.personalInfo.middleName} onChange={(v) => updateCV('personalInfo.middleName', v)} placeholder="Middle" />
        <Input label="Last Name" value={cv.personalInfo.lastName} onChange={(v) => updateCV('personalInfo.lastName', v)} placeholder="Last" />
      </div>
      <Input label="Department" value={cv.personalInfo.department} onChange={(v) => updateCV('personalInfo.department', v)} placeholder="e.g., Department of Medicine" />
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title(s)</label>
        <SimpleListEditor items={cv.personalInfo.titles} setItems={(v) => updateCV('personalInfo.titles', v)} placeholder="e.g., Professor" />
      </div>
    </div>
  );

  const renderEmployment = () => (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
        Provide a full account from your first academic employment to present, including gaps.
      </p>
      <ListItemEditor
        items={cv.employmentHistory}
        setItems={(v) => updateCV('employmentHistory', v)}
        fields={[
          { id: 'fromDate', label: 'From', placeholder: 'Start' },
          { id: 'toDate', label: 'To', placeholder: 'End/Present' },
          { id: 'institution', label: 'Institution', placeholder: 'Name', fullWidth: true },
          { id: 'location', label: 'Location', placeholder: 'City, State' },
          { id: 'position', label: 'Position', placeholder: 'Title' },
        ]}
        itemName="Position"
      />
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <ListItemEditor
        items={cv.education}
        setItems={(v) => updateCV('education', v)}
        fields={[
          { id: 'institution', label: 'Institution', placeholder: 'School name' },
          { id: 'dates', label: 'Dates', placeholder: '2010-2014' },
          { id: 'location', label: 'Location', placeholder: 'City, State' },
          { id: 'major', label: 'Major/Field', placeholder: 'Field of study' },
          { id: 'degree', label: 'Degree', placeholder: 'MD, PhD' },
          { id: 'dateReceived', label: 'Received', placeholder: '2014' },
        ]}
        itemName="Education"
      />
      <div className="pt-3 border-t border-slate-200">
        <label className="block text-xs font-medium text-slate-600 mb-2">Certifications & Licenses</label>
        <ListItemEditor
          items={cv.subspecializations}
          setItems={(v) => updateCV('subspecializations', v)}
          fields={[
            { id: 'text', label: 'Certification/License', placeholder: 'e.g., Board Certified Sleep Medicine', fullWidth: true },
            { id: 'date', label: 'Date Received', placeholder: 'e.g., 2018' },
          ]}
          itemName="Certification"
        />
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="space-y-3">
      {professionalSubsections.map(sub => (
        <CollapsibleSection 
          key={sub.id} 
          title={sub.title} 
          iconName="Globe"
          badge={sub.type === 'simple' ? (cv.professionalData[sub.id]?.length || null) : null}
        >
          {sub.description && <p className="text-xs text-slate-500 mb-3">{sub.description}</p>}
          
          {/* Simple sections with date field */}
          {sub.type === 'simple' && (
            <ListItemEditor
              items={cv.professionalData[sub.id] || []}
              setItems={(v) => updateCV(`professionalData.${sub.id}`, v)}
              fields={[
                { id: 'text', label: 'Description', placeholder: `Add ${sub.title.toLowerCase()}...`, fullWidth: true },
                { id: 'date', label: 'Date(s)', placeholder: 'e.g., 2020-Present or 2019' },
              ]}
              itemName="Entry"
            />
          )}
          
          {/* Grants section with current/previous */}
          {sub.type === 'grants' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 text-sm mb-3">Current Grants</h4>
                <ListItemEditor
                  items={cv.professionalData.currentGrants || []}
                  setItems={(v) => updateCV('professionalData.currentGrants', v)}
                  fields={[
                    { id: 'title', label: 'Title', placeholder: 'Grant title', fullWidth: true },
                    { id: 'agency', label: 'Granting Agency', placeholder: 'NIH, NSF' },
                    { id: 'grantNumber', label: 'Grant Number', placeholder: 'e.g., R01 HL123456' },
                    { id: 'amount', label: 'Amount', placeholder: '$500,000' },
                    { id: 'period', label: 'Time Period', placeholder: '2023-2028' },
                    { id: 'role', label: 'Role', placeholder: 'PI, Co-I, etc.', fullWidth: true },
                  ]}
                  itemName="Grant"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-700 text-sm mb-3">Previous Grants</h4>
                <ListItemEditor
                  items={cv.professionalData.previousGrants || []}
                  setItems={(v) => updateCV('professionalData.previousGrants', v)}
                  fields={[
                    { id: 'title', label: 'Title', placeholder: 'Grant title', fullWidth: true },
                    { id: 'agency', label: 'Granting Agency', placeholder: 'NIH, NSF' },
                    { id: 'grantNumber', label: 'Grant Number', placeholder: 'e.g., R01 HL123456' },
                    { id: 'amount', label: 'Amount', placeholder: '$500,000' },
                    { id: 'period', label: 'Time Period', placeholder: '2018-2022' },
                    { id: 'role', label: 'Role', placeholder: 'PI, Co-I, etc.', fullWidth: true },
                  ]}
                  itemName="Grant"
                />
              </div>
            </div>
          )}
          
          {/* Nested sections (External Professional, Other Activities) */}
          {sub.type === 'nested' && sub.subsections && (
            <div className="space-y-3 ml-2">
              {sub.subsections.map(nested => (
                <div key={nested.id} className="border-l-2 border-teal-200 pl-4">
                  <h4 className="font-medium text-slate-700 text-sm mb-2">{nested.title}</h4>
                  <ListItemEditor
                    items={cv.professionalData[sub.id]?.[nested.id] || []}
                    setItems={(v) => updateCV(`professionalData.${sub.id}.${nested.id}`, v)}
                    fields={[
                      { id: 'text', label: 'Description', placeholder: `Add ${nested.title.toLowerCase()}...`, fullWidth: true },
                      { id: 'date', label: 'Date(s)', placeholder: 'e.g., 2020-Present or 2019' },
                    ]}
                    itemName="Entry"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Student Instructional Activities */}
          {sub.type === 'studentInstructional' && (
            <div className="space-y-4">
              {/* Teaching of Students in Courses */}
              <div className="border-l-2 border-teal-200 pl-4">
                <h4 className="font-medium text-slate-700 text-sm mb-2">Teaching of Students in Courses</h4>
                <ListItemEditor
                  items={cv.professionalData.studentInstructional?.teachingCourses || []}
                  setItems={(v) => updateCV('professionalData.studentInstructional.teachingCourses', v)}
                  fields={[
                    { id: 'course', label: 'Course', placeholder: 'Course name/number', fullWidth: true },
                    { id: 'dates', label: 'Dates', placeholder: 'e.g., Fall 2022, 2020-Present' },
                    { id: 'teachingLoad', label: 'Teaching Load', placeholder: 'e.g., 25%, 2 lectures/week' },
                  ]}
                  itemName="Course"
                />
              </div>
              
              {/* Formal Teaching */}
              <div className="border-l-2 border-teal-200 pl-4">
                <h4 className="font-medium text-slate-700 text-sm mb-2">Formal Teaching of Residents, Clinical Fellows and Research Fellows</h4>
                <ListItemEditor
                  items={cv.professionalData.studentInstructional?.formalTeaching || []}
                  setItems={(v) => updateCV('professionalData.studentInstructional.formalTeaching', v)}
                  fields={[
                    { id: 'course', label: 'Course/Program', placeholder: 'Course or program name', fullWidth: true },
                    { id: 'dates', label: 'Dates', placeholder: 'e.g., 2020-Present' },
                    { id: 'teachingLoad', label: 'Teaching Load', placeholder: 'e.g., Weekly conference, Monthly lecture' },
                  ]}
                  itemName="Teaching"
                />
              </div>
              
              {/* Supervisory */}
              <div className="border-l-2 border-teal-200 pl-4">
                <h4 className="font-medium text-slate-700 text-sm mb-2">Supervisory and Training Responsibilities</h4>
                <ListItemEditor
                  items={cv.professionalData.studentInstructional?.supervisory || []}
                  setItems={(v) => updateCV('professionalData.studentInstructional.supervisory', v)}
                  fields={[
                    { id: 'role', label: 'Role', placeholder: 'e.g., Fellowship Director, Clerkship Director', fullWidth: true },
                    { id: 'dates', label: 'Dates', placeholder: 'e.g., 2020-Present' },
                    { id: 'timeCommitment', label: 'Time Commitment', placeholder: 'e.g., 10%, 4 hours/week' },
                  ]}
                  itemName="Responsibility"
                />
              </div>
              
              {/* Mentorship */}
              <div className="border-l-2 border-teal-200 pl-4">
                <h4 className="font-medium text-slate-700 text-sm mb-2">Mentorship of Trainees</h4>
                <ListItemEditor
                  items={cv.professionalData.studentInstructional?.mentorship || []}
                  setItems={(v) => updateCV('professionalData.studentInstructional.mentorship', v)}
                  fields={[
                    { id: 'student', label: 'Student Name', placeholder: 'Trainee name' },
                    { id: 'mentorRole', label: 'Mentor Role', placeholder: 'Thesis Chair, Research Advisor, Lab Mentor, etc.' },
                    { id: 'interaction', label: 'Interaction', placeholder: 'Research or Clinical' },
                    { id: 'menteeType', label: 'Type of Mentee', placeholder: 'Postdoc, Clinical Fellow, Grad Student, etc.' },
                    { id: 'years', label: 'Year(s)', placeholder: 'e.g., 2020-2023' },
                    { id: 'institution', label: 'Institution', placeholder: 'e.g., UCSD' },
                  ]}
                  itemName="Mentee"
                />
              </div>
            </div>
          )}
        </CollapsibleSection>
      ))}
    </div>
  );

  const renderBibliography = () => (
    <div className="space-y-4">
      {/* Import button for bibliography */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-blue-800 text-sm">Import Publications from PubMed</h4>
          <p className="text-xs text-blue-600">Quickly add publications using MEDLINE export format</p>
        </div>
        <Button variant="pubmed" size="sm" onClick={() => setShowImport(true)}>
          <Icons.Database /> Import
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-1">A. Primary Published Work</h3>
        <p className="text-xs text-slate-500 mb-3">Peer-reviewed work. Mark "in press" or "accepted" items.</p>
        <div className="space-y-2">
          {bibliographySubsections.primaryWork.map(sub => (
            <CollapsibleSection 
              key={sub.id} 
              title={sub.title} 
              iconName="BookOpen"
              badge={cv.bibliography.primaryWork[sub.id]?.length || null}
            >
              <SimpleListEditor items={cv.bibliography.primaryWork[sub.id]} setItems={(v) => updateCV(`bibliography.primaryWork.${sub.id}`, v)} placeholder="Full citation..." />
            </CollapsibleSection>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-1">B. Other Work</h3>
        <p className="text-xs text-slate-500 mb-3">Other published works demonstrating scholarly activity.</p>
        <div className="space-y-2">
          {bibliographySubsections.otherWork.map(sub => (
            <CollapsibleSection 
              key={sub.id} 
              title={sub.title} 
              iconName="FileText"
              badge={cv.bibliography.otherWork[sub.id]?.length || null}
            >
              <SimpleListEditor items={cv.bibliography.otherWork[sub.id]} setItems={(v) => updateCV(`bibliography.otherWork.${sub.id}`, v)} placeholder="Full citation..." />
            </CollapsibleSection>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-1">C. Work in Progress</h3>
        <p className="text-xs text-slate-500 mb-3">Optional. Include items with material for review.</p>
        <SimpleListEditor items={cv.bibliography.workInProgress} setItems={(v) => updateCV('bibliography.workInProgress', v)} placeholder="Work in progress..." />
      </div>

      <Input label="Publications Link" value={cv.publicationsLink} onChange={(v) => updateCV('publicationsLink', v)} placeholder="Google Scholar, ORCID URL" />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'employment': return renderEmployment();
      case 'education': return renderEducation();
      case 'professional': return renderProfessional();
      case 'bibliography': return renderBibliography();
      default: return null;
    }
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between bg-teal-600">
          <h2 className="font-bold text-white">CV Preview</h2>
          <button onClick={() => setShowPreview(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg"><Icons.X /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-60px)] text-sm">
          <div className="text-center mb-6 pb-4 border-b-2">
            <h1 className="text-xl font-bold text-slate-900">
              {cv.personalInfo.firstName} {cv.personalInfo.middleName} {cv.personalInfo.lastName}
            </h1>
            {cv.personalInfo.department && <p className="text-slate-600">{cv.personalInfo.department}</p>}
            {cv.personalInfo.titles.length > 0 && (
              <p className="text-slate-500 text-xs">{cv.personalInfo.titles.map(t => t.text || t).join(' • ')}</p>
            )}
          </div>

          {cv.employmentHistory.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-teal-700 border-b border-teal-200 pb-1 mb-2">Employment</h2>
              {cv.employmentHistory.map((emp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between"><strong>{emp.position}</strong><span className="text-slate-500 text-xs">{emp.fromDate}–{emp.toDate}</span></div>
                  <div className="text-slate-600 text-xs">{emp.institution}, {emp.location}</div>
                </div>
              ))}
            </section>
          )}

          {cv.education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-teal-700 border-b border-teal-200 pb-1 mb-2">Education</h2>
              {cv.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between"><strong>{edu.degree}{edu.major ? ` in ${edu.major}` : ''}</strong><span className="text-slate-500 text-xs">{edu.dateReceived}</span></div>
                  <div className="text-slate-600 text-xs">{edu.institution}</div>
                </div>
              ))}
            </section>
          )}

          {(cv.professionalData.currentGrants?.length > 0 || cv.professionalData.previousGrants?.length > 0) && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-teal-700 border-b border-teal-200 pb-1 mb-2">Grants</h2>
              {cv.professionalData.currentGrants?.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-slate-600 mb-1">Current</h3>
                  {cv.professionalData.currentGrants.map((g, i) => (
                    <div key={i} className="mb-2">
                      <strong>{g.title}</strong>
                      <div className="text-slate-600 text-xs">{g.agency} • {g.grantNumber} • {g.amount} • {g.period} • {g.role}</div>
                    </div>
                  ))}
                </div>
              )}
              {cv.professionalData.previousGrants?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 mb-1">Previous</h3>
                  {cv.professionalData.previousGrants.map((g, i) => (
                    <div key={i} className="mb-2">
                      <strong>{g.title}</strong>
                      <div className="text-slate-600 text-xs">{g.agency} • {g.grantNumber} • {g.amount} • {g.period} • {g.role}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {cv.bibliography.primaryWork.originalPeerReviewed.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-teal-700 border-b border-teal-200 pb-1 mb-2">Selected Publications</h2>
              <ol className="list-decimal list-inside space-y-1">
                {cv.bibliography.primaryWork.originalPeerReviewed.slice(0, 10).map((p, i) => (
                  <li key={i} className="text-xs text-slate-700">{p.text || p}</li>
                ))}
              </ol>
              {cv.bibliography.primaryWork.originalPeerReviewed.length > 10 && (
                <p className="text-xs text-slate-500 mt-1">...and {cv.bibliography.primaryWork.originalPeerReviewed.length - 10} more</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const Icon = Icons[sections.find(s => s.id === activeSection)?.icon] || Icons.FileText;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 p-4">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Icons.FileText />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">Academic CV Builder</h1>
              <p className="text-xs text-slate-500">UCSD Bio-Bib Format</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            <Button variant="secondary" size="sm" onClick={() => setShowReadme(true)}>
              <Icons.QuestionCircle /> Help
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowImport(true)}>
              <Icons.Upload /> Import
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Icons.File /> Load JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowPreview(true)}>
              <Icons.Eye /> Preview
            </Button>
            <Button variant="secondary" size="sm" onClick={exportJSON}>
              <Icons.Download /> JSON
            </Button>
            <Button size="sm" onClick={exportDOCX}>
              <Icons.FileText /> Export DOCX
            </Button>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
          {message.type === 'error' ? <Icons.AlertCircle /> : <Icons.Check />} {message.text}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <nav className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <div className="space-y-1">
              {sections.map(section => {
                const SectionIcon = Icons[section.icon];
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <SectionIcon />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 text-xs">
              <h4 className="font-semibold text-slate-400 uppercase mb-2">Stats</h4>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Publications</span>
                  <span className="font-semibold">{totalPubs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grants</span>
                  <span className="font-semibold">{(cv.professionalData.currentGrants?.length || 0) + (cv.professionalData.previousGrants?.length || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Positions</span>
                  <span className="font-semibold">{cv.employmentHistory.length}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Editor */}
        <div className="col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Icon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{sections.find(s => s.id === activeSection)?.title}</h2>
                <p className="text-xs text-slate-500">Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}</p>
              </div>
            </div>
            
            {renderContent()}
            
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx > 0) setActiveSection(sections[idx - 1].id);
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
              >
                ← Previous
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPreview && <PreviewModal />}
      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />
      <ReadmeModal isOpen={showReadme} onClose={() => setShowReadme(false)} />
    </div>
  );
}
