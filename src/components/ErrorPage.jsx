import React from "react";
import { useNavigate, useRouteError } from "react-router";
import { FaArrowCircleLeft } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        {/* Elegant Error Icon */}
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full blur-md opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl border border-slate-200 animate-bounce">
              <svg
                className="w-16 h-16 text-amber-500"
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

        {/* Error Content */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-slate-500 text-lg">Erreur</span>
            <span className="text-2xl font-bold text-amber-500 bg-amber-50 px-4 py-1 rounded-full border border-amber-200">
              {error?.status || "404"}
            </span>
          </div>

          <h1 className="text-2xl font-light text-slate-800 tracking-tight">
            {error?.data || "Page non trouvée"}
          </h1>

          {error?.message && (
            <p className="text-slate-500 text-sm leading-relaxed">
              {error.message}
            </p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-700 font-medium py-3 px-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-200 hover:text-amber-600 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FaArrowCircleLeft className="text-amber-500 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Retour à l'accueil</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
