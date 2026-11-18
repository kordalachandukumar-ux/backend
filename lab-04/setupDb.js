const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const path = require("path");

const dbPath = path.join(__dirname, "users.db");

const initializeDatabase = async () => {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  await db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  const users = [
    { username: "arjun_sharma", name: "Arjun Sharma", password: "arjun_sharma@Pass1" },
    { username: "priya_reddy", name: "Priya Reddy", password: "priya_reddy@Pass1" },
    { username: "rahul_verma", name: "Rahul Verma", password: "rahul_verma@Pass1" },
    { username: "divya_nair", name: "Divya Nair", password: "divya_nair@Pass1" },
    { username: "kiran_babu", name: "Kiran Babu", password: "kiran_babu@Pass1" },
    { username: "sneha_patel", name: "Sneha Patel", password: "sneha_patel@Pass1" },
    { username: "vikram_rao", name: "Vikram Rao", password: "vikram_rao@Pass1" },
    { username: "ananya_iyer", name: "Ananya Iyer", password: "ananya_iyer@Pass1" },
    { username: "suresh_gupta", name: "Suresh Gupta", password: "suresh_gupta@Pass1" },
    { username: "meera_krishna", name: "Meera Krishna", password: "meera_krishna@Pass1" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.run(
      "INSERT OR IGNORE INTO user (username, name, password) VALUES (?, ?, ?)",
      [user.username, user.name, hashedPassword]
    );
  }

  console.log("Database setup complete. 10 users inserted.");
  await db.close();
};

initializeDatabase();
