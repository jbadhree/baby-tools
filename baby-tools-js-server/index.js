const express = require('express');
const bodyParser = require('body-parser');

const PORT = 4001;

const app = express();

app.use(bodyParser.json());

app.get('/status', async (req, res) =>{
    res.send("HW");
});


app.listen(PORT, () => {
    console.log(`Server Listening in Port ${PORT}`);
});

