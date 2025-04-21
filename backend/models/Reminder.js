import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

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
)


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
