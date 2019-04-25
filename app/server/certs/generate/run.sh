#!/usr/bin/env bash

openssl genrsa -out ../rootCA.key 2048
openssl req -x509 -new -nodes -key ../rootCA.key -sha256 -days 1024 -out ../rootCA.pem -config <(cat server.csr.cnf)
openssl req -new -sha256 -nodes -out ../server.csr -newkey rsa:2048 -keyout ../server.key -config <(cat server.csr.cnf)
openssl x509 -req -in ../server.csr -CA ../rootCA.pem -CAkey ../rootCA.key -CAcreateserial -CAserial ../.srl -out ../server.crt -days 500 -sha256 -extfile v3.ext.txt
