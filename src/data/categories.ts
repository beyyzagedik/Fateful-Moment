import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'history-war',
    title: 'History & War',
    icon: 'history',
    tint: ['#3A4152', '#0B1020'],
    image: require('../../assets/images/white-house-night.png'),
  },
  { id: 'business', title: 'Business World', icon: 'business', tint: ['#2C3E50', '#0A1222'] },
  { id: 'crisis-security', title: 'Crisis & Security', icon: 'crisis', tint: ['#4A2E1F', '#110A12'] },
  { id: 'science', title: 'Science', icon: 'science', tint: ['#3B1D4A', '#0B0A1E'] },
];
