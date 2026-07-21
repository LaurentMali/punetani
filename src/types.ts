export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  city: string;
  category: string;
  type: 'Kohë e plotë' | 'Kohë e pjesshme' | 'Punë nga shtëpia' | 'Praktikë';
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedAt: string; // ISO string or relative time
  isFeatured?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'E shqyrtuar' | 'Në pritje' | 'Pranuar' | 'Refuzuar';
  appliedAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  preferredCity: string;
  preferredCategory: string;
  preferredType: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'job_match' | 'application_status' | 'system';
  linkJobId?: string;
}
