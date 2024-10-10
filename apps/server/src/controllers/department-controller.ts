import prisma from '@fs/prisma/prisma.ts';
import { Request, Response } from 'express';

export const getAllDepartments = async (req: Request, res: Response) => {
  const departments = await prisma.department.findMany();

  res.status(200).json({ departments });
};
