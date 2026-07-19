import { Project } from "../types";
import { getAccessToken } from "../firebase-auth";

// Define a map of project slugs to Google Drive folders
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
 * Helper to convert Google Drive direct links into clean, high-performance,
 * on-the-fly WebP files with specific size scaling.
 */
export function getWebpUrl(fileId: string, type: "floorplan" | "hero" | "gallery" | "facilities" | "location" | "progress" | "overview", filename?: string): string {
  // s0-rw: serves the original size with WebP format (excellent for complex floorplans)
  // w1600-rw: scales the image to 1600px width with WebP format (ideal for fast-loading hi-res galleries)
  const hash = filename ? `#type=${type}&name=${encodeURIComponent(filename)}` : `#type=${type}`;
  if (type === "floorplan") {
    return `https://lh3.googleusercontent.com/d/${fileId}=s0-rw${hash}`;
  }
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600-rw${hash}`;
}

/**
 * Parses files in a Google Drive folder and maps them to a project object by suffix/keyword
 */
export async function fetchDriveFolderImages(
  folderId: string,
  accessToken: string
): Promise<{
  hero?: string;
  gallery: string[];
  floorplan: string[];
  facilities: string[];
  location: string[];
}> {
  console.log(`[Drive Sync] Starting scan for Google Drive Folder ID: ${folderId}`);
  
  const images = {
    hero: undefined as string | undefined,
    gallery: [] as string[],
    floorplan: [] as string[],
    facilities: [] as string[],
    location: [] as string[]
  };

  try {
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        query
      )}&fields=files(id,name)&pageSize=100`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok) {
      console.warn(`[Drive Sync] Drive fetch status ${res.status} for folder ${folderId}`);
      return images;
    }

    const data = await res.json();
    const files = data.files || [];
    console.log(`[Drive Sync] Found ${files.length} raw image file(s) inside folder ${folderId}`);

    files.forEach((file: { id: string; name: string }) => {
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
        images.hero = getWebpUrl(file.id, "hero", file.name);
      }
      if (isLayout) {
        images.floorplan.push(getWebpUrl(file.id, "floorplan", file.name));
      }
      if (isLocation) {
        images.location.push(getWebpUrl(file.id, "location", file.name));
      }
      if (isFacilities) {
        images.facilities.push(getWebpUrl(file.id, "facilities", file.name));
      }

      // Visual gallery section image is all images except facilities, location maps, and layout types
      const isExcludedFromGallery = isFacilities || isLayout || isLocation;
      if (!isExcludedFromGallery) {
        images.gallery.push(getWebpUrl(file.id, "gallery", file.name));
      }
    });

    console.log(`[Drive Sync] Folder ${folderId} Mapping Completed:`, {
      hasHero: !!images.hero,
      galleryCount: images.gallery.length,
      floorplanCount: images.floorplan.length,
      facilitiesCount: images.facilities.length,
      locationCount: images.location.length
    });

  } catch (err) {
    console.warn(`[Drive Sync] Warning fetching Google Drive Folder ID: ${folderId}:`, err);
  }

  return images;
}

/**
 * Synchronizes property images from Google Drive folders if a token is available.
 * If no token is available, it retrieves the persisted mappings from local storage.
 */
export async function syncDriveImages(
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  accessToken?: string | null
): Promise<void> {
  const tokenToUse = accessToken || (await getAccessToken());

  if (!tokenToUse) {
    // Attempt local storage load if guest/launch
    try {
      const stored = localStorage.getItem("mapped_drive_images");
      if (stored) {
        const mappings = JSON.parse(stored);
        const merged = projects.map(proj => {
          const mapping = mappings[proj.slug];
          return mapping ? { ...proj, ...mapping } : proj;
        });
        if (JSON.stringify(merged) !== JSON.stringify(projects)) {
          setProjects(merged);
        }
      }
    } catch (e) {
      console.warn("[Drive Sync] Failed to apply stored drive images:", e);
    }
    return;
  }

  try {
    const updated = [...projects];
    const mappingsToCache: Record<string, any> = {};
    let hasChanges = false;

    for (let i = 0; i < updated.length; i++) {
      const project = updated[i];
      const slug = project.slug;
      const folderId = PROJECT_DRIVE_FOLDERS[slug];

      if (!folderId) continue;

      const folderImages = await fetchDriveFolderImages(folderId, tokenToUse);

      // Special handling for Causewayz Square
      if (slug.includes("causewayz-square")) {
        const sharedImages = await fetchDriveFolderImages(CAUSEWAYZ_SHARED_FOLDER, tokenToUse);
        if (sharedImages.hero && !folderImages.hero) {
          folderImages.hero = sharedImages.hero;
        }
        folderImages.gallery = [...folderImages.gallery, ...sharedImages.gallery];
        folderImages.floorplan = [...folderImages.floorplan, ...sharedImages.floorplan];
        folderImages.facilities = [...folderImages.facilities, ...sharedImages.facilities];
        folderImages.location = [...folderImages.location, ...sharedImages.location];
      }

      const hasFoundImages =
        folderImages.hero ||
        folderImages.gallery.length > 0 ||
        folderImages.floorplan.length > 0 ||
        folderImages.facilities.length > 0 ||
        folderImages.location.length > 0;

      if (hasFoundImages) {
        const mapping = {
          hero_image: folderImages.hero || project.hero_image,
          gallery_images: folderImages.gallery.length > 0 ? folderImages.gallery : project.gallery_images,
          floorplan_images: folderImages.floorplan.length > 0 ? folderImages.floorplan : project.floorplan_images,
          facilities_images: folderImages.facilities.length > 0 ? folderImages.facilities : project.facilities_images,
          location_images: folderImages.location.length > 0 ? folderImages.location : project.location_images,
          // Update core project view images with high-res drive hero
          image_url: folderImages.hero || project.image_url,
          image: folderImages.hero || project.image,
          img: folderImages.hero || project.img,
          drive_image: folderImages.hero || project.drive_image,
        };

        updated[i] = {
          ...project,
          ...mapping
        };
        mappingsToCache[slug] = mapping;
        hasChanges = true;
      }
    }

    // Ensure all Causewayz Square projects share the exact same location images
    const causewayzLocationImages = new Set<string>();
    updated.forEach((p) => {
      if (p.slug.includes("causewayz-square") && p.location_images) {
        p.location_images.forEach((img) => causewayzLocationImages.add(img));
      }
    });

    if (causewayzLocationImages.size > 0) {
      const combinedLocationImages = Array.from(causewayzLocationImages);
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].slug.includes("causewayz-square")) {
          updated[i] = {
            ...updated[i],
            location_images: combinedLocationImages,
          };
          if (mappingsToCache[updated[i].slug]) {
            mappingsToCache[updated[i].slug].location_images = combinedLocationImages;
          }
        }
      }
    }

    if (hasChanges) {
      setProjects(updated);
      try {
        localStorage.setItem("mapped_drive_images", JSON.stringify(mappingsToCache));
        
        // Persist back to server DB mapped-images.json
        await fetch("/api/projects/map-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mappings: mappingsToCache })
        });
      } catch (err) {
        console.warn("[Drive Sync] Failed to save sync mappings to server:", err);
      }
    }
  } catch (error) {
    console.warn("[Drive Sync] Error running drive sync fetcher:", error);
  }
}
