import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, DownloadCloud } from 'lucide-react';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const isChunkError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError';

    return { 
      hasError: true, 
      error,
      isChunkError: !!isChunkError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[EduPulse ErrorBoundary] Crash in module ${this.props.moduleName || 'Global'}:`, error, errorInfo);
  }

  private handleReset = () => {
    if (this.state.isChunkError) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null, isChunkError: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      const isChunk = this.state.isChunkError;

      return (
        <div
          style={{
            padding: '32px',
            margin: '24px',
            borderRadius: '20px',
            background: 'var(--glass-bg, #0f172a)',
            backdropFilter: 'blur(12px)',
            border: isChunk ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            color: 'var(--color-text-primary, #f8fafc)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: isChunk ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isChunk ? '#3b82f6' : '#ef4444',
            }}
          >
            {isChunk ? <DownloadCloud size={32} /> : <AlertTriangle size={32} />}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0' }}>
              {isChunk 
                ? 'EduPulse Update Available' 
                : (this.props.moduleName ? `${this.props.moduleName} Module Error` : 'Module Render Recovered')}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #94a3b8)', margin: 0, maxWidth: '480px' }}>
              {isChunk 
                ? 'A new version of EduPulse was deployed to Vercel. Please reload to fetch the latest application updates.'
                : 'An isolated error occurred in this module component. Other EduPulse operations remain active.'}
            </p>
          </div>
          {this.state.error && (
            <pre
              style={{
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '12px',
                borderRadius: '10px',
                color: isChunk ? '#93c5fd' : '#f87171',
                maxWidth: '600px',
                overflowX: 'auto',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            {isChunk ? <DownloadCloud size={16} /> : <RefreshCw size={16} />}
            {isChunk ? 'Reload Application Version' : 'Recover Module'}
          </button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
