const express = require('express');
const { Kafka } = require('kafkajs');
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

//Conexion a kafka
const kafka = new Kafka({
    brokers: ["kafka:9092"] 
});



app.get('/consumer_registro_miembro', async (req, res) => {
    console.log("\n\n\n-------Mensaje consumer-------\n\n\n")

    console.log("Iniciando objeto consumer...\n")
    const consumer = kafka.consumer({ groupId: 'nuevos-miembros-consumer'/* , fromBeginning: true */ });
    console.log("Consumer iniciado!\n")
    console.log("Conectando a consumer...\n")
    
    await consumer.connect();
    console.log("Consumer conectado!\n")
    console.log("Suscribiendose al topic...\n")

    await consumer.subscribe({ topic: 'nuevos-miembros', fromBeginning: true });
    console.log("Suscrito al topic!\n")
    console.log("Ejecutando consumer run...\n")
    await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("\n\nTOPIC: ", topic,"\n\n")
                console.log("\n\npartition: ", partition,"\n\n")
                console.log("Voy a imprimir los datos: \n")


                let data = JSON.parse(message.value.toString());
                console.log("\nMESSAGE:VALUE: ", data.Cliente,"\n")

                //let data = JSON.parse(message.value)    ;
                //console.log(data)
            }   
    })  

    console.log("Consumer terminado!")

    res.send("Consumer terminado!")
});



app.listen(3001, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3001\n");
});