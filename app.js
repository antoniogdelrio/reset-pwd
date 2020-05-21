const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const resetPWD = require('./reset');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

app.post('/reset', (req, res) => {
    const cpf = req.body.cpf;
    const bd = req.body.bd;
    const newPWD = req.body.pwd;

    resetPWD(cpf, bd, newPWD)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        })
})

app.listen(80, ()=>{
    console.log("Express server working");
})