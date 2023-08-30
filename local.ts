import Database from "libsql-experimental";
require('dotenv').config();

const url = process.env.LIBSQL_URL;
const authToken = process.env.LIBSQL_AUTH_TOKEN

const options = { syncUrl: url, authToken };
const db = new Database("hello.db", options);

db.sync();

async function testRead() {
    const start = performance.now()

    db.prepare("SELECT * FROM users WHERE id = ?").get(Math.floor(Math.random() * 200));

    const time = performance.now() - start;
    return time;
}

async function testWrite() {
    const start = performance.now()

    for (let i = 1; i < 20; i++) {
        db.prepare(`INSERT INTO users (name, email) VALUES ('test_${i}', 'test_${i}@example.com')`).run();
    }

    const time = performance.now() - start;
    return time;
}

async function calculateAverage(func: () => Promise<number>, n: number) {
    const promises: Promise<number>[] = [];
    
    for (let i = 1; i <= n; i++) {
        promises.push(func()); // Replace with your actual async function
    }
    
    const results = await Promise.all(promises);
    
    const sum = results.reduce((acc, value) => acc + value, 0);
    const average = sum / results.length;
    
    return average;
}

console.log("LOCAL-")
calculateAverage(testRead, 20)
    .then(average => {
        console.log(`READ: Average: ${average} ms`);
    })
    .catch(error => {
        console.error(`READ: An error occurred: ${error}`);
    });

calculateAverage(testWrite, 1)
    .then(average => {
        console.log(`WRITE: Average: ${average} ms`);
    })
    .catch(error => {
        console.error(`WRITE: An error occurred: ${error}`);
    });