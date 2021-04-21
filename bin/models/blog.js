const moment = require("moment-timezone");
const Sequelize = require("sequelize");
const db = require("../../connection");
const blogSchema = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(256),
  },
  description: {
    type: Sequelize.STRING(2048),
  },
  author: {
    type: Sequelize.STRING(256),
  },
  images: {
    type: Sequelize.STRING, 
        get: function() {
            return JSON.parse(this.getDataValue('images'));
        }, 
        set: function(val) {
            return this.setDataValue('images', JSON.stringify(val));
        }
  },
  createdAt: {
    type: Sequelize.STRING(256),
    defaultValue: moment.tz(Date.now(), "Asia/Kolkata").format("DD/MM/YYYY"),
  },
};

module.exports = db.define("Blog", blogSchema,
{
  freezeTableName: true
}
)
