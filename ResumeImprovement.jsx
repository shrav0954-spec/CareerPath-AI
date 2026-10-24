import React from 'react';

export default function ResumeImprovement({ analysisResult, targetSectionRef }) {
  const isAnalyzed = Boolean(analysisResult);
  const suggestions = analysisResult?.resume_improvement_suggestions || [];

  return (
    <section className="content-section" id="improve" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">MAKE A STRONGER IMPRESSION</span>
          <h2>Resume Improvement</h2>
          <p>
            Get suggestions to make your resume clearer and more relevant
            to your target role.
          </p>
        </div>

        {isAnalyzed && (
          <span className="feature-badge">
            {suggestions.length} ATS Action Items
          </span>
        )}
      </div>

      {!isAnalyzed ? (
        <div id="improvementPlaceholder" className="placeholder">
          <div className="placeholder-icon">✎</div>
          <h3>Your improvement checklist</h3>
          <p>
            Analyze your resume to receive personalized suggestions.
          </p>
        </div>
      ) : (
        <ul id="improvementResults" className="improvement-list">
          {suggestions.map((item, idx) => (
            <li key={idx} style={{ lineHeight: '1.7' }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
