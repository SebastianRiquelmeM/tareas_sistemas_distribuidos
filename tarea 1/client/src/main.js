const express = require('express');
const mysql = require('mysql');
//const redis_server = require('./redis_server');

const redis = require('redis');

const redis_client = redis.createClient();

redis_client.on("error", function(error) {
  console.error(error);
});


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

app.use(express.json());

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
        var sql = `SELECT * FROM urls LIMIT 1`;
        con.query(sql, function (err, result) {
    
            if (err){
                //throw err;
                console.log(err);
                //res.send(err);
            }
            else{ //Si la query es correcta
                //res.send(result);
                //callback(null, result);
                //console.log(result)
                /*
                console.log(JSON.stringify(result[0]))
                console.log("id: ",result[0].id)
                console.log("title: ",result[0].title)
                console.log("description: ",result[0].description)
                console.log("url: ",result[0].URL)*/

                let id = result[0].id
                let title = result[0].title
                let description = result[0].description
                let url = result[0].URL
                
                callback(null, {Urls: {id, title, description, url }});
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
    //res.send('Hello World, from express');
    

    //res.send(req.body.keyword)

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
                        //console.log(response[0])
                        //console.log(resultados)
                        //console.log(response[0].id)
                        if(i == result.length-1){
                            //const set_resultados = new set(resultados)
                            let basti = {
                                radiante: "verdadero"
                            }

                            redis_client.sadd(keyword, JSON.stringify(resultados) )

                            
                            
                            redis_client.smembers(keyword, function(err, names){
                                console.log(names); //["John", "Jane"]
                            });

                            res.send(resultados)
                            //res.send(set_resultados)
                        }
                    }
                }); 
            }
        }

    });
});


  


app.get('/grpc', (req, res) => {
      //load Definition into gRPC
  const UrlsService = grpc.loadPackageDefinition(pkgDefs).UrlsService;
  
  //create the Client
  const client = new UrlsService(
    "localhost:5003",
    grpc.credentials.createInsecure()
  );
  
  //make a call to GetUser
  client.GetUrls({}, (error, url) => {
    if (error) {
      console.log(error);
    } else {
      console.log(url);
    }
  });
})
  







/*
app.post('/keyword', (req, res) => {
    //res.send('Hello World, from express');
    

    //res.send(req.body.keyword)

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
                        //console.log(response[0])
                        //console.log(resultados)
                        //console.log(response[0].id)
                        if(i == result.length-1){
                            //const set_resultados = new set(resultados)
                            res.send(resultados)
                            //res.send(set_resultados)
                        }
                    }
                }); 
            }
        }

    });
});*/

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))