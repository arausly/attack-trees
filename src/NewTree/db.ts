import faunadb from "faunadb";

const q = faunadb.query;

const client = new faunadb.Client({
  secret: "fnAEWPH8sDAAQkFkUzmVdCHKdhPzm7zMkbZrIJnD",
  domain: "db.us.fauna.com",
  port: 443,
  scheme: "https",
});

const db = {
  q,
  client,
};
export default db;
