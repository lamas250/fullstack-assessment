import { User } from "@fs/prisma/prisma.ts";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type UserCreateType = Pick<User, 'firstName' | 'lastName' | 'phone' | 'hireDate' | 'address'> & { department: string };
export type UserUpdateType = Pick<User, 'id' | 'firstName' | 'lastName' | 'phone' | 'hireDate' | 'address'> & { department: string };

export async function fetchEmployees() {
  console.log(API_BASE_URL);

  const response = await fetch(`${API_BASE_URL}/employee`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  const data = await response.json();

  return data.employees;
}

export async function deleteEmployee(employeeId: string) {
  const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
}

export async function createEmployee(employee: UserCreateType) {
  const response = await fetch(`${API_BASE_URL}/employee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
}

export async function fetchDepartments() {
  const response = await fetch(`${API_BASE_URL}/department`);
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  const data = await response.json();
  return data.departments;
}

export async function updateEmployee(employee: UserUpdateType) {
  const response = await fetch(`${API_BASE_URL}/employee/${employee.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
}