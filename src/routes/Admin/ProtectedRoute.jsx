// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useSelector } from "react-redux";

import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.projet);

  if (!userInfo || userInfo.role !== "admin") {
    toast.error("Accès refusé : vous n'êtes pas administrateur");

    return <Navigate to="/connexion" replace />;
  }
  if (userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  // Allow access
  return <>{children}</>;
};

export default ProtectedRoute;
