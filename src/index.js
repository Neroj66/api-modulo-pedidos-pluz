const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const routes = require('./api/endPoints')
const cors = require('cors');


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["https://ashy-grass-009f4900f.5.azurestaticapps.net"],
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'] // Asegúrate de permitir encabezados necesarios
}));

app.use('/', routes);

app.get('/',(req, res)=> {
    res.send('Hello! there');
});

app.listen(port, () => {
    console.log(`Corriendo servidor en el puerto ${port}`)
})
