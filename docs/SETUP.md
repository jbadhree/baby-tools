# All Notes related to setup goes here.

# DB Setup in Ubuntu Server

created a database named 'zekedb' 

https://devanswers.co/cant-connect-mysql-server-remotely/

This creates a root use that can only be accessed from localhost.

ALTER USER  'root'@'localhost' IDENTIFIED BY 'XXXXXXXXXX';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost'  WITH GRANT OPTION;
FLUSH PRIVILEGES;


created another user with % as host to allow connection from other hosts

CREATE USER 'babuuser'@'%' IDENTIFIED BY 'YYYYYYYY';
GRANT ALL PRIVILEGES ON * . * TO 'babuuser'@'%';
FLUSH PRIVILEGES;

Doc Followed for installation: 


## Tables Created 

create table timer_entries (entry_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, entry_name varchar(25), start_date_time varchar(25), end_date_time varchar(25), insert_date_time datetime , update_date_time datetime);

This makes insert_date_time as current time stamp when entry is made in to table  

ALTER TABLE timer_entries MODIFY insert_date_time datetime DEFAULT CURRENT_TIMESTAMP;

This makes update_date_time as current date time when table is updated 

ALTER TABLE timer_entries MODIFY update_date_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


select * from timer_entries;

# Server Setup 

## PM2 

Needed to install pm2 globally to run react app as background process 


# Go Lang 


https://setapp.com/how-to/use-go-with-mysql

Test Server 

curl -X POST 'http://localhost:8080/test' -d '{"activityName":"Start","activityTime":"2:00:00 AM"}' 

curl -X GET 'http://localhost:8080/current'


curl -X GET 'http://subh.babus.net/latestentries'


TLS for Go Lang 

openssl req  -new  -newkey rsa:2048  -nodes  -keyout subh.babus.net.key  -out subh.babus.net.csr

openssl  x509  -req  -days 365  -in subh.babus.net.csr  -signkey subh.babus.net.key  -out subh.babus.net.crt