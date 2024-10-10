import { validateRequest } from '@/middlwares/validate-request';
import prisma from '@fs/prisma/prisma.ts';
import { Request, Response } from 'express';
import slugify from 'slugify';
import { z } from 'zod';

export const employeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    department: z.string().min(1, "Department is required"),
    hireDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const createEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, department, hireDate, phone, address } = req.body;

  const departmentSlug = slugify(department, { lower: true });

  const hireDateFormated = new Date(hireDate);

  const departmentData = await prisma.department.upsert({
    where: { slug: departmentSlug },
    update: {},
    create: { name: department, slug: departmentSlug },
  });

  const employee = await prisma.user.create({
    data: {
      firstName,
      lastName,
      hireDate: hireDateFormated,
      phone,
      address,
      department: {
        connect: { id: departmentData.id },
      },
    },
  });

  await prisma.userDepartmentHistory.create({
    data: {
      userId: employee.id,
      departmentId: departmentData.id,
    },
  });

  res.status(201).json({ message: 'Employee created successfully' });
};

export const getAllEmployees = async (req: Request, res: Response) => {
  const employees = await prisma.user.findMany({
    include: { department: true },
  });

  res.status(200).json({ employees });
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });

  res.status(200).json({ employee });
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, department, hireDate, phone, address } = req.body;

  const employee = await prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const departmentSlug = slugify(department, { lower: true });

  const departmentData = await prisma.department.upsert({
    where: { slug: departmentSlug },
    update: {},
    create: { name: department, slug: departmentSlug },
  });

  if (employee.department.slug !== departmentSlug) {
    await prisma.userDepartmentHistory.create({
      data: {
        userId: employee.id,
        departmentId: departmentData.id,
      },
    });
  }

  const hireDateFormated = new Date(hireDate);

  await prisma.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      hireDate: hireDateFormated,
      phone,
      address,
      department: {
        connect: { id: departmentData.id },
      },
    },
  });

  res.status(200).json({ message: 'Employee updated successfully' });
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction(async (prisma) => {
    await prisma.userDepartmentHistory.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });
  });

  res.status(200).json({ message: 'Employee deleted successfully' });
};
