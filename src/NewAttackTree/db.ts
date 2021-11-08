import faunadb from "faunadb";

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_API_SECRET!,
  domain: "db.us.fauna.com",
  port: 443,
  scheme: "https",
});

const db = {
  q,
  client,
};
export default db;
