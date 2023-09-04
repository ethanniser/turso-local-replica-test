import { createClient } from "@libsql/client";
require("dotenv").config();

const url = process.env.LIBSQL_URL;
const authToken = process.env.LIBSQL_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Environment variables missing");
}

const client = createClient({ url, authToken });

async function seedDatabase() {
  // Destroy the existing table if it exists
  await client.execute(`DROP TABLE IF EXISTS users`);

  // Create the table
  await client.execute(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `);

  // Assemble 200 insert statements into an array of strings
  const insertStatements: string[] = [];

  for (let i = 1; i <= 200; i++) {
    const sql = `INSERT INTO users (name, email) VALUES ('test_${i}', 'test_${i}@example.com')`;
    insertStatements.push(sql);
  }

  // Execute batch insert
  await client.batch(insertStatements);
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("Database seeded successfully.");
  })
  .catch((error) => {
    console.error(`An error occurred while seeding the database: ${error}`);
  });
