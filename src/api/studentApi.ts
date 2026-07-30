import { apiClient } from "./client";
import type { Student } from "../types/student";

// TODO(OSDA-web): wire up against StudentController once this feature is
// picked up. Endpoint paths below are placeholders matching the backend's
// existing controller - confirm exact paths against the live API before
// relying on them.
export async function getStudents(): Promise<Student[]> {
  const response = await apiClient.get<Student[]>("/api/students");
  return response.data;
}

export async function getStudentById(studentId: string): Promise<Student> {
  const response = await apiClient.get<Student>(`/api/students/${studentId}`);
  return response.data;
}

export async function createStudent(student: Partial<Student>): Promise<Student> {
  const response = await apiClient.post<Student>("/api/students", student);
  return response.data;
}

export async function updateStudent(studentId: string, student: Partial<Student>): Promise<Student> {
  const response = await apiClient.put<Student>(`/api/students/${studentId}`, student);
  return response.data;
}

export async function deleteStudent(studentId: string): Promise<void> {
  await apiClient.delete(`/api/students/${studentId}`);
}
