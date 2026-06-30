import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import type { Student, Survey } from "./types/types.ts";
import { INITIAL_STUDENTS, INITIAL_SURVEYS } from "./data.ts";
import AdminPanel from "./components/AdminPanel.tsx";
import PrincipalAdminPanel from "./components/PrincipalAdminPanel.tsx";
import StudentPanel from "./components/StudentPanel.tsx";
import TeacherPanel from "./components/DocentePanel.tsx";
import TutorPanel from "./components/tutor/TutorPanel.tsx";
import AuthCallback from "./components/AuthCallback.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LandingPage from "./components/LandingPage.tsx";

export default function App() {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin_departamental"]}>
            <AdminPanel onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <PrincipalAdminPanel onLogout={handleLogout} students={students} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["estudiante"]}>
            <StudentPanel onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["docente_carga"]}>
            <TeacherPanel onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutor/*"
        element={
          <ProtectedRoute allowedRoles={["docente_tutor", "asesor_par"]}>
            <TutorPanel onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
