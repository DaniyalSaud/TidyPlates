import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the counter storage file
const counterFilePath = path.join(__dirname, '..', 'data', 'id_counters.json');

// Make sure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ID counter storage
let counters = {
  user: 1000,       // Start user IDs at 1000
  mealPlan: 3000,   // Start meal plan IDs at 3000  
  meal: 5000,       // Start meal IDs at 5000
  recipe: 7000,     // Start recipe IDs at 7000
  reminder: 9000    // Start reminder IDs at 9000
};

// Load existing counters if available
try {
  if (fs.existsSync(counterFilePath)) {
    const data = fs.readFileSync(counterFilePath, 'utf8');
    counters = JSON.parse(data);
    console.log('Loaded ID counters:', counters);
  } else {
    // Initialize the counter file
    fs.writeFileSync(counterFilePath, JSON.stringify(counters, null, 2));
    console.log('Created new ID counters file');
  }
} catch (error) {
  console.error('Error loading ID counters:', error);
}

/**
 * Save the current counter values to the file
 */
function saveCounters() {
  try {
    fs.writeFileSync(counterFilePath, JSON.stringify(counters, null, 2));
  } catch (error) {
    console.error('Error saving ID counters:', error);
  }
}

/**
 * Generate a unique ID for a specific entity type
 * @param {string} type - The type of entity ('user', 'mealPlan', 'meal', 'recipe', 'reminder')
 * @returns {number} A unique ID
 */
export function generateId(type) {
  if (!counters[type]) {
    throw new Error(`Unknown entity type: ${type}`);
  }
  
  // Increment the counter and get the new ID
  counters[type] += 1;
  const id = counters[type];
  
  // Save the updated counters
  saveCounters();
  
  return id;
}

/**
 * Generate a batch of unique IDs for a specific entity type
 * @param {string} type - The type of entity ('user', 'mealPlan', 'meal', 'recipe', 'reminder')
 * @param {number} count - How many IDs to generate
 * @returns {number[]} An array of unique IDs
 */
export function generateBatchIds(type, count) {
  if (!counters[type]) {
    throw new Error(`Unknown entity type: ${type}`);
  }
  
  const ids = [];
  for (let i = 0; i < count; i++) {
    counters[type] += 1;
    ids.push(counters[type]);
  }
  
  // Save the updated counters
  saveCounters();
  
  return ids;
}