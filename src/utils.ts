/**
 * Converts various Google Drive link formats into a direct image rendering URL.
 * Works with share links like:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 */
export function getDirectDriveImage(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  let fileId = "";
  
  if (trimmed.includes("drive.google.com")) {
    const dMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    } else if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  } else if (trimmed.includes("lh3.googleusercontent.com/d/")) {
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
  }

  if (fileId) {
    const isPlan = trimmed.toLowerCase().includes("plan") || trimmed.toLowerCase().includes("floor") || trimmed.toLowerCase().includes("blueprint");
    return `https://lh3.googleusercontent.com/d/${fileId}${isPlan ? "=s0-rw" : "=w1600-rw"}`;
  }
  
  return trimmed;
}

/**
 * Returns the highest quality cover image for a project, preferring
 * Google Drive synced hero or gallery images over defaults.
 */
export function getProjectCoverImage(project: any): string {
  if (!project) return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";

  // 1. Google Drive mapped hero image
  if (project.hero_image) return project.hero_image;

  // 2. Google Drive mapped gallery image (first image)
  if (project.gallery_images && project.gallery_images.length > 0) {
    return project.gallery_images[0];
  }

  // 3. Fallback to sheet-provided image column
  const sheetImage = project.image_url || project.image || project.img || project.drive_image;
  if (sheetImage) {
    const directUrl = getDirectDriveImage(sheetImage);
    if (directUrl) return directUrl;
  }

  // 4. Default high-contrast premium stock images by project name
  const nameLower = (project.project_name || "").toLowerCase();
  if (nameLower.includes("aethera")) {
    return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
  }
  if (nameLower.includes("causewayz")) {
    return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";
  }
  if (nameLower.includes("coronade")) {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";
  }
  if (nameLower.includes("minori")) {
    return "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80";
  }
  if (nameLower.includes("princess cove")) {
    return "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&w=600&q=80";
  }

  return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";
}

