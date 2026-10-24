import React, { useState, useRef } from 'react';

const ROLE_OPTIONS = [
  'Python Developer',
  'Web Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Software Engineer',
  'AI/ML Engineer',
];

export default function ResumeAnalyzer({
  onAnalyze,
  isLoading,
  error,
  statusMessage,
  targetSectionRef,
}) {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setValidationError('');

    if (!file) return;

    const validExts = ['.pdf', '.docx', '.txt'];
    const nameLower = file.name.toLowerCase();
    const isValid = validExts.some((ext) => nameLower.endsWith(ext));

    if (!isValid) {
      setValidationError('Please select a valid PDF, DOCX, or TXT resume.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('The maximum file size is 10 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedFile) {
      setValidationError('Please upload your resume file (.pdf, .docx, or .txt).');
      return;
    }

    if (!targetRole) {
      setValidationError('Please select your target job role.');
      return;
    }

    onAnalyze({
      file: selectedFile,
      targetRole,
      jobDescription,
    });
  };

  const uploadTitle = selectedFile
    ? selectedFile.name
    : 'Click to upload your resume';

  const uploadDescription = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to analyze`
    : 'PDF, DOCX, or TXT format · Maximum size 10 MB';

  return (
    <section className="content-section" id="analyzer" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">START YOUR JOURNEY</span>
          <h2>AI Resume Analyzer</h2>
          <p>Upload your resume and choose your target career.</p>
        </div>

        <span className="feature-badge">✦ AI Powered</span>
      </div>

      <form id="resumeForm" onSubmit={handleSubmit}>
        <label htmlFor="jobRole">Target Job Role</label>
        <select
          id="jobRole"
          required
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        >
          <option value="">Select your career goal</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <label htmlFor="jobDescription">
          Job Description <span className="optional">(Optional)</span>
        </label>
        <textarea
          id="jobDescription"
          rows="4"
          placeholder="Paste the target job description here for a more targeted analysis..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>

        <label>Upload Your Resume</label>
        <label
          htmlFor="resumeFile"
          className={`upload-box ${selectedFile ? 'has-file' : ''}`}
        >
          <div className="upload-icon">↑</div>
          <h3 id="uploadTitle">{uploadTitle}</h3>
          <p id="uploadDescription">{uploadDescription}</p>

          <input
            type="file"
            id="resumeFile"
            ref={fileInputRef}
            accept=".pdf,.docx,.txt,application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <button
          type="submit"
          className="primary-button submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Analyzing Resume with AI...
            </>
          ) : (
            '✦ Analyze Resume with AI'
          )}
        </button>
      </form>

      {validationError && (
        <p id="statusMessage" className="error" role="alert">
          ⚠ {validationError}
        </p>
      )}

      {error && (
        <p id="statusMessage" className="error" role="alert">
          ⚠ {error}
        </p>
      )}

      {!validationError && !error && statusMessage && (
        <p
          id="statusMessage"
          className={isLoading ? 'loading' : 'success'}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </section>
  );
}
