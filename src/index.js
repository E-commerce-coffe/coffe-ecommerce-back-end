const express = require("express");
const path = require("path");
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const workUsuarios= require('./routers/routerUsuarios');
app.use('/users',workUsuarios);

//config
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('Funciona en puerto: ', app.get('port'));
});