const axios = require('axios').default;
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

var sql = `SELECT id,keyword from keywords LIMIT 1000`;

con.query(sql, function (err, result) {

    if (err){
        //throw err;
        console.log(err);
    }
    else{ //Si la query es correcta

        //console.log(result)
        var nocache = 0;
        var cache = 0;

        //console.log(Date.now())

        let inicio = 0
        let final = 0

        let tiempoTotal = 0

        for(let i=0; i<result.length; i++){

            let keyword = result[i].keyword

            inicio = Date.now()
            axios.post('http://localhost:3000/test', 
            {
                "keyword": keyword
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
            )
            .then(function (response) {

                /*
                //console.log(response.data)
                if(response.data == "cache" || response.data == "no cache"){
                    var sql = `select cache, nocache, tiempo from test_cache`;
                    con.query(sql, function (err, result) {
                
                        if (err){
                            //throw err;
                            console.log(err);
                            //res.send(err);
                        }
                        else{ //Si la query es correcta
                            //console.log(result[0].cache)
                            let cache_actual = result[0].cache
                            let nocache_actual = result[0].nocache
                            //console.log(response)
                            if(response.data == "cache"){
                                console.log("no cache")
                                cache_actual ++
                                sql = `UPDATE test_cache SET cache = ${cache_actual}`;
                                con.query(sql, function (err, result) {
                
                                    if (err){
                                        console.log(err);
                                    }
                                    else{ 
                                        
                                    }
                            
                                });
    
                            }
                            else if(response.data == "nocache"){
                                console.log("no cache")
                                nocache_actual ++
                                sql = `UPDATE test_cache SET nocache = ${nocache_actual}`;
                                con.query(sql, function (err, result) {
                
                                    if (err){
                                        console.log(err);
                                    }
                                    else{ 
                                        
                                    }
                            
                                });
                            }
                        }
                
                    });
                }*/

            })
            .catch(function (error) {
                console.log(error);
            });

            final = Date.now()

            tiempoTotal += final-inicio
/*
            if(respuesta == "cache"){
                cache++
            }
            else if(respuesta== "nocache"){
                nocache++
            }*/
       }
       console.log("Tiempo total: ", tiempoTotal, "ms ")
       console.log("Cantidad de consultas: ", result.length)
       //console.log(cache)
    }

});

/*
axios.post('http://localhost:3000/keyword', 
{
    "keyword": "ghost"
},
{
    headers: { 'Content-Type': 'application/json' },
}
)
.then(function (response) {
console.log(response.data)
})
.catch(function (error) {
console.log(error);
});*/