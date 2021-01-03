#!/bin/bash

echo "------------------------------" 
date 

cd /mnt/argus/Desarrollo/graphql/operaciones/services
node ./instrumentos/index.js &
node ./operaciones/index.js &
node ./flujos/index.js &
node ./productos/index.js &
node ../gateway.js &
h "node ./"
date 

echo "------------------------------" 
