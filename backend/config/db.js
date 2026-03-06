const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({

host: process.env.DB_HOST,

user: process.env.DB_USER,

password: process.env.DB_PASSWORD,

database: process.env.DB_NAME,

port: process.env.DB_PORT,

ssl: { rejectUnauthorized: false }

});

db.connect((err)=>{

if(err){

console.log("DB Error :",err);

return;

}

console.log("Local MySQL Connected Successfully");

});

module.exports = db;


// USERS TABLE

db.query(`
CREATE TABLE IF NOT EXISTS users(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255),  
email VARCHAR(255),
password VARCHAR(255)
);
`);


// CATEGORIES TABLE

db.query(`
CREATE TABLE IF NOT EXISTS categories(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);
`);


// RESOURCES TABLE

db.query(`
CREATE TABLE IF NOT EXISTS resources(
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
description TEXT,
link TEXT,
user_id INT,        
category_id INT
);
`);

console.log("Tables Checked/Created");
