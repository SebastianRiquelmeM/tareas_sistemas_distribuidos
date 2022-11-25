## Generar map | reduce en python

## Cómo probar el código que hice

	cat data.txt | python mapper.py | sort -k1,1 | python reducer.py

---

## Cómo correr el contenedor

Para poder levantar el contenedor:

	docker run --name hadoop -p 9864:9864 -p 9870:9870 -p 8088:8088 -p 9000:9000 --hostname sd hadoop

Podemos ver si el contenedor está listo para correr viendo si se levantó la interfaz gráfica de Hadoop:

[Hadoop](http://localhost:9870/dfshealth.html#tab-overview) ó `curl 'http://localhost:9870/dfshealth.html#tab-overview' | grep 'active'`

***Nota**: asegúrese que los puertos que está exponiendo se encuentran libres: **9864**, **9870**, **8088**, **9000***

## Cómo entrar al contenedor

	docker exec -it hadoop bash
	

## Qué hacer antes de levantar código

Hadoop posee su propio sistema de archivos distribuido: *HDFS*. 
Debemos crear algunas carpetas antes de levantar código en Hadoop:

	 hdfs dfs -mkdir /user
     hdfs dfs -mkdir /user/hduser
     hdfs dfs -mkdir input	

Podemos observar que *hdfs* contiene comandos similares al sistema de archivos de UNIX. 
	-mkdir  `crea un directorio`
	 -ls        `lista los archivos de un directorio`
	 -cat     `lista el contenido de un archivo`


Pasamos el input al hdfs;
	`hdfs dfs -put data-text.txt input`

## Cómo levantar código

Hadoop tiene una utilidad llamada  *mapreduce streaming*. Esta utilidad permite crear y correr cualquier ejecutable que sea mapper/reducer.

En este caso, es posible correr mapper y reducer a través de python.  El ejemplo trae  un ejemplo de mapper y reducer para el clásico problema *WordCount*. Hacemos lo siguiente en el directorio donde se encuentran los archivos:

	 mapred streaming -files mapper.py,reducer.py -input /user/hduser/input/*.txt -output /user/hduser/output -mapper ./mapper.py -reducer ./reducer.py

Dado que específicamos que el output se guardara en  `/user/hduser/output`, podemos ver la salida del *Job* :
	`hdfs dfs -cat /user/hduser/output/*`
