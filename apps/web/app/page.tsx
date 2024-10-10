"use client"

import { Card } from "@/components/ui/card";
import UserCard, { User } from "@/components/UserCard";
import { EmployeeFormModal } from "@/features/employees/components/employee-form-modal";
import { deleteEmployee, fetchEmployees } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { mutate: deleteEmployeeFn, isPending: isDeleting } = useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(employeeId),
    onSuccess: () => {
      toast.success('Employee deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error deleting employee');
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Employees</h1>
          <EmployeeFormModal open={open} setOpen={setOpen} isDeleting={isDeleting} />
        </div>
        <Card className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 bg-gray-50">
        {data.map((user: User) => (
            <UserCard key={user.id} user={user} onDelete={deleteEmployeeFn} />
          ))}
        </Card>
      </div>
    </div>
  );
}