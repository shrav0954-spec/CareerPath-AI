import React from 'react';

export default function Topbar({ onToggleMenu, backendStatus, onRetryHealth }) {
  let statusClass = 'checking';
  let statusText = 'Checking backend...';
  let tooltip = 'Testing connection to Python FastAPI backend';

  if (!backendStatus.checking) {
    if (backendStatus.online) {
      statusClass = 'online';
      statusText = backendStatus.data?.project
        ? `${backendStatus.data.project} (Online)`
        : 'Backend Connected';
      tooltip = `Backend is healthy (${backendStatus.data?.gemini_model || 'FastAPI'})`;
    } else {
      statusClass = 'offline';
      statusText = 'Backend Offline';
      tooltip = backendStatus.message || 'Unable to connect to backend. Click to retry.';
    }
  }

  return (
    <header className="topbar">
      <button
        className="menu-toggle"
        id="menuToggle"
        aria-label="Toggle navigation"
        onClick={onToggleMenu}
      >
        ☰
      </button>

      <div>
        <p className="breadcrumb">Workspace / Dashboard</p>
        <h2>Career Dashboard</h2>
      </div>

      <div className="topbar-right">
        <div
          className="status-badge"
          title={tooltip}
          style={{ cursor: backendStatus.online ? 'default' : 'pointer' }}
          onClick={!backendStatus.online ? onRetryHealth : undefined}
        >
          <span className={`status-dot ${statusClass}`}></span>
          <span>{statusText}</span>
        </div>
      </div>
    </header>
  );
}
