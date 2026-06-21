/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface LoginScreenProps {
  onLogin: (role: "admin" | "student" | "teacher" | "tutor") => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (email.toLowerCase().includes("admin") || password === "admin") {
      onLogin("admin");
    } else {
      onLogin("student");
    }
  };

  const loginAs = (role: "admin" | "student" | "teacher" | "tutor") => {
    if (role === "admin") {
      setEmail("administrador@fi.mdp.edu.ar");
      setPassword("••••••••••••");
      onLogin("admin");
    } else if (role === "teacher") {
      setEmail("profesor@fi.mdp.edu.ar");
      setPassword("••••••••••••");
      onLogin("teacher");
    } else if (role === "student") {
      setEmail("m.garcia@fi.mdp.edu.ar");
      setPassword("••••••••••••");
      onLogin("student");
    } else {
      setEmail("tutor@fi.mdp.edu.ar");
      setPassword("••••••••••••");
      onLogin("tutor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-surface pt-12 pb-6 px-4 md:px-0">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-brand-outline-variant shadow-sm max-w-md w-full p-8 text-center animate-fade-in">
          {/* Logo Container */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-brand-primary text-3xl font-light">
                account_balance
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">
            SBIRE
          </h1>
          <p className="text-slate-500 font-semibold text-xs tracking-wider uppercase mb-8">
            SISTEMA TRAVESÍA
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
            {error && (
              <div className="p-3 bg-brand-error-container text-brand-on-error-container rounded-xl text-xs leading-relaxed font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Usuario o Correo Institucional
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">
                  account_circle
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej: administrador@fi.mdp.edu.ar"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Token de Servicio / Contraseña
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">
                  vpn_key
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <span className="material-symbols-outlined text-lg">login</span>
            </button>
          </form>

          {/* Quick Access Roles */}
          <div className="mt-8 border-t border-brand-outline-variant pt-6 text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Acceso Rápido de Prueba:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => loginAs("admin")}
                className="py-3 px-3 border border-brand-primary text-brand-primary hover:bg-brand-primary/5 rounded-xl text-xs font-bold flex flex-col justify-center items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  admin_panel_settings
                </span>
                <span>Tutor Académico</span>
              </button>
              <button
                onClick={() => loginAs("student")}
                className="py-3 px-3 border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/5 rounded-xl text-xs font-bold flex flex-col justify-center items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  school
                </span>
                <span>Estudiante</span>
              </button>
              <button
                onClick={() => loginAs("teacher")}
                className="py-3 px-3 border border-brand-tertiary text-brand-tertiary hover:bg-brand-tertiary/5 rounded-xl text-xs font-bold flex flex-col justify-center items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  person
                </span>
                <span>Profesor</span>
              </button>
              <button
                onClick={() => loginAs("tutor")}
                className="py-3 px-3 border border-brand-quaternary text-brand-quaternary hover:bg-brand-quaternary/5 rounded-xl text-xs font-bold flex flex-col justify-center items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  support_agent
                </span>
                <span>Personal de Apoyo</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="#contact-support"
              className="inline-flex items-center gap-1.5 text-xs text-brand-secondary underline font-semibold hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-sm">help</span>
              ¿Problemas con el acceso? Contactar soporte técnico
            </a>
          </div>
        </div>
      </div>

      {/* Footer message consistent with design */}
      <footer className="text-center text-xs text-slate-400 tracking-tight mt-8">
        <p>© 2026 SBIRE - Facultad de Ingeniería, UNMdP.</p>
        <p className="text-brand-error font-bold tracking-wider uppercase mt-1 text-[10px]">
          ACCESO RESTRINGIDO PARA PERSONAL AUTORIZADO Y ALUMNOS.
        </p>
      </footer>
    </div>
  );
}
