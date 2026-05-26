import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: 'red' }}>Something went wrong: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}