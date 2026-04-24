import React from 'react';
import HierarchyCard from './HierarchyCard';
import SummaryCard from './SummaryCard';

export default function ResponsePanel({ data }) {
  if (!data) return null;

  const {
    user_id, email_id, college_roll_number,
    hierarchies, invalid_entries, duplicate_edges, summary,
  } = data;

  const identity = { user_id, email_id, college_roll_number };

  return (
    <div className="response-section">

     
      <SummaryCard summary={summary} identity={identity} />

     
      <div className="section-title" style={{ marginTop: '1.5rem' }}>
        Hierarchies ({hierarchies.length})
      </div>
      {hierarchies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🌿</div>
          <div className="empty-state__title">No hierarchies found</div>
          <div className="empty-state__sub">All entries may be invalid or empty.</div>
        </div>
      ) : (
        <div className="hierarchies-grid">
          {hierarchies.map((h) => (
            <HierarchyCard key={h.root} hierarchy={h} />
          ))}
        </div>
      )}

     
      <div className="chips-section card">
        <div className="section-title">Invalid Entries</div>
        {invalid_entries.length === 0 ? (
          <p className="empty-chips">None — all entries were valid ✓</p>
        ) : (
          <div className="chips-container">
            {invalid_entries.map((e, i) => (
              <span key={i} className="chip chip--invalid">⚠ {e === '' ? '(empty)' : e}</span>
            ))}
          </div>
        )}
      </div>

      
      <div className="chips-section card" style={{ marginTop: '1rem' }}>
        <div className="section-title">Duplicate Edges</div>
        {duplicate_edges.length === 0 ? (
          <p className="empty-chips">None — no duplicate edges detected ✓</p>
        ) : (
          <div className="chips-container">
            {duplicate_edges.map((e, i) => (
              <span key={i} className="chip chip--duplicate">⟳ {e}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
