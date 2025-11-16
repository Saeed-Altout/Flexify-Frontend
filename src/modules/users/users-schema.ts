import * as z from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  role: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  role: z.string().optional(),
});

export const queryUserSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'email', 'first_name', 'last_name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type QueryUserFormData = z.infer<typeof queryUserSchema>;

