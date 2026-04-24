'use strict';

const { processData } = require('../src/services/processor');

function findHierarchy(result, root) {
  return result.hierarchies.find((h) => h.root === root);
}

describe('Spec example', () => {
  const data = [
    'A->B', 'A->C', 'B->D', 'C->E', 'E->F',
    'X->Y', 'Y->Z', 'Z->X',
    'P->Q', 'Q->R',
    'G->H', 'G->H', 'G->I',
    'hello', '1->2', 'A->',
  ];

  let result;
  beforeAll(() => { result = processData(data); });

  test('invalid_entries', () => {
    expect(result.invalid_entries).toEqual(['hello', '1->2', 'A->']);
  });

  test('duplicate_edges', () => {
    expect(result.duplicate_edges).toEqual(['G->H']);
  });

  test('tree A has correct structure and depth=4', () => {
    const h = findHierarchy(result, 'A');
    expect(h).toBeDefined();
    expect(h.has_cycle).toBeUndefined();
    expect(h.depth).toBe(4);
    expect(h.tree).toEqual({ A: { B: { D: {} }, C: { E: { F: {} } } } });
  });

  test('tree X is a cycle', () => {
    const h = findHierarchy(result, 'X');
    expect(h).toBeDefined();
    expect(h.has_cycle).toBe(true);
    expect(h.tree).toEqual({});
    expect(h.depth).toBeUndefined();
  });

  test('tree P depth=3', () => {
    const h = findHierarchy(result, 'P');
    expect(h.depth).toBe(3);
    expect(h.tree).toEqual({ P: { Q: { R: {} } } });
  });

  test('tree G depth=2', () => {
    const h = findHierarchy(result, 'G');
    expect(h.depth).toBe(2);
    expect(h.tree).toEqual({ G: { H: {}, I: {} } });
  });

  test('summary', () => {
    expect(result.summary.total_trees).toBe(3);
    expect(result.summary.total_cycles).toBe(1);
    expect(result.summary.largest_tree_root).toBe('A');
  });
});


describe('Input validation', () => {
  test('self-loop A->A is invalid', () => {
    const r = processData(['A->A']);
    expect(r.invalid_entries).toContain('A->A');
    expect(r.hierarchies).toHaveLength(0);
  });

  test('empty string is invalid', () => {
    const r = processData(['']);
    expect(r.invalid_entries).toContain('');
  });

  test('multi-char parent AB->C is invalid', () => {
    const r = processData(['AB->C']);
    expect(r.invalid_entries).toContain('AB->C');
  });

  test('wrong separator A-B is invalid', () => {
    const r = processData(['A-B']);
    expect(r.invalid_entries).toContain('A-B');
  });

  test('whitespace trimmed and validated  A->B  → valid', () => {
    const r = processData([' A->B ']);
    expect(r.invalid_entries).not.toContain(' A->B ');
    expect(r.hierarchies.length).toBe(1);
  });

  test('lowercase a->b is invalid', () => {
    const r = processData(['a->b']);
    expect(r.invalid_entries).toContain('a->b');
  });

  test('number 1->2 is invalid', () => {
    const r = processData(['1->2']);
    expect(r.invalid_entries).toContain('1->2');
  });
});


describe('Duplicate edges', () => {
  test('triple occurrence → duplicate_edges contains it once', () => {
    const r = processData(['A->B', 'A->B', 'A->B']);
    expect(r.duplicate_edges).toEqual(['A->B']);
  });

  test('two distinct edges each duplicated', () => {
    const r = processData(['A->B', 'A->C', 'A->B', 'A->C', 'A->B']);
    expect(r.duplicate_edges).toEqual(expect.arrayContaining(['A->B', 'A->C']));
    expect(r.duplicate_edges).toHaveLength(2);
  });
});


describe('Cycle detection', () => {
  test('simple 2-node cycle A->B B->A', () => {
    const r = processData(['A->B', 'B->A']);
    const h = findHierarchy(r, 'A');
    expect(h.has_cycle).toBe(true);
    expect(h.tree).toEqual({});
    expect(h.depth).toBeUndefined();
  });

  test('pure cycle all nodes appear as children → lex-smallest is root', () => {
    const r = processData(['C->A', 'A->B', 'B->C']);
    // All are children; lex-smallest = A
    const h = findHierarchy(r, 'A');
    expect(h).toBeDefined();
    expect(h.has_cycle).toBe(true);
  });

  test('non-cyclic tree has no has_cycle field', () => {
    const r = processData(['A->B', 'B->C']);
    const h = findHierarchy(r, 'A');
    expect('has_cycle' in h).toBe(false);
  });
});


describe('Diamond / multi-parent', () => {
  test('A->D first, B->D discarded', () => {
    const r = processData(['A->B', 'A->D', 'B->D']);
    const h = findHierarchy(r, 'A');
    // D should only appear under A, not also under B
    expect(h.tree).toEqual({ A: { B: {}, D: {} } });
  });
});


describe('Depth calculation', () => {
  test('single edge A->B → depth 2', () => {
    const r = processData(['A->B']);
    expect(findHierarchy(r, 'A').depth).toBe(2);
  });

  test('chain A->B->C->D → depth 4', () => {
    const r = processData(['A->B', 'B->C', 'C->D']);
    expect(findHierarchy(r, 'A').depth).toBe(4);
  });
});


describe('Summary', () => {
  test('empty input → all zeros', () => {
    const r = processData([]);
    expect(r.summary).toEqual({
      total_trees: 0,
      total_cycles: 0,
      largest_tree_root: null,
    });
  });

  test('all invalid → all zeros', () => {
    const r = processData(['hello', '1->2', '']);
    expect(r.summary.total_trees).toBe(0);
    expect(r.summary.total_cycles).toBe(0);
  });

  test('tiebreaker: equal depth → lex-smaller root wins', () => {
    // A->B (depth 2) and C->D (depth 2) — A < C
    const r = processData(['C->D', 'A->B']);
    expect(r.summary.largest_tree_root).toBe('A');
  });

  test('largest_tree_root is null when only cycles exist', () => {
    const r = processData(['A->B', 'B->A']);
    expect(r.summary.largest_tree_root).toBeNull();
  });
});


describe('processData error handling', () => {
  test('throws if data is not an array', () => {
    expect(() => processData('not an array')).toThrow(TypeError);
  });

  test('throws if data is null', () => {
    expect(() => processData(null)).toThrow(TypeError);
  });
});
