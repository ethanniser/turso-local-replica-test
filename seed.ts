import { createClient } from "@libsql/client";
require('dotenv').config();

const url = process.env.LIBSQL_URL;
const authToken = process.env.LIBSQL_AUTH_TOKEN

const client = createClient({ url, authToken });

for (let i = 1; i < 200; i++) {
    client.execute(`INSERT INTO users (name, email) VALUES ('test_${i}', 'test_${i}@example.com')`);
}


