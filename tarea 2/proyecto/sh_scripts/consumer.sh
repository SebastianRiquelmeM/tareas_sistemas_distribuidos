#!/usr/bin/env bash

#Este script inicia una terminal como consumer del test-topic
docker exec kafka kafka-console-consumer.sh --bootstrap-server  kafka:9092 --topic test-topic --from-beginning
