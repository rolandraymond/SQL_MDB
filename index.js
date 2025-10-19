const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let connectionInfo = null;

app.post("/login", async (req, res) => {
  const { host, user, password } = req.body;
  try {
    const connection = await mysql.createConnection({ host, user, password });
    await connection.end();
    connectionInfo = { host, user, password };
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/databases", async (req, res) => {
  if (!connectionInfo)
    return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await mysql.createConnection(connectionInfo);
    const [rows] = await connection.query("SHOW DATABASES");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.post("/add-database", async (req, res) => {
  const { dbName } = req.body;
  if (!connectionInfo) return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await mysql.createConnection(connectionInfo);
    await connection.query(`CREATE DATABASE \`${dbName}\``);
    await connection.end();
    res.json({ success: true, message: `Database '${dbName}' created successfully.` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


app.post("/add-user", async (req, res) => {
  const { username, password } = req.body;
  if (!connectionInfo) return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await mysql.createConnection(connectionInfo);
    await connection.query(`CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);
    await connection.query(`GRANT ALL PRIVILEGES ON *.* TO '${username}'@'localhost' WITH GRANT OPTION`);
    await connection.end();
    res.json({ success: true, message: `User '${username}' created successfully.` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


app.post("/create-table", async (req, res) => {
  const { dbName, tableName, columns } = req.body; 
  if (!connectionInfo) return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await mysql.createConnection({
      ...connectionInfo,
      database: dbName,
    });
    await connection.query(`CREATE TABLE \`${tableName}\` (${columns})`);
    await connection.end();
    res.json({ success: true, message: `Table '${tableName}' created successfully.` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


app.listen(3000, () =>
  console.log(" Server at http://localhost:3000")
);