const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017/judge";
const DB_NAME = "onlinejudge";
const DB_URL = MONGO_URL + DB_NAME;

module.exports = { PORT, DB_URL };