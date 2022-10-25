#!/usr/bin/env bash

#Este script inicia una terminal como prodcuer del test-topic
docker exec kafka kafka-console-producer.sh --broker-list  kafka:9092 --topic test-topic