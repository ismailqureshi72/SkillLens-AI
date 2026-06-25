import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-margin-desktop">
          <div className="max-w-lg mx-auto text-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-lg">
            <span className="material-symbols-outlined text-[64px] text-error mb-md block">
              error_outline
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Something Went Wrong
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left mb-lg">
                <summary className="font-label-md text-label-md text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                  Error Details
                </summary>
                <pre className="mt-sm p-md bg-surface-container rounded-lg text-error font-mono text-[12px] overflow-x-auto border border-outline-variant/20">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all inline-flex items-center gap-sm hover:opacity-95 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
