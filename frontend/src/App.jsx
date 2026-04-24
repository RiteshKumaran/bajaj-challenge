import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResponsePanel from './components/ResponsePanel';

export default function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="app">
      
      <header className="header">
        <div className="header__logo">
          <div className="header__icon">🌲</div>
        </div>
        <h1 className="header__title">BFHL Tree Explorer</h1>
        <p className="header__subtitle">
          SRM Full Stack Engineering Challenge — Hierarchical Relationship Analyser
        </p>
      </header>

     
      <InputPanel
        onResult={setResult}
        onError={setError}
        onClear={() => { setResult(null); setError(null); }}
      />

    
      {error && (
        <div className="error-banner" role="alert">
          <span className="error-banner__icon">⚠</span>
          <div>
            <strong>API Error: </strong>{error}
          </div>
        </div>
      )}

      
      {result && <ResponsePanel data={result} />}

      
      {!result && !error && (
        <div className="empty-state">
          <div className="empty-state__icon">🌿</div>
          <div className="empty-state__title">Ready to analyse</div>
          <div className="empty-state__sub">
            Enter edges above (e.g. <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8em' }}>A-&gt;B, A-&gt;C, B-&gt;D</code>) and click Submit.
          </div>
        </div>
      )}
    </div>
  );
}
