import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
      .then(() => next())
      .catch((error) => {
        if (error instanceof ZodError) {
          res.status(400).json({
            message: 'Validation failed',
            errors: error.format(),
          });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      });
  };