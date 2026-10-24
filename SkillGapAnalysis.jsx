import React from 'react';

export default function SkillGapAnalysis({ analysisResult, targetSectionRef }) {
  const isAnalyzed = Boolean(analysisResult);
  const skills = analysisResult?.skills_analysis || {};
  const matchedSkills = skills.matched_skills || [];
  const missingSkills = skills.missing_skills || [];
  const bonusSkills = skills.bonus_skills || [];

  return (
    <section className="content-section" id="skills" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">UNDERSTAND YOUR PROFILE</span>
          <h2>Skill Gap Analysis</h2>
          <p>Understand the skills your target role requires.</p>
        </div>

        {isAnalyzed && (
          <span className="feature-badge">
            Score: {analysisResult.overall_match_score}%
          </span>
        )}
      </div>

      {!isAnalyzed ? (
        <div id="analysisPlaceholder" className="placeholder">
          <div className="placeholder-icon">◈</div>
          <h3>Your skill analysis will appear here</h3>
          <p>
            Upload your resume to generate a personalized skill-gap report.
          </p>
        </div>
      ) : (
        <div id="analysisResults">
          <div className="result-columns">
            <article className="result-panel panel-matched">
              <h3>✓ Skills Identified ({matchedSkills.length})</h3>
              <ul id="foundSkills">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill, idx) => (
                    <li key={idx}><strong>{skill}</strong></li>
                  ))
                ) : (
                  <li>No exact role-matching skills identified yet.</li>
                )}
              </ul>

              {bonusSkills.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px' }}>
                    ✦ Transferable &amp; Bonus Skills:
                  </p>
                  <div className="tag-list">
                    {bonusSkills.map((bSkill, idx) => (
                      <span key={idx} className="tag">{bSkill}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <article className="result-panel panel-missing">
              <h3>↗ Potential Skill Gaps ({missingSkills.length})</h3>
              <ul id="missingSkills">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, idx) => (
                    <li key={idx}><strong>{skill}</strong></li>
                  ))
                ) : (
                  <li>No critical skill gaps identified! Great profile match.</li>
                )}
              </ul>
            </article>
          </div>

          <div className="ai-summary">
            <div className="ai-summary-header">
              <span className="eyebrow">AI CAREER INSIGHT</span>
              {analysisResult.candidate_name && (
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Candidate: <strong>{analysisResult.candidate_name}</strong>
                </span>
              )}
            </div>

            <p id="profileSummary">{analysisResult.executive_summary}</p>

            {analysisResult.is_mock_fallback && (
              <div className="mock-notice">
                ℹ Running on preview test data. Provide a valid <code>GEMINI_API_KEY</code> in <code>backend/.env</code> or Render Environment Variables for live Gemini generative responses.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
