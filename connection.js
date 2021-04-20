const Sequelize = require("sequelize");

module.exports = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASS,

  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port:process.env.DB_PORT,

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },

    define: {
      timestamps: false,
    },
  }
);
