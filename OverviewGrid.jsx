import React from 'react';

export default function OverviewGrid({ analysisResult }) {
  const isAnalyzed = Boolean(analysisResult);

  const resumeStatusText = isAnalyzed
    ? `${analysisResult.overall_match_score}% Match`
    : 'Not analyzed';

  const resumeStatusHint = isAnalyzed
    ? `Target: ${analysisResult.target_role}`
    : 'Upload a resume to begin';

  const skillsCount = isAnalyzed
    ? `${analysisResult.skills_analysis?.matched_skills?.length || 0} Found`
    : '--';

  const skillsHint = isAnalyzed
    ? `${analysisResult.skills_analysis?.missing_skills?.length || 0} Gaps to bridge`
    : 'Based on your resume';

  const roadmapCount = isAnalyzed
    ? `${analysisResult.learning_roadmap?.length || 0} Phases`
    : 'Not created';

  const roadmapHint = isAnalyzed
    ? 'Personalized career path'
    : 'Personalized learning plan';

  return (
    <section className="overview-grid">
      <article className="overview-card">
        <div className="card-icon purple">▤</div>
        <p>Resume Status</p>
        <h3 id="resumeStatus">{resumeStatusText}</h3>
        <span>{resumeStatusHint}</span>
      </article>

      <article className="overview-card">
        <div className="card-icon orange">◈</div>
        <p>Skills Identified</p>
        <h3 id="skillsCount">{skillsCount}</h3>
        <span>{skillsHint}</span>
      </article>

      <article className="overview-card">
        <div className="card-icon green">☷</div>
        <p>Learning Roadmap</p>
        <h3 id="roadmapStatus">{roadmapCount}</h3>
        <span>{roadmapHint}</span>
      </article>
    </section>
  );
}
