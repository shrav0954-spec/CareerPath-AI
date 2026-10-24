import React, { useState } from 'react';

const QUICK_QUESTIONS = [
  'How do I prepare for technical interviews?',
  'What open-source projects should I contribute to?',
  'How do I showcase backend projects effectively on GitHub?',
];

export default function CareerMentor({ analysisResult, targetSectionRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [mentorAnswer, setMentorAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleAsk = () => {
    const q = question.trim();
    if (!q) {
      setMentorAnswer('Please enter your career question above.');
      return;
    }

    setIsAnswering(true);

    // Provide contextual mentor advice
    setTimeout(() => {
      const role = analysisResult?.target_role || 'Software Developer';
      const gaps = analysisResult?.skills_analysis?.missing_skills || [];

      let guidance = `✦ Career Mentor Guidance for "${role}":\n\n`;
      guidance += `Regarding your question: "${q}"\n\n`;

      if (gaps.length > 0) {
        guidance += `1. Priority Focus: Based on your recent resume analysis, your key areas for growth are ${gaps.slice(0, 3).join(', ')}. Mastering these will significantly boost your interview callbacks.\n\n`;
      } else {
        guidance += `1. Industry Standard: Recruiters looking for ${role} roles prioritize candidates with clean architecture, verifiable GitHub commits, and clear documentation.\n\n`;
      }

      guidance += `2. Action Plan:\n`;
      guidance += `   • Build and deploy 2 production-grade applications that solve real-world workflows.\n`;
      guidance += `   • Implement automated tests (unit + integration) and a CI/CD pipeline.\n`;
      guidance += `   • Write a concise README with architecture diagrams and API specs.\n\n`;
      guidance += `3. Pro Tip: Don't just list skills on your resume—quantify results (e.g., "Reduced response latency by 35% using caching").`;

      setMentorAnswer(guidance);
      setIsAnswering(false);
    }, 400);
  };

  return (
    <section className="content-section" id="mentor" ref={targetSectionRef}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">PERSONALIZED GUIDANCE</span>
          <h2>AI Career Mentor</h2>
          <p>Explore your career options and next steps.</p>
        </div>

        <span className="feature-badge">✦ Generative AI</span>
      </div>

      <div className="mentor-card">
        <div className="mentor-avatar">✦</div>

        <h3>Your personal AI career guide</h3>

        <p>
          Get personalized advice about career paths, technical skills,
          projects, and job readiness.
        </p>

        <button
          className="secondary-button"
          id="mentorButton"
          type="button"
          onClick={handleToggle}
        >
          {isOpen ? 'Close Career Guidance ↑' : 'Explore Career Guidance →'}
        </button>

        {isOpen && (
          <div id="mentorPanel">
            <label htmlFor="careerQuestion">What would you like guidance on?</label>

            <textarea
              id="careerQuestion"
              rows="3"
              placeholder="Example: How do I prepare for a Python developer role?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '6px 0 14px' }}>
              {QUICK_QUESTIONS.map((qText, i) => (
                <button
                  key={i}
                  type="button"
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: '1px solid #e2ddfe',
                    background: '#f9f8ff',
                    color: 'var(--primary)',
                  }}
                  onClick={() => setQuestion(qText)}
                >
                  {qText}
                </button>
              ))}
            </div>

            <button
              id="askMentor"
              className="primary-button"
              type="button"
              disabled={isAnswering}
              onClick={handleAsk}
            >
              {isAnswering ? 'Generating Mentor Advice...' : 'Ask Career Mentor'}
            </button>

            {mentorAnswer && (
              <div
                id="mentorResponse"
                className="mentor-response"
                aria-live="polite"
              >
                {mentorAnswer}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
