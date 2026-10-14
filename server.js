const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const server = express();
server.use(express.json());

const productroute = require("./route/product.route.js"); 
const PORT = process.env.PORT || 5000
console.log("DEBUG productroute is:", productroute);
// const mongoose = require("mongoose"); 

server.use("/api/products", productroute);
server.listen(PORT,() =>{
    connectDB();
    console.log("server is started at http://localhost:" + PORT);
});
//Uxk4RqGkBqRNSPre