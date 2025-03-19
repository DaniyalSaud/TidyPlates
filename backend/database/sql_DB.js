import sqlite3 from "sqlite3";

const database = new sqlite3.Database("user.db");

// Creating a simple user table for now, with username, email, and password
database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );
`);

const addUser = database.prepare("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)");

const getUser = database.prepare("SELECT * FROM users WHERE id = ?");
const getUsers = database.prepare("SELECT * FROM users");

const deleteUser = database.prepare("DELETE FROM users WHERE id = ?");

export { addUser, getUser, getUsers, deleteUser };
