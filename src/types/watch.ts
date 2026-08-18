export type WatchStatus = 'Available' | 'Reserved' | 'Sold';

export type MovementType = 'Automatic' | 'Manual Wind' | 'Quartz' | 'Solar';

export type Category = 'Automatic' | 'Chronograph' | 'Dress' | 'Quartz' | 'Bangle';

export interface Watch {
  id: string;
  brand: string;
  model: string;
  reference: string | null;
  caliber: string | null;
  movement_type: string | null;
  era: string | null;
  year: number | null;
  case_size_mm: number | null;
  lug_width_mm: number | null;
  price: number;
  condition_rating: number | null;
  status: WatchStatus;
  category: string | null;
  primary_image: string | null;
  gallery: string[] | null;
  service_history: string | null;
  authenticity_notes: string | null;
  timekeeping_accuracy: string | null;
  description: string | null;
  created_at: string;
}

export interface WatchSubmission {
  id?: string;
  brand: string;
  model: string;
  asking_price: number | null;
  photo_urls: string | null;
  contact_name: string | null;
  contact_email: string | null;
  notes: string | null;
  status?: string;
  created_at?: string;
}
