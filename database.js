// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Raj@9026615394",
//     database: "project_database",

//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// async function testConnection() {
//     try {
//         const connection = await pool.getConnection();

//         console.log("✅ MySQL connected successfully");

//         connection.release();

//     } catch (error) {
//         console.error("❌ MySQL connection failed:");
//         console.error(error.message);
//     }
// }

// testConnection();

// module.exports = pool;
require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "project_database",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabase() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL connected successfully");

        connection.release();

    } catch (error) {
        console.error("❌ MySQL connection failed:");
        console.error(error.message);
    }
}

testDatabase();

module.exports = pool;