import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
      );
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040b28] text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-radial-spotlight pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-[0.18] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="surface-card p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-soft mb-5">
              <img
                src="/logo.png"
                alt="Apolar"
                className="h-10 object-contain"
              />
            </div>
            <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-300/80 uppercase mb-1">
              Apolar Comercial
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Entre no painel
            </h2>
            <p className="text-sm text-white/55 mt-1">
              Acesso restrito à equipe.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-white/60 ml-1 tracking-wide uppercase"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ring-focus w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:border-blue-400/60 transition-colors"
                  placeholder="seunome@apolar.com.br"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-white/60 ml-1 tracking-wide uppercase"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ring-focus w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:border-blue-400/60 transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm bg-red-500/10 border border-red-400/30 px-3 py-2.5 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ring-focus w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/35 mt-6">
          © {new Date().getFullYear()} Apolar Comercial — Painel interno
        </p>
      </motion.div>
    </div>
  );
};
