# Deployment Steps

Currently deployed in Ubuntu 20

# Environment variables that need to be created 

export DB_USER_NAME=BBBBBBBB
export DB_USER_PASS=YYYYYYYY
export DB_HOST=IIIIIIIII
export DB_PORT=3306
export DB_NAME=zekedb
export ENTRY_NAME=test

# Deploy Server 

cd in to server directory

cp ~/subh.babus.net.key .
cp ~/subh.babus.net.crt .

go build -o main . 

nohup ./main &

## Undeploy 

cd in to server directory

netstat -nlp|grep 8080 - Get pid 
kill pid 
rm main
rm nohup.out
rm subh.babus.net.key
rm subh.babus.net.crt

Need to change this to run as a service


# Deploy Client 

PM2 is installed globally 

cd in to client directory

npm i 

Build 

npm run build

pm2 start index.js

## Undeploy 

cd in to client directory

pm2 stop index.js

# Check ports to see if its running and get process id 
netstat -nlp|grep 8080
netstat -nlp|grep 3000

