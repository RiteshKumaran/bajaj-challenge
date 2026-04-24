import React from 'react';

export default function SummaryCard({ summary, identity }) {
  if (!summary) return null;

  return (
    <div className="summary-card card">
      <div className="section-title">Summary</div>

     
      {identity && (
        <div className="identity-bar">
          <span className="identity-tag">
            <span className="identity-tag__key">user</span>
            {identity.user_id}
          </span>
          <span className="identity-tag">
            <span className="identity-tag__key">email</span>
            {identity.email_id}
          </span>
          <span className="identity-tag">
            <span className="identity-tag__key">roll</span>
            {identity.college_roll_number}
          </span>
        </div>
      )}

      <div className="summary-grid">
        <div className="summary-pill summary-pill--trees">
          <span className="summary-pill__label">Total Trees</span>
          <span className="summary-pill__value">{summary.total_trees}</span>
        </div>
        <div className="summary-pill summary-pill--cycles">
          <span className="summary-pill__label">Total Cycles</span>
          <span className="summary-pill__value">{summary.total_cycles}</span>
        </div>
        <div className="summary-pill summary-pill--root">
          <span className="summary-pill__label">Largest Tree Root</span>
          <span className="summary-pill__value">{summary.largest_tree_root ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
