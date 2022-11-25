#! /bin/zsh
docker rm -f hadoop
echo "contenedor borrado"
docker rmi -f hadoop
echo "imagen borrada"
#Path to the Dockerfile
echo "entro a la carpeta del dockerfile"
cd /home/seba/Desktop/Estudio/Sistemas_distribuidos/Tareas/tarea_3/map-reduce-hadoop/
echo "build de la imagen"
docker build -t hadoop .
echo "Build realizado"
echo "run de la imagen"
docker run -d --name hadoop -p 9864:9864 -p 9870:9870 -p 8088:8088 -p 9000:9000 --hostname sd hadoop
echo "Hadoop running..."
sleep 5
echo "creacion de carpetas en hadoop"
docker exec hadoop hdfs dfs -mkdir /user 
docker exec hadoop hdfs dfs -mkdir /user/hduser
docker exec hadoop hdfs dfs -mkdir input 
echo "carpetas creadas"
setopt +o nomatch
setopt +o nullglob
setopt +o cshnullglob
echo "copiado de archivos a hadoop"
docker exec hadoop hdfs dfs -put examples/Wikipedia/*.txt /user/hduser/input
echo "archivos copiados"
#docker exec hadoop  mapred streaming -files /home/hduser/examples/mapper.py, /home/hduser/examples/reducer.py -input /user/hduser/input/*.txt -output /user/hduser/output -mapper ./mapper.py -reducer ./reducer.py
#echo "ejecucion de map reduce"
#docker exec hadoop hdfs dfs -cat /user/hduser/output/*
#echo "lectura de resultados"
