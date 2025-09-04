'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
    <div className="text-center max-w-md mx-auto">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold mb-4 gradient-text">Something went wrong</h1>
      <p className="text-white/70 mb-6">
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </p>
      {error && (
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-white/60 hover:text-white mb-2">
            Technical Details
          </summary>
          <pre className="bg-gray-800/50 p-4 rounded-lg text-sm overflow-auto text-red-400">
            {error.message}
            {error.stack && `\n${error.stack}`}
          </pre>
        </details>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {resetError && (
          <button
            onClick={resetError}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;