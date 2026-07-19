import { Project } from "../types";

export interface DriveImageMappingResult {
  projectSlug: string;
  projectName: string;
  hero: string | null;
  overview: string[];
  gallery: string[];
  floorplan: string[];
  facilities: string[];
  location: string[];
  progress: string[];
  totalFound: number;
}

/**
 * Helper to convert Google Drive direct links into clean, high-performance,
 * on-the-fly WebP files with specific size scaling.
 */
function getWebpUrl(fileId: string, type: "floorplan" | "hero" | "gallery" | "facilities" | "location" | "progress" | "overview", filename?: string): string {
  const hash = filename ? `#type=${type}&name=${encodeURIComponent(filename)}` : `#type=${type}`;
  if (type === "floorplan") {
    return `https://lh3.googleusercontent.com/d/${fileId}=s0-rw${hash}`;
  }
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600-rw${hash}`;
}

// Hardcoded Google Drive folder IDs from user specifications
const PROJECT_DRIVE_FOLDERS: Record<string, string> = {
  "aethera-residences": "19aqJ3HdCKzwHqwpV1BOXwDfT4EVD_Q_q",
  "causewayz-square-axis-tower-tower-a": "1sySWvaUlkW47FQt_IWIgMgORz6Xx0Vvd",
  "causewayz-square-brixton-tower-tower-b": "1m6_-BrNSRoUCf-bUnqBYzp1CTQD3NRP0",
  "causewayz-square-dover-tower-tower-d": "1mIoLY0UMPFgoSFgRtEBUWv8OPvsA7Sqp",
  "coronade-twins": "1cQiAyFPkUzwBV3fymajINdOEWISNcNTV",
  "m-grand-minori": "1Qvj6oGyYHYxMk45q7yBvgclkWFA1DfDa",
  "princess-cove-rnf-phase-2": "1zQ7E9Fk6USLppH0Et3kM6D41vljAflpQ",
  "princess-cove-rnf-phase-3": "1d5OqAFXMtSZG0muroh6PZFuPFl5yjJVA",
  "gen-sphere": "1bBrwiRgDZd4H8lDmkKfb9x2feHcPLN84"
};

const CAUSEWAYZ_SHARED_FOLDER = "1XboN_O-NebDuhvVk0MQXoekLoOQeDlk1";

/**
 * Searches Google Drive for images related to the projects, matches them by suffix,
 * and updates the project image states.
 */
export async function fetchAndMapDriveImages(
  projects: Project[],
  accessToken: string,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<Project[]> {
  const updatedProjects = [...projects];

  for (let i = 0; i < updatedProjects.length; i++) {
    const project = updatedProjects[i];
    const slug = project.slug;
    
    if (onProgress) {
      onProgress(i, updatedProjects.length, `Scanning Google Drive for ${project.project_name}...`);
    }

    try {
      const foundFiles: { id: string; name: string }[] = [];
      const folderIdsToScan: string[] = [];

      // 1. Check if we have a direct folder mapping
      if (PROJECT_DRIVE_FOLDERS[slug]) {
        folderIdsToScan.push(PROJECT_DRIVE_FOLDERS[slug]);
      }

      // 2. If it's a Causewayz Square project, we ALSO scan the shared folder
      if (slug.includes("causewayz-square")) {
        folderIdsToScan.push(CAUSEWAYZ_SHARED_FOLDER);
      }

      // 3. Scan directories
      for (const folderId of folderIdsToScan) {
        const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            query
          )}&fields=files(id,name)&pageSize=100`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const files = data.files || [];
          files.forEach((file: any) => {
            if (!foundFiles.some((f) => f.id === file.id)) {
              foundFiles.push({ id: file.id, name: file.name });
            }
          });
        } else {
          console.error(`Error scanning folder ${folderId}:`, res.statusText);
        }
      }

      // Fallback: search folder and files by fuzzy name if no direct folder found
      if (foundFiles.length === 0) {
        const cleanProjectName = project.project_name.replace(/'/g, "\\'");
        const fallbackQuery = `mimeType = 'application/vnd.google-apps.folder' and name contains '${cleanProjectName}' and trashed = false`;
        const fallbackRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            fallbackQuery
          )}&fields=files(id,name)`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (fallbackRes.ok) {
          const folderData = await fallbackRes.json();
          const folders = folderData.files || [];

          for (const folder of folders) {
            const filesQuery = `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`;
            const filesRes = await fetch(
              `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
                filesQuery
              )}&fields=files(id,name)&pageSize=100`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (filesRes.ok) {
              const filesData = await filesRes.json();
              const files = filesData.files || [];
              files.forEach((file: any) => {
                if (!foundFiles.some((f) => f.id === file.id)) {
                  foundFiles.push({ id: file.id, name: file.name });
                }
              });
            }
          }
        }
      }

      if (foundFiles.length > 0) {
        // Classify images intelligently based on filename suffixes or content keywords
        let hero: string | null = null;
        const floorplan: string[] = [];
        const facilities: string[] = [];
        const location: string[] = [];
        const gallery: string[] = [];

        foundFiles.forEach((file) => {
          const nameLower = file.name.toLowerCase();
          
          // 1. hero image: 'facade'
          const isHero = nameLower.includes("facade");
          
          // 2. facilities: any image name containing "facilities"
          const isFacilities = nameLower.includes("facilities");
          
          // 3. layouts: only images containing "type", "layout", "floor", "plan", or "pelan" (except if it is a facilities image)
          const isLayout = !isFacilities && (
            nameLower.includes("type") || 
            nameLower.includes("layout") || 
            nameLower.includes("floor") || 
            nameLower.includes("plan") || 
            nameLower.includes("pelan")
          );
          
          // 4. location: 'location', 'map', 'peta'
          const isLocation = nameLower.includes("location") || 
                              nameLower.includes("map") || 
                              nameLower.includes("peta");

          if (isHero) {
            hero = getWebpUrl(file.id, "hero", file.name);
          }
          if (isLayout) {
            floorplan.push(getWebpUrl(file.id, "floorplan", file.name));
          }
          if (isLocation) {
            location.push(getWebpUrl(file.id, "location", file.name));
          }
          if (isFacilities) {
            facilities.push(getWebpUrl(file.id, "facilities", file.name));
          }

          // Visual gallery section image is all images except facilities, location maps, and layout types
          const isExcludedFromGallery = isFacilities || isLayout || isLocation;
          if (!isExcludedFromGallery) {
            gallery.push(getWebpUrl(file.id, "gallery", file.name));
          }
        });

        // Update the project object with classified arrays
        updatedProjects[i] = {
          ...project,
          hero_image: hero || undefined,
          floorplan_images: floorplan.length > 0 ? floorplan : undefined,
          facilities_images: facilities.length > 0 ? facilities : undefined,
          location_images: location.length > 0 ? location : undefined,
          gallery_images: gallery.length > 0 ? gallery : undefined,
          
          // Overwrite standard main preview images if a high-res Drive hero is found
          image_url: hero || project.image_url,
          image: hero || project.image,
          img: hero || project.img,
          drive_image: hero || project.drive_image,
        };
      }
    } catch (error) {
      console.error(`Failed to map Drive images for project ${project.project_name}:`, error);
    }
  }

  // Ensure all Causewayz Square projects share the exact same location images
  const causewayzLocationImages = new Set<string>();
  updatedProjects.forEach((p) => {
    if (p.slug.includes("causewayz-square") && p.location_images) {
      p.location_images.forEach((img) => causewayzLocationImages.add(img));
    }
  });

  if (causewayzLocationImages.size > 0) {
    const combinedLocationImages = Array.from(causewayzLocationImages);
    for (let i = 0; i < updatedProjects.length; i++) {
      if (updatedProjects[i].slug.includes("causewayz-square")) {
        updatedProjects[i] = {
          ...updatedProjects[i],
          location_images: combinedLocationImages,
        };
      }
    }
  }

  if (onProgress) {
    onProgress(updatedProjects.length, updatedProjects.length, "Google Drive image mapping complete!");
  }

  return updatedProjects;
}
