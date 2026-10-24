import React from 'react';

const navItems = [
  { id: 'home', label: '⌂ Dashboard' },
  { id: 'analyzer', label: '▤ Resume Analyzer' },
  { id: 'skills', label: '◈ Skill Gap Analysis' },
  { id: 'mentor', label: '✦ AI Career Mentor' },
  { id: 'roadmap', label: '☷ Learning Roadmap' },
  { id: 'projects', label: '◇ Project Ideas' },
  { id: 'improve', label: '✎ Resume Improvement' },
];

export default function Sidebar({ isOpen, onClose, activeSection, onNavigate }) {
  const handleClick = (e, id) => {
    e.preventDefault();
    onNavigate(id);
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <a href="#home" className="brand" onClick={(e) => handleClick(e, 'home')}>
        CareerCompass<span> AI</span>
      </a>

      <p className="menu-label">WORKSPACE</p>

      <nav>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={(e) => handleClick(e, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-avatar">S</div>
        <div>
          <strong>Student Workspace</strong>
          <p>Career Development</p>
        </div>
      </div>
    </aside>
  );
}
