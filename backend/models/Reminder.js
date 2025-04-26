import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

database.exec(
`
    CREATE TABLE IF NOT EXISTS Reminder (
  reminderID INT NOT NULL,
  userID INT NOT NULL,
  reminderText INT NOT NULL,
  timeToRemind INT NOT NULL,
  reminded BOOLEAN NOT NULL,
  PRIMARY KEY (reminderID),
  FOREIGN KEY (userID) REFERENCES User(userID)
);
`
);


export const addReminder = database.prepare(
    `INSERT INTO Reminder (reminderID, userID, reminderText, timeToRemind, reminded)
    VALUES (?, ?, ?, ?, ?);
    `
);

export const deleteReminder = database.prepare(
    `DELETE FROM Reminder WHERE reminderID = ?;
    `
);

export const getAllRemindersByID = database.prepare(
    `SELECT * FROM Reminder WHERE userID = ?;
    `
);
