/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import type { Student, Interview, Survey } from "./types.ts";
import { INITIAL_STUDENTS, INITIAL_INTERVIEWS, INITIAL_SURVEYS } from "./data.ts";
import ValidationScreen from "./components/ValidationScreen.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import PrincipalAdminPanel from "./components/PrincipalAdminPanel.tsx";
import StudentPanel from "./components/StudentPanel.tsx";
import TeacherPanel from "./components/DocentePanel.tsx";
import TutorPanel from "./components/TutorPanel.tsx";

export default function App() {
  // Shared Global State for exact real-time response feeling
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [surveys] = useState<Survey[]>(INITIAL_SURVEYS);

  const handleLogout = () => {
    navigate("/");
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    );

    if (updatedStudent.riskLevel === "SEGURO") {
      setInterviews((prev) =>
        prev.map((i) =>
          i.studentId === updatedStudent.id
            ? { ...i, status: "COMPLETADA" }
            : i,
        ),
      );
    }
  };

  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<ValidationScreen onValidated={() => navigate("/admin")} />}
      />

      <Route
        path="/admin"
        element={
          <AdminPanel
            onLogout={handleLogout}
            onUpdateStudent={handleUpdateStudent}
            students={students}
            surveys={surveys}
          />
        }
      />

      <Route
        path="/superadmin"
        element={
          <PrincipalAdminPanel
            onLogout={handleLogout}
            students={students}
          />
        }
      />

      <Route
        path="/student"
        element={<StudentPanel onLogout={handleLogout} />}
      />

      <Route
        path="/teacher"
        element={<TeacherPanel onLogout={handleLogout} />}
      />

      <Route path="/tutor" element={<TutorPanel onLogout={handleLogout} />} />
    </Routes>
  );
}
