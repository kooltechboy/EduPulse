import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[EduPulse ErrorBoundary] Crash in module ${this.props.moduleName || 'Global'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '32px',
            margin: '24px',
            borderRadius: '20px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            color: 'var(--color-text-primary)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0' }}>
              {this.props.moduleName ? `${this.props.moduleName} Module Error` : 'Module Render Recovered'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '480px' }}>
              An isolated error occurred in this module component. Other EduPulse operations remain active.
            </p>
          </div>
          {this.state.error && (
            <pre
              style={{
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '10px',
                color: '#f87171',
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
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} /> Recover Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
