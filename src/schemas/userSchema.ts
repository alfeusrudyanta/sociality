import { z } from 'zod';

const emailRegex = /^\S+@\S+\.\S+$/;

const UserSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Name must be at least 6 characters long' })
    .max(24, { message: 'Name must be less than 24 characters' }),
  username: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters long' })
    .max(24, { message: 'Username must be less than 24 characters' }),
  email: z.string().refine((val) => emailRegex.test(val), {
    message: 'Invalid email address',
  }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: 'Phone must contain only numbers' })
    .min(10, { message: 'Phone must be at least 10 digits' })
    .max(15, { message: 'Phone must be less than 15 digits' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

export type UserInput = z.infer<typeof UserSchema>;
export default UserSchema;
