import { initTables, initStatements } from './models/db.js';
import { addUser, getUserByUsername } from './models/User.js';
import { addUserHealthData } from './models/UserHealth.js';
import { addUserPreference } from './models/UserPreference.js';
import { generateId } from './utils/idGenerator.js';

async function testDatabase() {
  try {
    // Initialize database tables
    console.log('Initializing database tables...');
    await initTables();
    
    // Initialize prepared statements
    console.log('Initializing prepared statements...');
    initStatements();
    
    // Create a new user
    console.log('Creating a test user...');
    const userID = generateId('user');
    
    await new Promise((resolve, reject) => {
      addUser.run(
        userID,
        'testuser',
        'test@example.com',
        'password123',
        '1234567890',
        25,
        'Male',
        70,
        175,
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log(`Created user with ID: ${userID}`);
    
    // Create health data for the user
    await new Promise((resolve, reject) => {
      addUserHealthData.run(
        userID,
        'None',
        'None',
        'None',
        'None',
        'Lose weight',
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('Added health data for user');
    
    // Create preference data for the user
    await new Promise((resolve, reject) => {
      addUserPreference.run(
        userID,
        'Italian',
        'Shellfish',
        'Dinner',
        30,
        'Pasta',
        3,
        JSON.stringify(['8:00', '12:00', '18:00']),
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('Added preference data for user');
    
    // Fetch the user to verify
    await new Promise((resolve, reject) => {
      getUserByUsername.get('testuser', function(err, row) {
        if (err) reject(err);
        else {
          console.log('Retrieved user:');
          console.log(row);
          resolve();
        }
      });
    });
    
    console.log('Database test completed successfully');
    
  } catch (err) {
    console.error('Database test failed:', err);
  }
}

testDatabase();
