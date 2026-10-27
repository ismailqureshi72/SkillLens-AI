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
        <main className="app-error-screen bg-surface" role="alert">
          <div className="app-error-card text-center bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-lg">
            <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-error mb-md mx-auto">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 3h.01" />
            </svg>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Something Went Wrong
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
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
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7v5h-5M4 17v-5h5M5.6 8a7 7 0 0111.6-2L20 9M4 15l2.8 3A7 7 0 0018.4 16" /></svg>
              Reload Page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
