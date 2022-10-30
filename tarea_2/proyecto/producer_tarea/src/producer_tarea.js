const e = require("express");
const express = require("express");
const { Kafka } = require("kafkajs");
//const cors = require('cors');
const app = express();
const mysql = require("mysql");

//app.use(cors());
app.use(express.json());

const kafka = new Kafka({
	brokers: ["kafka:9092"],
});

const producer = kafka.producer();

const con = mysql.createConnection({
	//host: "172.30.3.3",
	host: "distribuidos-mariadb",
	// PONER PUERTO(?)
	user: "root",
	password: "rootpass",
	database: "distribuidos",
	connectTimeout: 99999999,
	acquireTimeout: 99999999,
	waitForConnections: true,
	queueLimit: 0,
});

//Registro
app.post("/registro_miembro", async (req, res) => {
	console.log("\n\n\n-------Mensaje producer registro miembro--------\n\n");
	const Nombre = req.body.Nombre;
	const Apellido = req.body.Apellido;
	const Rut = req.body.Rut;
	const Correo = req.body.Correo;
	const Patente = req.body.Patente;
	const Registro = req.body.Registro;

	console.log(req.body);

	if (Registro == "Premium") {
		console.log("\n Usuario Premium recibido...\n");

		console.log("Producer conectando...\n");
		await producer.connect();
		console.log("Producer conectado!\n");

		await producer.send({
			topic: "nuevos-miembros",
			//value: JSON.stringify(user)
			messages: [{ value: JSON.stringify(req.body), partition: 0 }],
		});
	} else if (Registro == "Basico") {
		console.log("\n Usuario Basico recibido...\n");
		console.log("Producer conectando...\n");
		await producer.connect();
		console.log("Producer conectado!\n");

		await producer.send({
			topic: "nuevos-miembros",
			//value: JSON.stringify(user)
			messages: [{ value: JSON.stringify(req.body), partition: 1 }],
		});
	}

	res.send("Producer send terminado!");
});

// Registro de Venta...
app.post("/registro_venta", async (req, res) => {
	console.log("\n\n\n-------Mensaje producer venta--------\n\n");
	const Patente = req.body.Patente;
	const Cliente = req.body.Cliente;
	const CantSopaipillas = req.body.CantSopaipillas;
	const Hora = req.body.Hora;
	const Stock = req.body.Stock;
	//const Ubicacion=req.body.Ubicacion

	// bastyrex

	//CONSULTAR UBICACION ACTUAL A LA DB

	// juegue
	try {
		let sql = `SELECT * FROM coordenadas where id_patente="${Patente}" ORDER BY id DESC LIMIT 1`;

		con.query(sql, async function (err, result) {
			if (err) {
				console.log(err);
			} else {
				try {
					let sql = `SELECT stock_restante FROM ventas WHERE id_patente="${Patente}"  ORDER BY id DESC LIMIT 1`;
					let coo_x = result[0].coordenada_x;
					let coo_y = result[0].coordenada_y;
					con.query(sql, async function (err, result) {
						if (err) {
							console.log(err);
						} else {
							//Si la query es correcta
							let Stock_restante = 200;

							if (result.length != 0) {
								console.log(
									"el stock restante   es: ",
									result[0].stock_restante
								);
								Stock_restante = result[0].stock_restante;
								let Resta = Stock_restante - CantSopaipillas;
								if (Resta < 20) {
									Stock_restante = 200;
								} else {
									Stock_restante = Resta;
								}
							}

							//Si la query es correcta

							//const ubi = [coo_x, coo_y];

							let date_ob = new Date();
							let day = ("0" + date_ob.getDate()).slice(-2);
							let month = ("0" + (date_ob.getMonth() + 1)).slice(
								-2
							);
							let year = date_ob.getFullYear();

							let hours = date_ob.getHours();
							let minutes = date_ob.getMinutes();
							let seconds = date_ob.getSeconds();

							let dateTime =
								year +
								"-" +
								month +
								"-" +
								day +
								" " +
								hours +
								":" +
								minutes +
								":" +
								seconds;
							console.log(dateTime);

							const venta = {
								Patente: Patente,
								Cliente: Cliente,
								CantSopaipillas: CantSopaipillas,
								Hora: dateTime,
								Stock: Stock_restante,
								coordenada_x: coo_x,
								coordenada_y: coo_y,
							};
							console.log("\nreq.body: \n", req.body);

							console.log("\nventa: \n", venta);

							//Manda al topic registro-venta
							console.log("Producer conectando...\n");
							await producer.connect();
							console.log("Producer conectado!\n");

							await producer.send({
								topic: "registro-venta",
								//value: JSON.stringify(user)
								messages: [{ value: JSON.stringify(venta) }],
							});

							console.log(result);
						}
					});
				} catch (error) {
					console.log(error);
				}
			}
		});
	} catch (error) {
		console.log(error);
	}

	res.send("Producer send terminado!");
});

app.post("/ubicacion", async (req, res) => {
	console.log("\n\n\n-------Mensaje producer ubicacion-------\n\n");
	console.log("\nreq.body: \n", req.body);
	const Ubicacion = req.body.Ubicacion;

	//console.log("Producer conectando...\n")
	await producer.connect();
	//console.log("Producer conectado!\n")

	await producer.send({
		topic: "coordenadas",
		//value: JSON.stringify(user)
		messages: [{ value: JSON.stringify(req.body), partition: 0 }],
	});

	res.send("Producer send terminado!");
});

//Aviso Extraño
app.post("/agente_extranio", async (req, res) => {
	console.log("\n\n\n-------Mensaje producer agente extranio-------\n\n");

	const Ubicacion = req.body.Ubicacion;
	console.log("\nreq.body: \n", req.body);

	console.log("Producer conectando...\n");
	await producer.connect();
	console.log("Producer conectado!\n");

	await producer.send({
		topic: "coordenadas",
		//value: JSON.stringify(user)
		messages: [{ value: JSON.stringify(req.body), partition: 1 }],
	});

	

	res.send("Producer send terminado!");
});

app.listen(3000, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 3000\n");
});
