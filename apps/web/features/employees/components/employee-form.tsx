import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Department } from "@fs/prisma/prisma.ts";
import { User } from "@/components/UserCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  hireDate: z.string().min(1),
  department: z.string().min(1),
  address: z.string().min(1),
});

export type FormSchema = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormSchema) => void;
  disabled?: boolean;
  loading?: boolean;
  user?: User;
  departments?: Department[];
  type: 'create' | 'edit';
}

export default function EmployeeForm({ onSubmit, disabled, loading, user, departments, type }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      hireDate: user?.hireDate ? new Date(user?.hireDate).toISOString() : "",
      department: user?.departmentId || "",
      address: user?.address || "",
    },
  });

  const handleSubmit = (values: FormSchema) => {
    if (!form.getValues('firstName')) {
      toast.error('First name is required');
      return;
    }
    if (!form.getValues('lastName')) {
      toast.error('Last name is required');
      return;
    }
    onSubmit(values);

    form.reset();
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={loading ? 'opacity-50' : ''}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={type === 'edit'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={type === 'edit'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} disabled={type === 'edit'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hire Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" disabled={type === 'edit'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} disabled={type === 'edit'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                {type === 'create' ? (
                  <Input {...field} />
                ) : (
                  <Select {...field} onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('department', value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((department) => (
                        <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
            </FormItem>
          )}
        />
        {type === 'create' ? (
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={disabled}>Submit</Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={disabled || user?.departmentId === form.getValues('department')}>Update Employee Department</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
