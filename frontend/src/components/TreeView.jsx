import React from 'react';


function TreeNode({ label, children, isRoot = false }) {
  const childKeys = Object.keys(children || {});
  return (
    <div className="tree-node">
      <div className="tree-node__row">
        {!isRoot && <span className="tree-connector">└─</span>}
        <span className="tree-node__dot" />
        <span className="tree-node__label">{label}</span>
      </div>
      {childKeys.length > 0 && (
        <div className="tree-node__children">
          {childKeys.map((child) => (
            <TreeNode key={child} label={child} children={children[child]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ root, tree }) {
  
  const rootChildren = tree[root] || {};

  return (
    <div className="tree-view">
      <TreeNode label={root} children={rootChildren} isRoot />
    </div>
  );
}
