import React from 'react';
import TreeView from './TreeView';

export default function HierarchyCard({ hierarchy }) {
  const { root, tree, depth, has_cycle } = hierarchy;
  const isCycle = Boolean(has_cycle);

  return (
    <div className={`hierarchy-card${isCycle ? ' hierarchy-card--cycle' : ''}`}>
     
      <div className="hierarchy-card__header">
        <div className="hierarchy-card__root">
          <div className={`hierarchy-card__root-icon ${isCycle ? 'root-icon--cycle' : 'root-icon--tree'}`}>
            {isCycle ? '↺' : '⌾'}
          </div>
          <span>{root}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span className={`badge ${isCycle ? 'badge--cycle' : 'badge--tree'}`}>
            {isCycle ? 'Cycle' : 'Tree'}
          </span>
          {!isCycle && depth !== undefined && (
            <span className="badge badge--depth">depth {depth}</span>
          )}
        </div>
      </div>

      
      <div className="hierarchy-card__body">
        {isCycle ? (
          <div className="cycle-notice">
            <span>↺</span>
            <span>Cyclic group — no tree structure available</span>
          </div>
        ) : (
          <TreeView root={root} tree={tree} />
        )}
      </div>
    </div>
  );
}
