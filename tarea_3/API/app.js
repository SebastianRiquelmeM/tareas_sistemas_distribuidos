const express = require("express");
const mysql = require("mysql");

const con = mysql.createConnection({
	host: "mariadb",
	user: "root",
	port: 3306,
	password: "rootpass",
	database: "distribuidos",
	connectTimeout: 99999999,
	acquireTimeout: 99999999,
	waitForConnections: true,
	queueLimit: 0,
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected to DB!");
});

const app = express();

app.use(express.json());

//ruta que recibe una palabra y la busca en la base de datos
app.get("/api/word/:word", (req, res) => {
     const word = req.params.word;
     con.query(`SELECT * FROM words WHERE word = '${word}'`, function (err, result, fields) {
          if (err) throw err;
          res.send(result);
     });
});


app.listen(3000, () => {
	console.log("\nServer running on port 3000\n");
});
