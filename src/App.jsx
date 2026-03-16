import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Loader2 } from "lucide-react";

// Importando nossas Páginas
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Verifica se existe alguém logado assim que o app abre
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsChecking(false);
    });

    // Fica escutando se alguém logou ou deslogou
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (O site dos clientes) */}
        <Route path="/" element={<Landing />} />

        {/* Rota de Login (Se já estiver logado, manda direto pro Admin) */}
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/admin" />}
        />

        {/* Rota Protegida (Se NÃO estiver logado, chuta de volta pro Login) */}
        <Route
          path="/admin"
          element={session ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
