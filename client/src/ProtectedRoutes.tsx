import { Navigate } from "react-router-dom";
import { useAppSelector } from "./state/hook";
import { JSX } from "react";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;


export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

