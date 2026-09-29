import type { User } from '@/types';

/**
 * Seed accounts for the offline demo. There is no backend: sign-in checks
 * against this list plus any accounts created on the device.
 */
export const seedUsers: User[] = [
  {
    id: 'u-demo',
    fullName: 'James Smith',
    email: 'jamessmith@mail.com',
    password: 'Fateful1',
  },
];

/** Account used by the "Continue with Apple / Google" buttons. */
export const socialDemoUser: User = {
  id: 'u-social',
  fullName: 'John Doe',
  email: 'johndoe@mail.com',
  password: '',
};
