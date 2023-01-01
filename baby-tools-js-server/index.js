const express = require('express');
const bodyParser = require('body-parser');

const PORT = 4001;

const app = express();

app.use(bodyParser.json());

app.post('/status', async (req, res) =>{
    console.log("In Status")
    console.log(req.body);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send("HW");
});


app.listen(PORT, () => {
    console.log(`Server Listening in Port ${PORT}`);
});

