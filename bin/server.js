require("dotenv").config();
global.Promise = require("bluebird");

const models = require("../src/models");
const app = require("../src/app");
const port = ( process.env.PORT || 5000 );
const http = require("http");

// models.sequelize.sync({
// 	logging: app.get("env") !== "production" && console.log,
// 	force: false
// }).then(() => {
// 	console.log("Successfully migrated and connected to database");
// 	http.createServer(app).listen(port, () => console.log("Server listening in on port", port));
// }).catch((err) => {
// 	console.log("Could not connect to database", err);
// });

// Ben: I removed the lines above so that the site will work without the database.

http.createServer(app).listen(port, () => console.log("Server listening in on port", port));
