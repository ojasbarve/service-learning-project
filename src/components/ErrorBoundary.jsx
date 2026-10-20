import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24, background: '#f4f5f7' }}>
        <section style={{ maxWidth: 440, padding: 32, borderRadius: 22, background: '#fff', boxShadow: '0 16px 40px rgba(29,35,49,.1)', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', margin: '0 auto 16px', borderRadius: 16, background: '#fff0eb', color: '#f15b35', fontWeight: 800 }}>N</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>Something needs a refresh</h1>
          <p style={{ margin: '0 0 10px', color: '#747985', fontSize: '.9rem' }}>Nourish.Net hit an unexpected UI error. Your saved data is safe.</p>
          {this.state.error?.message && <code style={{ display: 'block', margin: '0 auto 22px', maxWidth: 360, overflowWrap: 'anywhere', color: '#a43b22', fontSize: '.72rem' }}>{this.state.error.message}</code>}
          <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 12, padding: '11px 18px', background: '#f15b35', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Reload Nourish.Net</button>
        </section>
      </main>
    );
  }
}
