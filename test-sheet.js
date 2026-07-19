import fetch from 'node-fetch'; // wait, node-fetch might not be in package.json. Let's use native fetch (available in Node 18+)
async function run() {
  try {
    const res = await fetch('https://docs.google.com/spreadsheets/d/1_oL3NH6_trjZQnYnG9pjDnyJ7funxP1uSKehM5Ktv3Q/export?format=csv');
    const text = await res.text();
    const lines = text.split('\n');
    console.log("TOTAL LINES:", lines.length);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().length > 0) {
        // Simple comma split for name
        const firstComma = line.indexOf(',');
        const projectName = firstComma !== -1 ? line.substring(0, firstComma) : line;
        console.log(`Row ${i}: ${projectName}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
run();

