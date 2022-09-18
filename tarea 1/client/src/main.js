const express = require('express');
const mysql = require('mysql');

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
                            res.send(resultados)
                            //res.send(set_resultados)
                        }
                    }
                }); 
            }
        }

    });
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))