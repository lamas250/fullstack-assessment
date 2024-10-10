import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { EmployeeEditModal } from "@/features/employees/components/employee-edit-modal"
import { Department } from "@fs/prisma/prisma.ts"
import { useState } from "react"

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  hireDate: string;
  departmentId: string;
  department: Department;
  address: string;
}


export default function UserCard({ user, onDelete }: { user: User, onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);

 const formatHireDate = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - hire.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

    const formattedDate = hire.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `${formattedDate} (${diffYears}y - ${diffMonths}m - ${diffDays}d)`;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
              <AvatarFallback>{user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-muted-foreground">Hired: {formatHireDate(user.hireDate)}</p>
              <p className="text-sm text-muted-foreground">Phone: {user.phone}</p>
              <p className="text-sm text-muted-foreground">Department: {user.department.name}</p>
            </div>
          </div>
          <div className="ml-4 flex gap-2">
            <EmployeeEditModal user={user} open={open} setOpen={setOpen} isDeleting={false} />
            <Button variant="destructive" className="ml-2" onClick={() => onDelete(user.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}