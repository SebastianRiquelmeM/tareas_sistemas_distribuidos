import mysql.connector

mydb = mysql.connector.connect(
  host="127.0.01",
  user="root",
  passwd="rootpass",
  database="tarea3"
)
mycursor = mydb.cursor()

for renglon in open ('/home/seba/Escritorio/Estudio/sistemas_distribuidos/tareas/tarea_3/meter_a_db/titulos_y_links/titulos.txt'):
    partes = renglon.split()
    #print(partes)
    print(partes[0])
    print(partes[2])
    id_texto = partes[0]
    titulo = partes[1]
    link = partes[2]


    sql = "INSERT INTO tarea3.TITULOS(id,titulo,link)VALUES(%s,%s,%s)"
    val = (id_texto,titulo,link)
    mycursor.execute(sql,val)
    mydb.commit()
    print(mycursor.rowcount,"se inserto (ojala xd)")