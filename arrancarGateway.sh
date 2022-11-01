#!/bin/bash

echo "------------------------------" 
date 

cd /mnt/argus/Desarrollo/graphql/operaciones/services
node ../gateway.js &
ps -ef | grep -v grep | grep "node ./"
date 

echo "------------------------------" 
