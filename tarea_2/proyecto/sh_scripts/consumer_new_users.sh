#!/usr/bin/env bash

#Este script inicia una terminal como consumer del test-topic
docker exec kafka kafka-topics.sh --describe --bootstrap-server kafka:9092 --topic nuevos-miembros

//Listar topics
docker exec kafka kafka-topics.sh --list --bootstrap-server kafka:9092

//detalles topic
docker exec kafka kafka-topics.sh --describe --bootstrap-server kafka:9092  --topic nuevos-miembros

$ ./bin/kafka-topics.sh --bootstrap-server=localhost:9092 --describe --topic users.registrations




