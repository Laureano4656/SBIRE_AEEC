/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import type { Student, TimelineEvent, Interview, Survey } from "./types.ts";
import {
  INITIAL_STUDENTS,
  INITIAL_INTERVIEWS,
  INITIAL_SURVEYS,
  INITIAL_TIMELINE_SOFIA,
} from "./data.ts";
import LoginScreen from "./components/LoginScreen.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import StudentPanel from "./components/StudentPanel.tsx";
import TeacherPanel from "./components/DocentePanel.tsx";
export default function App() {
  const [currentRole, setCurrentRole] = useState<
    "login" | "admin" | "student" | "teacher"
  >("login");

  // Shared Global State for exact real-time response feeling
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [surveys] = useState<Survey[]>(INITIAL_SURVEYS);

  // Timeline events mapped by student ID
  const [timelineEventsMap, setTimelineEventsMap] = useState<{
    [studentId: string]: TimelineEvent[];
  }>({
    sofia_martinez: INITIAL_TIMELINE_SOFIA,
    lucas_garcia: [],
    ana_rodriguez: [],
    mateo_garcia: [],
    mateo_alvarado: [],
  });

  const handleLogin = (role: "admin" | "student" | "teacher") => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole("login");
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    );

    // Sync planned interviews or calendar items if state alerts change
    if (updatedStudent.riskLevel === "SEGURO") {
      // Complete any scheduled interviews for this student
      setInterviews((prev) =>
        prev.map((i) =>
          i.studentId === updatedStudent.id
            ? { ...i, status: "COMPLETADA" }
            : i,
        ),
      );
    }
  };

  const handleAddTimelineEvent = (studentId: string, event: TimelineEvent) => {
    setTimelineEventsMap((prev) => {
      const currentList = prev[studentId] || [];
      return {
        ...prev,
        [studentId]: [event, ...currentList],
      };
    });

    // If an interview was registered, add to interviews lists as well
    if (event.type === "ENTREVISTA" && event.description.includes("agendada")) {
      const match = event.description.match(/el día ([\d-]+) a las ([\d:]+)/);
      const dateString = match ? match[1] : "Prontamente";
      const timeString = match ? match[2] : "A coordinar";

      const foundStudent = students.find((s) => s.id === studentId);

      const newInterview: Interview = {
        id: "interview_" + Date.now(),
        studentId: studentId,
        studentName: foundStudent ? foundStudent.fullName : "Estudiante",
        date: dateString,
        time: timeString + " hs",
        modality: event.description.includes("Virtual")
          ? "Virtual"
          : "Presencial",
        location: "Aula de Tutorías o Zoom Link",
        status: "PENDIENTE",
      };
      setInterviews((prev) => [newInterview, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface font-sans antialiased">
      {currentRole === "login" && <LoginScreen onLogin={handleLogin} />}

      {currentRole === "admin" && (
        <AdminPanel
          students={students}
          interviews={interviews}
          surveys={surveys}
          timelineEventsMap={timelineEventsMap}
          onUpdateStudent={handleUpdateStudent}
          onAddTimelineEvent={handleAddTimelineEvent}
          onLogout={handleLogout}
        />
      )}

      {currentRole === "student" && <StudentPanel onLogout={handleLogout} />}

      {currentRole === "teacher" && <TeacherPanel onLogout={handleLogout} />}
    </div>
  );
}
