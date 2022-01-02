require("dotenv").config();

module.exports = {
  production: {
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
      },
  },
};
