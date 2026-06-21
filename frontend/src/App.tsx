/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import type { Student, TimelineEvent, Interview, Survey } from "./types.ts";
import {
  INITIAL_STUDENTS,
  INITIAL_INTERVIEWS,
  INITIAL_SURVEYS,
  INITIAL_TIMELINE_SOFIA,
} from "./data.ts";
import ValidationScreen from "./components/ValidationScreen.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import StudentPanel from "./components/StudentPanel.tsx";
import TeacherPanel from "./components/DocentePanel.tsx";
import TutorPanel from "./components/TutorPanel.tsx";

export default function App() {
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

  const handleLogout = () => {
    navigate("/");
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
            interviews={interviews}
            onAddTimelineEvent={handleAddTimelineEvent}
            onLogout={handleLogout}
            onUpdateStudent={handleUpdateStudent}
            students={students}
            surveys={surveys}
            timelineEventsMap={timelineEventsMap}
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
