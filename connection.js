const Sequelize = require("sequelize");

module.exports = new Sequelize(
process.env.DATABASE_URL,
  {
    dialect: "postgres",
    dialectOptions:{
      ssl: {
        require: true, 
        rejectUnauthorized: false 
      }
    },
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
