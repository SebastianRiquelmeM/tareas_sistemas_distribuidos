const express = require('express');
const mysql = require('mysql');
//const redis_server = require('./redis_server');

const redis = require('redis');

//const redis_client = redis.createClient();

// -------CONFIGURACION DE REDIS EN 3 CLIENTES-------
const redis_client = redis.createClient({
    //url:"redis://redis1"
    url:"redis://172.30.3.4"
});

/*
const redis_client2 = redis.createClient({
    //url:"redis://redis2"
    url:"redis://172.30.3.5"
});

const redis_client3 = redis.createClient({
    //url:"redis://redis3"
    url:"redis://172.30.3.6"
});*/

// -------VALIDACIÓN DE CONEXIÓN DE REDIS EN 3 CLIENTES-------
redis_client.on('ready',()=>{
    console.log("Redis1 listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})
/*
redis_client2.on('ready',()=>{
    console.log("Redis2 listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})

redis_client3.on('ready',()=>{
    console.log("Redis3 listo")
    console.log("-------------------------------------------------------------------------------------------------------------")
})
*/
// -------CONEXIÓN MICROSERVICIOS CLIENTES DE REDIS-------
/*
redis_client.connect()
redis_client2.connect()
redis_client3.connect()*/


console.log('Redis conection: '+redis_client.isOpen);/*
console.log('Redis conection: '+redis_client2.isOpen);
console.log('Redis conection: '+redis_client3.isOpen);*/


const con = mysql.createConnection({
    //host: "172.30.3.3",
    host: "localhost",
    user: "root",
    password: "rootpass",
    database: "distribuidos",
    connectTimeout: 99999999,
    acquireTimeout: 99999999,
    waitForConnections: true,
    queueLimit: 0
  });




con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
});

const app = express();

const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(express.json(),cors(corsOptions));

const port = 3000;  


//-------------------------gRPC--------------------------


//dependencies
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

//path to our proto file
const PROTO_FILE = "./src/service_def.proto";

//options needed for loading Proto file
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };


const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);
//load Definition into gRPC
const userProto = grpc.loadPackageDefinition(pkgDefs);
//create gRPC server
const server = new grpc.Server();

//implement UserService
server.addService(userProto.UrlsService.service, {
  //implment GetUser
  GetUrls: (input, callback) => {
    try {
        var sql = `SELECT * FROM urls LIMIT 10`;
        con.query(sql, function (err, result) {
    
            if (err){
                //throw err;
                console.log(err);
                //res.send(err);
            }
            else{ //Si la query es correcta

                console.log(result)

                callback(null, {Urls: result});
            }
        });
        
    } catch (error) {
      callback(error, null);
    }
  },
});

//start the Server
server.bindAsync(
  //port to serve on
  "127.0.0.1:5003",
  //authentication settings
  grpc.ServerCredentials.createInsecure(),
  //server start callback 
  (error, port) => {
    console.log(`listening on port ${port}`);
    server.start();
  }
);

//-------------------- API --------------------------

app.get('/', (req, res) => {
    //res.send('Hello World, from express');
    var sql = `SELECT * FROM urls LIMIT 100`;
    con.query(sql, function (err, result) {

        if (err){
            //throw err;
            //console.log(err);
            res.send(err);
        }
        else{ //Si la query es correcta
            res.send(result);
        }

    });
});


app.post('/keyword', (req, res) => {

    let keyword = req.body.keyword

    //obtiene los datos recien guardados en redis
    redis_client.smembers(keyword, function(err, response){

        //Si esta en cache, usa Redis
        if(response.length){
            console.log("\n\n ESTA EN CACHE \n\n")
            //console.log(response)
            //console.log(response[0])
            res.send(response[0])
        }
        //No esta en cache, usa gRPC y va a la base de datos
        else{
            console.log("\n\n NO ESTA EN CACHE \n\n")
            let keyword = req.body.keyword
        
            let sql = `SELECT * FROM keywords WHERE keyword like '%${keyword}%'`;
            con.query(sql, function (err, result) {
        
                if (err){
                    //throw err;
                    //console.log(err);
                    res.send(err);
                }
                else{ //Si la query es correcta
                    //res.send(result[0].id_url);
                    //res.send(result.id_url)
                    //res.send(result)
                    
                    const resultados = []
        
                    for( let i=0; i<result.length; i++){
        
                        let id_url = result[i].id_url
                        //console.log(id_url)
                        let sql2 = `SELECT * FROM urls WHERE id = ${id_url}`;
        
                        //console.log(sql2)
        
                        con.query(sql2, function (err, response) {
        
                            if (err){
                                //throw err;
                                //console.log(err);
                                res.send(err);
                            }
                            else{ //Si la query es correcta
                                resultados.push(response[0])

                                if(i == result.length-1){
                                    //const set_resultados = new set(resultados)
        
                                    //guarda datos en redis
                                    redis_client.sadd(keyword, JSON.stringify(resultados) )
        
                                    
                                    //obtiene los datos recien guardados en redis
                                    /*
                                    redis_client.smembers(keyword, function(err, names){
                                        console.log(names); //["John", "Jane"]
                                    });*/
        
                                    res.send(resultados)
                                    //res.send(set_resultados)
                                }
                            }
                        }); 
                    }
                }
        
            });
        }
        
    });
});

app.post('/test', (req, res) => {

    let keyword = req.body.keyword

    //obtiene los datos recien guardados en redis
    redis_client.smembers(keyword, function(err, response){
        
        //Si esta en cache, usa Redis
        if(response.length){
            console.log("\n\n ESTA EN CACHE \n\n")
            //console.log(response)
            //console.log(response[0])
            res.send("cache")
        }
        //No esta en cache, usa gRPC y va a la base de datos
        else{
            console.log("\n\n NO ESTA EN CACHE \n\n")
            let keyword = req.body.keyword
        
            let sql = `SELECT * FROM keywords WHERE keyword like '%${keyword}%'`;
            con.query(sql, function (err, result) {
        
                if (err){
                    //throw err;
                    //console.log(err);
                    res.send(err);
                }
                else{ //Si la query es correcta
                    //res.send(result[0].id_url);
                    //res.send(result.id_url)
                    //res.send(result)
                    
                    const resultados = []
        
                    for( let i=0; i<result.length; i++){
        
                        let id_url = result[i].id_url
                        //console.log(id_url)
                        let sql2 = `SELECT * FROM urls WHERE id = ${id_url}`;
        
                        //console.log(sql2)
        
                        con.query(sql2, function (err, response) {
        
                            if (err){
                                //throw err;
                                //console.log(err);
                                res.send(err);
                            }
                            else{ //Si la query es correcta
                                resultados.push(response[0])

                                if(i == result.length-1){
                                    //const set_resultados = new set(resultados)
        
                                    //guarda datos en redis
                                    redis_client.sadd(keyword, JSON.stringify(resultados) )
        
                                    
                                    //obtiene los datos recien guardados en redis
                                    /*
                                    redis_client.smembers(keyword, function(err, names){
                                        console.log(names); //["John", "Jane"]
                                    });*/
        
                                    res.send("nocache")
                                    //res.send(set_resultados)
                                }
                            }
                        }); 
                    }
                }
        
            });
        }
        
    });

    


});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))