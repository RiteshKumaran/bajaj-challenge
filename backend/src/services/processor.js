'use strict';


const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

class UnionFind {
  constructor() {
    this.parent = {};
    this.rank = {};
  }

  find(x) {
    if (this.parent[x] === undefined) {
      this.parent[x] = x;
      this.rank[x] = 0;
    }
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;
    if ((this.rank[px] || 0) < (this.rank[py] || 0)) {
      this.parent[px] = py;
    } else if ((this.rank[px] || 0) > (this.rank[py] || 0)) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px] = (this.rank[px] || 0) + 1;
    }
  }
}

function validateAndDeduplicate(rawData) {
  const invalid_entries = [];
  const duplicate_edges_set = new Set();   
  const duplicate_edges = [];             
  const seenEdges = new Set();
  const validEdges = [];                 

  for (const raw of rawData) {
    const entry = typeof raw === 'string' ? raw.trim() : String(raw).trim();

    if (!EDGE_REGEX.test(entry) || entry[0] === entry[3]) {
      invalid_entries.push(typeof raw === 'string' ? raw : String(raw));
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!duplicate_edges_set.has(entry)) {
        duplicate_edges_set.add(entry);
        duplicate_edges.push(entry);
      }
    } else {
      seenEdges.add(entry);
      validEdges.push(entry);
    }
  }

  return { validEdges, invalid_entries, duplicate_edges };
}


function buildAdjacency(validEdges) {
  const children = {};   
  const parentOf = {};   
  const allNodes = new Set();

  for (const edge of validEdges) {
    const [parent, child] = [edge[0], edge[3]];
    allNodes.add(parent);
    allNodes.add(child);

    if (parentOf[child] !== undefined) {
      continue;
    }

    parentOf[child] = parent;
    if (!children[parent]) children[parent] = [];
    children[parent].push(child);
  }

  return { children, parentOf, allNodes };
}

function getComponents(allNodes, children) {
  const uf = new UnionFind();

  for (const node of allNodes) {
    uf.find(node); 
  }

  for (const [parent, kids] of Object.entries(children)) {
    for (const child of kids) {
      uf.union(parent, child);
    }
  }

  const componentMap = {}; 
  for (const node of allNodes) {
    const root = uf.find(node);
    if (!componentMap[root]) componentMap[root] = new Set();
    componentMap[root].add(node);
  }

  return Object.values(componentMap);
}


function hasCycleInComponent(nodes, children) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  for (const n of nodes) color[n] = WHITE;

  function dfs(node) {
    color[node] = GRAY;
    for (const child of (children[node] || [])) {
      if (color[child] === GRAY) return true;   
      if (color[child] === WHITE && dfs(child)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (const node of nodes) {
    if (color[node] === WHITE && dfs(node)) return true;
  }
  return false;
}

function findRoot(nodes, parentOf, hasCycle) {
  const roots = [...nodes].filter((n) => parentOf[n] === undefined);

  if (roots.length > 0) {
    return roots.sort()[0];
  }

  return [...nodes].sort()[0];
}

function calcDepth(node, children) {
  const kids = children[node] || [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map((c) => calcDepth(c, children)));
}

function buildTree(node, children) {
  const obj = {};
  for (const child of (children[node] || [])) {
    obj[child] = buildTree(child, children);
  }
  return obj;
}

function processData(rawData) {
  if (!Array.isArray(rawData)) {
    throw new TypeError('"data" must be an array');
  }

  const { validEdges, invalid_entries, duplicate_edges } =
    validateAndDeduplicate(rawData);

  const { children, parentOf, allNodes } = buildAdjacency(validEdges);

  const hierarchies = [];

  if (allNodes.size === 0) {
    return {
      hierarchies: [],
      invalid_entries,
      duplicate_edges,
      summary: {
        total_trees: 0,
        total_cycles: 0,
        largest_tree_root: null,
      },
    };
  }

  
  const components = getComponents(allNodes, children);

  
  for (const componentSet of components) {
    const cycleDetected = hasCycleInComponent(componentSet, children);
    const root = findRoot(componentSet, parentOf, cycleDetected);

    if (cycleDetected) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
    } else {
      const depth = calcDepth(root, children);
      const tree = { [root]: buildTree(root, children) };
      hierarchies.push({
        root,
        tree,
        depth,
      });
    }
  }

 
  hierarchies.sort((a, b) => {
    if (a.has_cycle && !b.has_cycle) return 1;
    if (!a.has_cycle && b.has_cycle) return -1;
    return a.root.localeCompare(b.root);
  });

  const trees = hierarchies.filter((h) => !h.has_cycle);
  const cycles = hierarchies.filter((h) => h.has_cycle);

  let largest_tree_root = null;
  if (trees.length > 0) {
    const best = trees.reduce((acc, h) => {
      if (h.depth > acc.depth) return h;
      if (h.depth === acc.depth && h.root < acc.root) return h;
      return acc;
    });
    largest_tree_root = best.root;
  }

  const summary = {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root,
  };

  return { hierarchies, invalid_entries, duplicate_edges, summary };
}

module.exports = { processData };
