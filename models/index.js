const fs = require("fs");
const Sequelize = require("sequelize");
const config = require("./../config/sequelizeConfig");
const models = {};
const sequelizeConnection = new Sequelize(config.development);

fs.readdirSync(__dirname)
.filter(file => file.indexOf(".") !== 0 && file !== "index.js")
.forEach(file => {
    let model = require("./" + file)(sequelizeConnection, Sequelize);
    models[model.name] = model.schema;
});


console.log(models);

//asoccs
models.Post.belongsTo(models.User);
models.User.hasMany(models.Post);

module.exports = models;
module.exports = sequelizeConnection;



