import React from 'react';

export default function WelcomeSection({ onStartAnalyze }) {
  return (
    <section className="welcome-section">
      <div>
        <span className="eyebrow">YOUR PERSONAL CAREER MENTOR</span>

        <h1>Build your future with <span>AI.</span></h1>

        <p>
          Discover your skill gaps, improve your resume,
          and create a personalized roadmap to your dream career.
        </p>

        <a
          href="#analyzer"
          className="primary-button"
          onClick={(e) => {
            e.preventDefault();
            onStartAnalyze();
          }}
        >
          Analyze My Resume →
        </a>
      </div>

      <div className="welcome-illustration">
        <div className="illustration-icon">✦</div>
        <div className="illustration-title">Your career, reimagined.</div>
        <div className="illustration-subtitle">
          Analyze · Learn · Grow
        </div>
      </div>
    </section>
  );
}
