import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040b28] bg-radial-spotlight flex flex-col items-center justify-center text-white gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" />
        </div>
        <span className="text-sm text-white/50 tracking-wide">
          Verificando sessão...
        </span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
