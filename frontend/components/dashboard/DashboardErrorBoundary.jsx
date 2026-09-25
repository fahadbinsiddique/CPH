'use client';

import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Error Boundary for dashboard components
 * Catches render errors in children and displays fallback UI
 */
export class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DashboardErrorBoundary] Caught error:', error, errorInfo);
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
    
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-md mx-auto my-8 rounded-2xl border-red-100 bg-red-50/50 shadow-sm" role="alert">
          <CardContent className="space-y-4 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-100" aria-hidden="true">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Something went wrong</h3>
              <p className="mt-1 text-sm text-slate-500">
                {this.state.error?.message || 'An unexpected error occurred in the dashboard'}
              </p>
            </div>
            <Button 
              onClick={this.handleRetry} 
              className="rounded-xl bg-teal-700 hover:bg-teal-800"
              aria-label="Retry loading dashboard"
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-4 p-3 text-xs bg-slate-100 rounded-lg">
                <summary className="font-mono text-slate-600 cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-600">{this.state.error.stack}</pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized error boundary for async components (Suspense fallback)
 */
export function DashboardSuspenseFallback({ 
  message = 'Loading...', 
  error 
}) {
  return (
    <Card className="max-w-md mx-auto my-8 rounded-2xl border-amber-100 bg-amber-50/50 shadow-sm" role="status">
      <CardContent className="space-y-4 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-200 bg-amber-100" aria-hidden="true">
          <AlertCircle className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Unable to Load</h3>
          <p className="mt-1 text-sm text-slate-500">
            {error?.message || message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardErrorBoundary;