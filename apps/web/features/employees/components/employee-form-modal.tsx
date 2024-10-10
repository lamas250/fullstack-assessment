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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEmployee, UserCreateType } from "@/lib/api";
import { toast } from "sonner";

export function EmployeeFormModal({ open, setOpen, isDeleting }: { open: boolean, setOpen: (open: boolean) => void, isDeleting: boolean }) {
   const queryClient = useQueryClient();
  const { mutate: createEmployeeFn, isPending: isCreating } = useMutation({
    mutationFn: (data: UserCreateType) => createEmployee(data),
    onSuccess: () => {
      toast.success('Employee created successfully');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error creating employee');
    }
  });

  const onSubmit = (data: FormSchema) => {
    createEmployeeFn({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      hireDate: new Date(data.hireDate),
      department: data.department,
      address: data.address,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Employee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm onSubmit={onSubmit} disabled={isCreating || isDeleting} type="create"/>
      </DialogContent>
    </Dialog>
  )
}