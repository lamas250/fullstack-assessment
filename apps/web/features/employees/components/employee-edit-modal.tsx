import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmployeeForm, { FormSchema } from "./employee-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateEmployee, fetchDepartments, UserUpdateType } from "@/lib/api";
import { toast } from "sonner";
import { User } from "@/components/UserCard";
import { Department } from "@fs/prisma/prisma.ts";

export function EmployeeEditModal({ open, setOpen, isDeleting, user }: { open: boolean, setOpen: (open: boolean) => void, isDeleting: boolean, user: User }) {
  const queryClient = useQueryClient();
  const { mutate: updateEmployeeFn, isPending: isUpdating } = useMutation({
    mutationFn: (data: UserUpdateType) => updateEmployee(data),
    onSuccess: () => {
      toast.success('Employee updated successfully');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error creating employee');
    }
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const onSubmit = (data: FormSchema) => {
    const department = departments?.find((department: Department) => department.id === data.department);

    updateEmployeeFn({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      hireDate: new Date(user.hireDate),
      department: department?.name,
      address: user.address,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>View Employee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Employee Details</DialogTitle>
          <DialogDescription>
            View employee details
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm onSubmit={onSubmit} disabled={isUpdating || isDeleting} user={user} departments={departments} type="edit"/>
      </DialogContent>
    </Dialog>
  )
}