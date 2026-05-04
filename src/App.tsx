import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { isSupabaseConfigured } from "./lib/supabaseClient";
import { AlertTriangle, Terminal, ExternalLink } from "lucide-react";

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#040b28] bg-radial-spotlight text-white flex items-center justify-center p-4">
        <div className="surface-card max-w-2xl w-full p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-500/15 rounded-xl border border-amber-500/30">
              <AlertTriangle className="text-amber-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Configuração necessária
              </h1>
              <p className="text-white/60 text-sm">
                As chaves do Supabase não foram detectadas neste ambiente.
              </p>
            </div>
          </div>

          <p className="text-white/80 mb-5 leading-relaxed">
            Crie um arquivo <code className="text-amber-300">.env</code> na raiz
            do projeto (em desenvolvimento) ou configure as variáveis no
            painel da Vercel (em produção):
          </p>

          <div className="bg-black/40 rounded-xl p-4 font-mono text-sm border border-white/10 mb-5">
            <div className="flex items-center gap-2 text-white/50 mb-2 pb-2 border-b border-white/10">
              <Terminal size={14} />
              .env
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-blue-300">VITE_SUPABASE_URL</span>
                <span className="text-white/50">=</span>
                <span className="text-emerald-300">https://xxxxx.supabase.co</span>
              </div>
              <div>
                <span className="text-blue-300">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-white/50">=</span>
                <span className="text-emerald-300">eyJhbGciOi...</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-white/60 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <ExternalLink size={16} className="mt-0.5 text-blue-300" />
            <div>
              <strong className="text-white/80">Em produção (Vercel):</strong>{" "}
              acesse Project Settings → Environment Variables e adicione as duas
              chaves. Depois faça <em>redeploy</em>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
