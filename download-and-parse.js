import fs from 'fs';
import path from 'path';

function parseCSV(text) {
  const result = [];
  let row = [];
  let inQuotes = false;
  let currentVal = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      if (row.length > 1 || row[0] !== "") {
        result.push(row);
      }
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  if (currentVal !== "" || row.length > 0) {
    row.push(currentVal.trim());
    result.push(row);
  }
  return result;
}

async function run() {
  try {
    const res = await fetch('https://docs.google.com/spreadsheets/d/1_oL3NH6_trjZQnYnG9pjDnyJ7funxP1uSKehM5Ktv3Q/export?format=csv');
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) {
      throw new Error("No rows found in CSV");
    }
    const headers = rows[0];
    const projects = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) {
        // pad row if shorter
        while (row.length < headers.length) {
          row.push("");
        }
      }
      const project = {};
      headers.forEach((header, index) => {
        let val = row[index] || "";
        // If it starts and ends with brackets or quotes, let's keep it as string or try to parse
        project[header] = val;
      });
      // Generate standard fields like slug
      const slug = (project.project_name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      project.slug = slug;
      projects.push(project);
    }

    const dir = './src/data';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const outputContent = `export interface Project {
  project_name: string;
  slug: string;
  developer: string;
  area: string;
  state: string;
  address: string;
  coordinate: string;
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
  price_min: string;
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
}

export const projectsData: Project[] = ${JSON.stringify(projects, null, 2)};
`;

    fs.writeFileSync(path.join(dir, 'projects-data.ts'), outputContent, 'utf-8');
    console.log("SUCCESSFULLY SAVED projects-data.ts!");
    console.log(`Parsed ${projects.length} projects.`);
  } catch (err) {
    console.error("Error parsing and saving:", err);
  }
}
run();
