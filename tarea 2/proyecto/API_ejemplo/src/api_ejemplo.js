const express = require('express');

const app = express();

//app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("API funcionando")
    res.send("API funcionando!")
});

app.post('/formulario', (req, res) => {
    console.log("API funcionando")

    console.log("API recibió: ",req.body.nombre)
    res.status(200).json({ success: true });
    //res.send("API recibió: ", req.body)
});


app.listen(3001, () => {
	console.log("\nServer corriendo en puerto: 3001\n");
});