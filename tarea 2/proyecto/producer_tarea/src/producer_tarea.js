const express = require('express');
const { Kafka } = require('kafkajs');
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: ["kafka:9092"]
});

const producer = kafka.producer();

app.get('/', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer--------\n\n")

    
    console.log("Producer conectando...\n")
    await producer.connect()
    console.log("Producer conectado!\n")    

    

    await producer.send({
        topic: "test-topic",
        //value: JSON.stringify(user)
        messages: [{ value: "Hola desde JS" }]
    })

    console.log("Producer send terminado!")

    res.send("Producer send terminado!")
});

//Registro
app.post('/registro_miembro', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer registro miembro--------\n\n")
    const Nombre=req.body.Nombre
    const Apellido=req.body.Apellido
    const Rut=req.body.Rut
    const Correo=req.body.Correo
    const Patente=req.body.Patente
    const Registro=req.body.Registro

    console.log(req.body)

    if( Registro == "Premium" ){
        console.log("Producer conectando...\n")
        await producer.connect()
        console.log("Producer conectado!\n")    
    
        await producer.send({
            topic: "nuevos-miebros",
            //value: JSON.stringify(user)
            messages: [{ value: req.body, partition: "premium" }]
        })
    }
    else if ( Registro == "Basico" ){
        console.log("Producer conectando...\n")
        await producer.connect()
        console.log("Producer conectado!\n")    
    
        await producer.send({
            topic: "nuevos-miembros",
            //value: JSON.stringify(user)
            messages: [{ value: req.body, partition: "basico" }]
        })
    }

    res.send("Producer send terminado!")
});


// Registro de Venta...
app.post('/registro_venta', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer venta--------\n\n")
    const Cliente=req.body.Cliente
    const CantSopaipillas=req.body.CantSopaipillas
    const Hora=req.body.Hora
    const Stock=req.body.Stock
    const Ubicacion=req.body.Ubicacion

    console.log("\nreq.body: \n",req.body)

    console.log("Producer conectando...\n")
    await producer.connect()
    console.log("Producer conectado!\n")    

    await producer.send({
        topic: "registro-venta",
        //value: JSON.stringify(user)
        messages: [{ value: JSON.stringify(req.body) }]
    })

    res.send("Producer send terminado!")
});

//Aviso Extraño
app.post('/agente_extranio', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer agente extranio-------\n\n")

    const Ubicacion=req.body.Ubicacion

    console.log(req.body)

    res.send("Producer send terminado!")
});


app.listen(3000, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 3000\n");
});