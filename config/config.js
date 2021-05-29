require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALET,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALET,
  },
  production: {
    username: "b1e80fe141ee70",
    password: "95589fe1",
    database: "heroku_c446b8670fec9ad",
    host: "us-cdbr-east-04.cleardb.com",
    dialect: "mysql",
  },
};
