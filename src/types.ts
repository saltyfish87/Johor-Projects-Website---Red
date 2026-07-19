export interface Project {
  project_name: string;
  slug: string;
  developer: string;
  area: string;
  state: string;
  address: string;
  coordinate: string; // "lat, lng"
  project_type: string;
  tenure: string;
  land_title: string;
  land_size: string;
  completion_status: string;
  completion_year: string;
  construction_period: string;
  total_units: string;
  total_floors: string;
  units_per_floor: string;
  lift_per_floor: string;
  built_up_min: string;
  built_up_max: string;
  bedrooms: string;
  bathrooms: string;
  layouts: string;
  price_min: string; // e.g. "RM1,200,000"
  price_max: string;
  price_psf: string;
  maintenance_fee: string;
  car_park: string;
  facilities: string;
  nearby: string;
  transportation: string;
  education: string;
  shopping: string;
  hospital: string;
  key_features: string;
  description: string;
  developer_description: string;
  seo_title: string;
  seo_description: string;
  image_url?: string;
  image?: string;
  img?: string;
  drive_image?: string;
  hero_image?: string;
  overview_images?: string[];
  floorplan_images?: string[];
  facilities_images?: string[];
  location_images?: string[];
  progress_images?: string[];
  gallery_images?: string[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectSlug: string;
  projectName: string;
  message: string;
  budget: string;
  targetType: string;
  createdAt: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
  seoTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AreaGuide {
  name: string;
  slug: string;
  rtsDistance: string;
  ciqDistance: string;
  connectivityScore: string; // e.g. "9.8/10"
  averageYield: string; // e.g. "5.2% - 6.5%"
  description: string;
  highlights: string[];
}

export interface DeveloperProfile {
  name: string;
  slug: string;
  description: string;
  established: string;
  awards: string[];
}
