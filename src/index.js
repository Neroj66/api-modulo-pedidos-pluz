const express = require('express')
const app = express()
const port = 4001
const routes = require('./api/endPoints')
const cors = require('cors');


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://10.155.241.37:4000"],
    methods: ["GET", "POST","PUT","DELETE"]
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Corriendo servidor en el puerto ${port}`)
})