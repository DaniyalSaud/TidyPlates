import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '..', 'tidyplates.db');
const dbWalPath = dbPath + '-wal';
const dbShmPath = dbPath + '-shm';

console.log('Attempting to delete the database files...');

// Delete the database files if they exist
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted ${filePath}`);
    } catch (err) {
      console.error(`Error deleting ${filePath}:`, err);
    }
  } else {
    console.log(`File ${filePath} does not exist, skipping.`);
  }
};

// Delete the database and its journal files
deleteFile(dbPath);
deleteFile(dbWalPath);
deleteFile(dbShmPath);

console.log('Database reset complete. Restart the server to create fresh tables.');