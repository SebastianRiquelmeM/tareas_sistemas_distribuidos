import mysql.connector


mydb = mysql.connector.connect(
  host="127.0.0.1",
  user="root",
  passwd="rootpass",
  database="tarea3"
)
mycursor = mydb.cursor()

for renglon in open ('/home/seba/Escritorio/Estudio/sistemas_distribuidos/tareas/tarea_3/meter_a_db/output_hadoop/output1.txt'):
    partes = renglon.split()
    #print(partes)
    #print(partes[0])
    print(partes[2][0])

    id_documento = partes[2][0]
    palabra = partes[0]
    contador = partes[1]
    sql = "INSERT INTO tarea3.COUNT(id_documento,palabra,contador)VALUES(%s,%s,%s)"
    val = (id_documento,palabra,contador)
    mycursor.execute(sql,val)
    mydb.commit()
    print(mycursor.rowcount,"se inserto (ojala xd)")