import React, { useState } from 'react';

const PLACEHOLDER = `A->B, A->C, B->D, C->E, E->F
X->Y, Y->Z, Z->X
P->Q, Q->R
G->H, G->H, G->I
hello, 1->2, A->`;

const API_URL = import.meta.env.VITE_API_URL || '/bfhl';

export default function InputPanel({ onResult, onError, onClear }) {
  const [raw, setRaw] = useState('');
  const [loading, setLoading] = useState(false);

  function parseInput(text) {
    
    return text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 || text.split(/[\n,]+/).some((t) => t === ''));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!raw.trim()) return;

    const data = parseInput(raw);
    setLoading(true);
    onError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      onResult(json);
    } catch (err) {
      onError(err.message || 'Failed to reach the API. Make sure the backend is running.');
      onResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setRaw('');
    onClear();
  }

  function loadExample() {
    setRaw(PLACEHOLDER);
    onClear();
  }

  return (
    <div className="input-panel card">
      <div className="input-panel__label">
        <span className="dot" />
        Node Edges
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="node-input"
          className="input-panel__textarea"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          aria-label="Enter node edges"
          spellCheck={false}
        />
        <p className="input-panel__hint">
          Separate entries with <code>,</code> or newlines. Format:{' '}
          <code>A-{'->'}B</code> (single uppercase letter → single uppercase letter)
        </p>
        <div className="input-panel__actions">
          <button
            id="submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading || !raw.trim()}
          >
            {loading ? (
              <>
                <span className="spinner" /> Analysing…
              </>
            ) : (
              <>⚡ Submit</>
            )}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={loadExample}
            disabled={loading}
          >
            Load Example
          </button>
          {raw && (
            <button
              type="button"
              className="btn-ghost"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
