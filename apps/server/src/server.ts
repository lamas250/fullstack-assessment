import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import employeeRoutes from './routes/employee';
import departmentRoutes from './routes/departments';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/employee', employeeRoutes);
app.use('/api/department', departmentRoutes);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
