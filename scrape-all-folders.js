import fs from 'fs';
import path from 'path';

const PROJECT_DRIVE_FOLDERS = {
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

function getWebpUrl(fileId, type) {
  if (type === "floorplan") {
    return `https://lh3.googleusercontent.com/d/${fileId}=s0-rw`;
  }
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600-rw`;
}

async function scrapeFolder(folderId) {
  try {
    console.log(`Scraping folder ${folderId}...`);
    const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const html = await res.text();
    
    // Parse using regex
    const regex = /aria-label="([^"]+)"[^>]+ssk='5:[^:]+:([a-zA-Z0-9_-]{33})/g;
    let match;
    const filesMap = new Map();
    while ((match = regex.exec(html)) !== null) {
      const label = match[1];
      const id = match[2];
      
      // Filter out non-image extensions or system text labels like "Modified 7 Jul"
      if (label.toLowerCase().includes('.jpeg') || label.toLowerCase().includes('.jpg') || label.toLowerCase().includes('.png') || label.toLowerCase().includes('.webp')) {
        // Clean name (e.g. "AETHERA ENTRANCE.jpeg Image Shared" -> "AETHERA ENTRANCE.jpeg")
        let name = label;
        const suffixes = [" Image Shared", " Image", " Shared"];
        for (const suffix of suffixes) {
          if (name.endsWith(suffix)) {
            name = name.substring(0, name.length - suffix.length);
          }
        }
        filesMap.set(id, name);
      }
    }
    
    const files = [];
    filesMap.forEach((name, id) => {
      files.push({ id, name });
    });
    
    console.log(`Successfully found ${files.length} unique image files in ${folderId}`);
    return files;
  } catch (err) {
    console.error(`Error scraping folder ${folderId}:`, err);
    return [];
  }
}

async function main() {
  const finalMappings = {};
  
  // 1. First scrape Causewayz Shared folder
  const sharedFiles = await scrapeFolder(CAUSEWAYZ_SHARED_FOLDER);
  
  // Helper to classify files
  const classifyAndMap = (files, slug) => {
    let hero = null;
    const gallery = [];
    const floorplan = [];
    const facilities = [];
    const location = [];
    
    files.forEach(file => {
      const nameLower = file.name.toLowerCase();
      
      const isHero = nameLower.includes("facade");
      const isLayout = nameLower.includes("type");
      const isLocation = nameLower.includes("location");
      const isFacilities = nameLower.includes("facilities");
      
      const isReserved = isHero || isLayout || isLocation || isFacilities;
      
      if (isHero) {
        hero = getWebpUrl(file.id, "hero");
      } else if (isLayout) {
        floorplan.push(getWebpUrl(file.id, "floorplan"));
      } else if (isLocation) {
        location.push(getWebpUrl(file.id, "location"));
      } else if (isFacilities) {
        facilities.push(getWebpUrl(file.id, "facilities"));
      } else if (!isReserved) {
        gallery.push(getWebpUrl(file.id, "gallery"));
      }
    });
    
    return {
      hero_image: hero,
      gallery_images: gallery,
      floorplan_images: floorplan,
      facilities_images: facilities,
      location_images: location,
      image_url: hero,
      image: hero,
      img: hero,
      drive_image: hero
    };
  };

  // 2. Scrape each project folder
  for (const [slug, folderId] of Object.entries(PROJECT_DRIVE_FOLDERS)) {
    console.log(`\n--- Classifying slug: ${slug} ---`);
    let folderFiles = await scrapeFolder(folderId);
    
    const folderMapping = classifyAndMap(folderFiles, slug);
    
    if (slug.includes("causewayz-square")) {
      // Merge with shared Causewayz files
      const sharedMapping = classifyAndMap(sharedFiles, slug);
      if (!folderMapping.hero_image && sharedMapping.hero_image) {
        folderMapping.hero_image = sharedMapping.hero_image;
        folderMapping.image_url = sharedMapping.hero_image;
        folderMapping.image = sharedMapping.hero_image;
        folderMapping.img = sharedMapping.hero_image;
        folderMapping.drive_image = sharedMapping.hero_image;
      }
      folderMapping.gallery_images = [...folderMapping.gallery_images, ...sharedMapping.gallery_images];
      folderMapping.floorplan_images = [...folderMapping.floorplan_images, ...sharedMapping.floorplan_images];
      folderMapping.facilities_images = [...folderMapping.facilities_images, ...sharedMapping.facilities_images];
      folderMapping.location_images = [...folderMapping.location_images, ...sharedMapping.location_images];
    }
    
    // De-duplicate any arrays
    folderMapping.gallery_images = Array.from(new Set(folderMapping.gallery_images));
    folderMapping.floorplan_images = Array.from(new Set(folderMapping.floorplan_images));
    folderMapping.facilities_images = Array.from(new Set(folderMapping.facilities_images));
    folderMapping.location_images = Array.from(new Set(folderMapping.location_images));
    
    finalMappings[slug] = folderMapping;
  }
  
  fs.writeFileSync('mapped-images.json', JSON.stringify(finalMappings, null, 2), 'utf8');
  console.log("\n==========================================");
  console.log("SUCCESSFULLY GENERATED mapped-images.json!");
  console.log("==========================================");
}

main();
