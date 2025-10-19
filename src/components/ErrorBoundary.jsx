import React from "react";
import { useNavigate } from "react-router";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Check if it's the removeChild DOM error
    if (
      error.message.includes("removeChild") ||
      error.message.includes("Node")
    ) {
      console.warn("DOM manipulation error caught by ErrorBoundary");
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full blur-md opacity-30"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl border border-slate-200">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-light text-slate-800 tracking-tight">
            Une erreur s'est produite
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            L'application a rencontré un problème inattendu.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left text-xs text-slate-400 bg-slate-50 p-3 rounded border">
              <summary className="cursor-pointer">Détails de l'erreur</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error?.message}</pre>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-500 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all duration-300"
          >
            Recharger la page
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-slate-700 font-medium py-3 px-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-200 hover:text-amber-600 transition-all duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
