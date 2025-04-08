import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

// Creating a simple user table for now, with username, email, and password
database.exec(`
    CREATE TABLE IF NOT EXISTS User (
  userID INT NOT NULL,
  username VARCHAR,
  emailAddress VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  phoneNumber VARCHAR,
  age INT NOT NULL,
  gender VARCHAR NOT NULL,
  weight INT NOT NULL,
  height INT NOT NULL,
  PRIMARY KEY (userID, username)
);
`);

const addUser = database.prepare(`INSERT INTO User (userID, username, emailAddress, password, phoneNumber, age, gender, weight, height)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`);

const getUserByID = database.prepare("SELECT * FROM User WHERE userID = ?;");
const getUserByUsername = database.prepare("SELECT * FROM User WHERE username = ?;");
const getUserByEmail = database.prepare("SELECT * FROM User WHERE emailAddress = ? AND password = ?;");
const getUsers = database.prepare("SELECT * FROM User;");

const deleteUser = database.prepare("DELETE FROM User WHERE userID = ?;");

export { addUser, getUserByUsername, getUserByEmail, getUserByID, getUsers, deleteUser };
