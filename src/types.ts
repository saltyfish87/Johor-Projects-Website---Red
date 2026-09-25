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
  /** Last content revision, e.g. "September 25, 2026" */
  updated?: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
  /** Alt text for the cover photo (which project it shows) */
  imageAlt?: string;
  seoTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Official listing pages this article points to (slugs on jbproperties.my) */
  relatedProjects?: string[];
}

export interface AreaGuide {
  name: string;
  slug: string;
  /** One-line answer to "where is this?" */
  where: string;
  description: string;
  /** Facts only: what is there, from the developer records and OpenStreetMap */
  highlights: string[];
  /** Listed projects in this pocket (slugs on jbproperties.my) */
  projectSlugs: string[];
  updated?: string;
}

export interface DeveloperProfile {
  name: string;
  slug: string;
  /** From the developer record on the project sheet, lightly edited */
  description: string;
  /** Listed Johor Bahru projects (slugs on jbproperties.my) */
  projectSlugs: string[];
  updated?: string;
}
