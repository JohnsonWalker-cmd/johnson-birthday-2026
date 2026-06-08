import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("System Critical Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#050505] flex items-center justify-center p-4 z-50 font-mono text-green-500">
          <div className="max-w-md w-full bg-green-900/10 border border-green-500/30 p-8 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
             {/* Scanline decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
            
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold tracking-widest uppercase">System Failure</h2>
            </div>
            
            <p className="text-sm mb-6 text-green-400/80 leading-relaxed">
              An unexpected anomaly occurred in the navigation module.
              <br />
              <span className="text-xs opacity-50 mt-2 block font-mono">
                {this.state.error?.message || "Unknown Error"}
              </span>
            </p>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 uppercase tracking-widest text-xs transition-all group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Reboot System</span>
            </button>
          </div>
        </div>
      );
    }

    // Fix: Correctly return children when there is no error. The original code was correct but rewriting it to ensure no hidden issues.
    return this.props.children;
  }
}

export default ErrorBoundary;
