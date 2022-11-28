import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

//====================DATABASE===============
const con = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	port: 3306,
	password: "rootpass",
	database: "tarea3",
	connectTimeout: 99999999,
	acquireTimeout: 99999999,
	waitForConnections: true,
	queueLimit: 0,
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected to DB!");
});
//=========================================

const app = express();

app.use(express.json());

//Para leer desde form HTML
app.use(bodyParser.urlencoded({ extended: false }));

//Renderiza login.handlebars en la ruta principal
app.get("/", (req, res) => {
	res.json({
		message: "Bienvenido a la API del proyecto!",
	});
});

app.post("/search", (req, res) => {
	console.log(req.body);
	const palabra = req.body.palabra;

	try {
		var sql = `SELECT * FROM COUNT WHERE palabra='${palabra}'`;
		con.query(sql, function (err, result) {
			if (err) {
				//throw err;
				console.log(err);
				//res.send(err);
			} else {
				//Si la query es correcta
				var result_count = result;
				const id_documento = result_count[0].id_documento;
				try {
					var sql = `SELECT * FROM TITULOS WHERE id=${id_documento}`;
					con.query(sql, function (err, result) {
						if (err) {
							//throw err;
							console.log(err);
							//res.send(err);
						} else {
							//Si la query es correcta

							console.log(result);
							res.json({
								resultados: result,
							});
						}
					});
				} catch (error) {
					callback(error, null);
				}
			}
		});
	} catch (error) {
		callback(error, null);
	}
});

app.listen(3000, () => {
	console.log("Server express-handlebars corriendo en puerto: 3000");
});
