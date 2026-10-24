import React from 'react';

export default function LearningRoadmap({ analysisResult, targetSectionRef }) {
  const isAnalyzed = Boolean(analysisResult);
  const roadmap = analysisResult?.learning_roadmap || [];

  return (
    <section className="content-section" id="roadmap" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR LEARNING JOURNEY</span>
          <h2>Personalized Learning Roadmap</h2>
          <p>A structured path to help you develop relevant skills.</p>
        </div>

        {isAnalyzed && (
          <span className="feature-badge">
            {roadmap.length} Milestones
          </span>
        )}
      </div>

      {!isAnalyzed ? (
        <div id="roadmapPlaceholder" className="placeholder">
          <div className="placeholder-icon">☷</div>
          <h3>Your roadmap starts here</h3>
          <p>
            Analyze your resume to generate learning recommendations.
          </p>
        </div>
      ) : (
        <div id="roadmapResults" className="roadmap-list">
          {roadmap.map((phase, idx) => (
            <article key={idx} className="roadmap-item">
              <div className="roadmap-header">
                <h3>{phase.phase_title}</h3>
                <span className="phase-duration">{phase.duration}</span>
              </div>

              {phase.focus_areas && phase.focus_areas.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                    FOCUS AREAS:
                  </p>
                  <div className="tag-list">
                    {phase.focus_areas.map((area, aIdx) => (
                      <span key={aIdx} className="tag">{area}</span>
                    ))}
                  </div>
                </div>
              )}

              {phase.actionable_tasks && phase.actionable_tasks.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                    ACTIONABLE TASKS:
                  </p>
                  <ul className="roadmap-tasks">
                    {phase.actionable_tasks.map((task, tIdx) => (
                      <li key={tIdx}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}

              {phase.recommended_resources && phase.recommended_resources.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--muted)' }}>
                  <strong>Resources: </strong>
                  {phase.recommended_resources.join(' · ')}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
