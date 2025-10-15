// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.projet);

  useEffect(() => {
    if (!userInfo) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
    } else if (userInfo.role !== "admin") {
      toast.error("Accès refusé : vous n'êtes pas administrateur");
    }
  }, [userInfo]);

  // If no user, redirect to login
  if (!userInfo) {
    return <Navigate to="/connexion" replace />;
  }

  // If user is not admin, redirect to home
  if (userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Allow access for admin users
  return <>{children}</>;
};

export default ProtectedRoute;
