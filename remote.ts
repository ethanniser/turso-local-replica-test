import { createClient } from "@libsql/client";
require("dotenv").config();

const url = process.env.LIBSQL_URL;
const authToken = process.env.LIBSQL_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Environment variables missing");
}

const client = createClient({ url, authToken });

async function testRead() {
  const start = performance.now();

  await client.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [Math.floor(Math.random() * 200) + 1],
  });

  const time = performance.now() - start;
  return time;
}

async function testWrite() {
  const start = performance.now();

  await client.execute(
    `INSERT INTO users (name, email) VALUES ('test_${Math.random()}', 'test_${Math.random()}@example.com')`
  );

  const time = performance.now() - start;
  return time;
}

async function calculateAverage(func: () => Promise<number>, n: number) {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    const time = await func();
    sum += time;
  }

  const average = sum / n;
  return average;
}

console.log("REMOTE-");
calculateAverage(testRead, 10)
  .then((average) => {
    console.log(`READ: Average: ${average} ms`);
  })
  .catch((error) => {
    console.error(`READ: An error occurred: ${error}`);
  });

calculateAverage(testWrite, 10)
  .then((average) => {
    console.log(`WRITE: Average: ${average} ms`);
  })
  .catch((error) => {
    console.error(`WRITE: An error occurred: ${error}`);
  });
