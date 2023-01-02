# Deployment Steps

# env variables that need to be exposed 

export DB_USER_NAME=BBBBBBBB
export DB_USER_PASS=YYYYYYYY
export DB_HOST=IIIIIIIII
export DB_PORT=3306
export DB_NAME=zekedb
export ENTRY_NAME=test





# Deploy

nohup go run *go &


# Check ports to get process id 
netstat -nlp|grep 8080
netstat -nlp|grep 3000

