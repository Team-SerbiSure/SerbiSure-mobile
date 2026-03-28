export type HomeownerRequest = {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  urgency?: string;
  date: string;
  est: string;
  homeownerName: string;
  status: 'Open' | 'Confirmed' | 'Completed' | 'Cancelled';
};

export const INITIAL_REQUESTS: HomeownerRequest[] = [
  {
    id: 'req-1',
    title: 'Pipe Repair',
    category: 'Plumbing',
    subcategory: 'Emergency',
    urgency: 'Emergency',
    date: 'Today, 2:00 PM',
    est: '₱85',
    homeownerName: 'Rhoydel Jr Elan',
    status: 'Open',
  },
  {
    id: 'req-2',
    title: 'Fixture Install',
    category: 'Electrical',
    subcategory: 'Standard',
    urgency: 'Standard',
    date: 'Tomorrow, 10 AM',
    est: '₱120',
    homeownerName: 'Rhoydel Jr Elan',
    status: 'Open',
  },
  {
    id: 'req-3',
    title: 'Deep Cleaning',
    category: 'Cleaning',
    subcategory: 'Home',
    urgency: 'Standard',
    date: 'Oct 24, 9:00 AM',
    est: '₱150',
    homeownerName: 'Rhoydel Jr Elan',
    status: 'Confirmed',
  },
  {
    id: 'req-4',
    title: 'Breaker Panel Check',
    category: 'Electrical',
    subcategory: 'Standard',
    urgency: 'Standard',
    date: 'March 17, 2026 9:00 AM',
    est: '₱120',
    homeownerName: 'Rhoydel Jr Elan',
    status: 'Completed',
  },
];
