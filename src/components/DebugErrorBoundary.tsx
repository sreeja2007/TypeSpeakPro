import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class DebugErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-950/20 p-8 text-white">
                    <div className="max-w-2xl w-full bg-black/50 border border-red-500/50 rounded-xl p-6 shadow-2xl">
                        <div className="flex items-center gap-4 mb-4 text-red-400">
                            <AlertTriangle className="w-8 h-8" />
                            <h1 className="text-2xl font-bold">Something went wrong</h1>
                        </div>

                        <div className="bg-red-950/50 p-4 rounded-lg border border-red-500/20 font-mono text-xs overflow-auto max-h-[400px]">
                            <p className="text-red-200 font-bold mb-2">{this.state.error?.toString()}</p>
                            <p className="text-red-400/70 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DebugErrorBoundary;
