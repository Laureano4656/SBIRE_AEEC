import { useState, type FormEvent } from "react";
import { useUsuariosAdmin, useCarreras } from "../hooks/queries/useAdminQueries.ts";
import {
  useCreateUsuario,
  useUpdateUsuario,
  useToggleUsuarioActivo,
} from "../hooks/mutations/useAdminMutations.ts";
import type { UsuarioAdminResponse } from "../types/admin.ts";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: "docente_tutor" | "docente_carga" | "estudiante" | "administrador" | "admin_departamental";
  nombre_carrera: string;
  carrera_id: number;
  activo: boolean;
}



const mapUsuario = (u: UsuarioAdminResponse): Usuario => ({
  id: u.id,
  nombre: u.nombre,
  apellido: u.apellido,
  email: u.email,
  rol: u.rol as Usuario["rol"],
  nombre_carrera: u.nombre_carrera,
  carrera_id: u.carrera_id,
  activo: u.activo,
});

export default function PrincipalAdminPanel() {
  const { data: apiUsuarios = [] } = useUsuariosAdmin();
  const { data: carreras = [] } = useCarreras();
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario();
  const toggleMutation = useToggleUsuarioActivo();

  const usuarios = apiUsuarios.map(mapUsuario);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [userForm, setUserForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "docente_tutor" as Usuario["rol"],
    carrera_id: 0,
    activo: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const usuariosActivos = usuarios.filter((u) => u.activo).length;

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAbrirNuevoUsuario = () => {
    setEditingUser(null);
    setUserForm({
      nombre: "",
      apellido: "",
      email: "",
      rol: "docente_tutor",
      carrera_id: 0,
      activo: true,
    });
    setShowUserModal(true);
  };

  const handleEditarUsuario = (user: Usuario) => {
    setEditingUser(user);
    setUserForm({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      carrera_id: user.carrera_id,
      activo: user.activo,
    });
    setShowUserModal(true);
  };

  const handleGuardarUsuario = (e: FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({
        userId: editingUser.id,
        data: userForm,
      });
    } else {
      createMutation.mutate(userForm);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleToggleActivo = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;
    toggleMutation.mutate({ userId: id, activo: !usuario.activo });
  };

  const rolBadge = (rol: Usuario["rol"]) => {
    switch (rol) {
      case "administrador":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
            Administrador
          </span>
        );
      case "admin_departamental":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
            Admin Dptal.
          </span>
        );
      case "docente_tutor":
        return (
          <span className="bg-[#eef2ff] text-brand-primary px-2 py-0.5 rounded text-[10px] font-bold">
            Docente Tutor
          </span>
        );
      case "docente_carga":
        return (
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
            Docente Carga
          </span>
        );
      case "estudiante":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">
            Estudiante
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
            Gestión de Usuarios
          </h2>
          <button
            onClick={handleAbrirNuevoUsuario}
            className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Nuevo Usuario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
              TOTAL USUARIOS
            </span>
            <span className="text-3xl font-black text-brand-primary mt-1 block">
              {usuarios.length}
            </span>
          </div>
          <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
              ACTIVOS
            </span>
            <span className="text-3xl font-black text-[#006a6a] mt-1 block">
              {usuariosActivos}
            </span>
          </div>
          <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
              TUTORES
            </span>
            <span className="text-3xl font-black text-brand-primary mt-1 block">
              {usuarios.filter((u) => u.rol === "docente_tutor").length}
            </span>
          </div>
        </div>

        <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa]">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">
                  manage_accounts
                </span>
                Usuarios del Sistema
              </h4>
              <div className="relative w-56">
                <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-brand-outline text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1 border border-brand-outline-variant rounded bg-[#f3f4f5] text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-brand-outline-variant">
            {filteredUsuarios.map((u) => (
              <div
                key={u.id}
                className="p-5 hover:bg-[#f8f9fa] transition-colors flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-primary">
                      {u.nombre} {u.apellido}
                    </span>
                    {rolBadge(u.rol)}
                    {!u.activo && (
                      <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-outline font-semibold">
                    {u.email}
                  </p>
                  <p className="text-[10px] text-[#43474f]">
                    Carrera: {u.nombre_carrera}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActivo(u.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer ${u.activo
                      ? "text-[#93000a] border border-[#ffdad6] bg-[#ffdad6] hover:bg-[#ffc6c1]"
                      : "text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee]"
                      }`}
                  >
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => handleEditarUsuario(u)}
                    className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
            {filteredUsuarios.length === 0 && (
              <div className="p-12 text-center text-brand-outline font-medium text-xs">
                No se encontraron usuarios.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Usuario */}
      {showUserModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2
                id="user-modal-title"
                className="text-base font-bold text-brand-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xl">
                  {editingUser ? "edit" : "person_add"}
                </span>
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGuardarUsuario} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  value={userForm.nombre}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  placeholder="Ej: Juan"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Apellido
                </label>
                <input
                  required
                  type="text"
                  value={userForm.apellido}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, apellido: e.target.value }))
                  }
                  placeholder="Ej: Pérez"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@fi.mdp.edu.ar"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Rol
                </label>
                <select
                  value={userForm.rol}
                  onChange={(e) =>
                    setUserForm((f) => ({
                      ...f,
                      rol: e.target.value as Usuario["rol"],
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="administrador">Administrador</option>
                  <option value="admin_departamental">
                    Admin Departamental
                  </option>
                  <option value="docente_tutor">Docente Tutor</option>
                  <option value="docente_carga">Docente Carga</option>
                  <option value="estudiante">Estudiante</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Carrera asignada
                </label>
                <select
                  value={userForm.carrera_id}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, carrera_id: Number(e.target.value) }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value={0}>Seleccionar...</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userForm.activo}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, activo: e.target.checked }))
                  }
                  className="accent-brand-primary"
                />
                <span className="text-xs font-medium text-[#43474f]">
                  Cuenta activa
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
