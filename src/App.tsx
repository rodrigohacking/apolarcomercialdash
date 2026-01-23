import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { isSupabaseConfigured } from "./lib/supabaseClient";
import { AlertTriangle, Terminal } from "lucide-react";

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="text-amber-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold">Configuração Necessária</h1>
          </div>

          <p className="text-slate-300 mb-6">
            O sistema de login foi implementado, mas as chaves do Supabase ainda não foram configuradas.
            Por segurança, o app não inicia sem elas.
          </p>

          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm border border-slate-700 mb-6">
            <div className="flex items-center gap-2 text-slate-400 mb-2 pb-2 border-b border-white/5">
              <Terminal size={14} />
              src/lib/supabaseClient.ts
            </div>
            <div className="space-y-1">
              <div className="text-slate-500">// Edite este arquivo e coloque suas chaves</div>
              <div><span className="text-purple-400">const</span> <span className="text-blue-400">SUPABASE_URL</span> = <span className="text-green-400">"SUA_URL_AQUI"</span>;</div>
              <div><span className="text-purple-400">const</span> <span className="text-blue-400">SUPABASE_ANON_KEY</span> = <span className="text-green-400">"SUA_KEY_AQUI"</span>;</div>
            </div>
          </div>

          <p className="text-sm text-slate-400 text-center">
            Siga o guia <strong>supabase_setup_guide.md</strong> que criei para você.
            <br />
            Assim que salvar o arquivo, o app recarregará automaticamente.
          </p>
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
