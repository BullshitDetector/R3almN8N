import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('UI Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="text-red-600 p-4">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;