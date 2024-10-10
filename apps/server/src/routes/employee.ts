import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  employeeSchema
} from '../controllers/employee-controller';
import { validateRequest } from '../middlwares/validate-request';

const router = express.Router();


router.post('/', validateRequest(employeeSchema), createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', validateRequest(employeeSchema), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;