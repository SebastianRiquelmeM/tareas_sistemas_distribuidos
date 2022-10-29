const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs');


var urls = fs.readFileSync('./linksepicos.txt').toString().split("\n");

//var urls = fs.readFileSync('./linksito.txt').toString().split("\n")

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "mariadb",
    user: "root",
    port: 3306,
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

  
for(let i=0; i<urls.length; i++){

    axios(urls[i])
        .then(response => {



            const html = response.data
            const $ = cheerio.load(html)

            var URL = urls[i];
            
            var title = $("title").text();

            var description = $('meta[name=description]').attr('content') == undefined ? $('meta[name=DESCRIPTION]').attr('content') : $('meta[name=description]').attr('content');

            var keywords = $('meta[name=keywords]').attr('content') == undefined ? $('meta[name=KEYWORDS]').attr('content') : $('meta[name=keywords]').attr('content');

            console.log(i, "\n")
            //console.log("URL: ",urls[i],"\n")
            //console.log("TITLE: ",title,"\n")
            //console.log("KEYWORDS: ",keywords,"\n")
            //console.log("DESCRIPTION: ",description, "\n\n\n")

            let arr_keywords

            if(keywords != undefined){
                arr_keywords = keywords.split(",");

                for(let i=0; i<arr_keywords.length; i++){
                    arr_keywords[i] = arr_keywords[i].replace(' ', '');
                    arr_keywords[i] = arr_keywords[i].replace('\n', '');
                }
            }
            
            //console.log(i, "\n")
            //console.log("URL: ", URL,"\n")
            /*
            console.log("TITLE: ",title,"\n")
            console.log("KEYWORDS: ",arr_keywords,"\n")
            console.log("DESCRIPTION: ",description, "\n\n\n")*/

            if(title == undefined){
                title = ""
            }
            if(description == undefined){
                description = ""
            }
            /*if(keywords == undefined){
                keywords = ""
            }
*/
            //var contador = 1;
            
            var sql = `INSERT INTO urls (title, description, URL) VALUES ("${title}", "${description}", "${URL}")`;
            con.query(sql, function (err, result) {

                if (err){
                    //throw err;
                    console.log(err);
                }
                else{ //Si la insercion en urls es correcta
                    if(keywords != undefined){
                          let queryId = `SELECT id FROM urls WHERE URL = "${URL}"`;
                          con.query(queryId, function (err, result) {
                              if (err){
                                console.log(err);
                              }
                              else{
                                  console.log("id: ",result[0].id)
                                  console.log("id: ",result[0].id/389362,"% ")

                                  for(let j=0; j<arr_keywords.length; j++){

                                      let sql2 = `INSERT INTO keywords (id_url, keyword) VALUES ("${result[0].id}", "${arr_keywords[j]}")`;
                                      con.query(sql2, function (err, result) {
                                          if (err){
                                            console.log(err);
                                          }
                                          else{
                                              //console.log('keyword insertada in table keywords')
                                          }
                                      })
          
                                  }
                              }
                          })
                    }
                }

            });


            


        }).catch(err => console.log("error"))
}

/*
con.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
  });
*/