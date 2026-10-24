import React from 'react';

export default function ProjectIdeas({ analysisResult, targetSectionRef }) {
  const isAnalyzed = Boolean(analysisResult);
  const projects = analysisResult?.recommended_projects || [];
  const certs = analysisResult?.recommended_certifications || [];

  return (
    <section className="content-section" id="projects" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">LEARN BY BUILDING</span>
          <h2>Recommended Projects</h2>
          <p>Develop practical skills through hands-on projects.</p>
        </div>

        {isAnalyzed && (
          <span className="feature-badge">
            {projects.length} Portfolio Projects
          </span>
        )}
      </div>

      {!isAnalyzed ? (
        <div id="projectsPlaceholder" className="placeholder">
          <div className="placeholder-icon">◇</div>
          <h3>Discover your next project</h3>
          <p>
            Your recommendations will be based on your skill gaps.
          </p>
        </div>
      ) : (
        <>
          <div id="projectResults" className="project-grid">
            {projects.map((proj, idx) => (
              <article key={idx} className="project-card">
                <h3>{proj.title}</h3>

                {proj.tech_stack && (
                  <span className="project-tech">{proj.tech_stack}</span>
                )}

                <p>{proj.description}</p>

                {proj.learning_outcomes && proj.learning_outcomes.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                      DEMONSTRATES:
                    </p>
                    <div className="tag-list">
                      {proj.learning_outcomes.map((outcome, oIdx) => (
                        <span key={oIdx} className="tag">{outcome}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {certs.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>
                ✦ Industry Recognized Certifications
              </h4>
              <div className="project-grid">
                {certs.map((cert, cIdx) => (
                  <article key={cIdx} className="project-card" style={{ padding: '14px 18px' }}>
                    <h3 style={{ fontSize: '14px' }}>{cert.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px' }}>
                      Provider: <strong>{cert.provider}</strong> · Level: {cert.level}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
