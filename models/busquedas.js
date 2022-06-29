const axios = require('axios');
const fs = require('fs');

class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    get paramsMapbx(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid':process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

    constructor() {
        //TODO: leer DB si existe
        this.leerDB();

    }

    async ciudad(lugar = ''){
        //Peticion HTTP
        console.log('Ciudad:', lugar);
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbx
            });
            const req = await instance.get();
            return req.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            console.log('No se encontraron lugares relacionados con tu busqueda:',lugar, error);
        }
    }

    async climaLugar(lat, lon){
        try{
            // Instancia axios.create
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsOpenWeather
            })
            const req = await instance.get();
            const {weather, main} = req.data;
            //console.log(req.data.main['temp_min']);
            //resp extraer data
            return {
                desc: weather[0].description, //req.data.weather[0].description,
                tmin: main.temp_min, //req.data.main['temp_min'],
                tmax: main.temp_max, //req.data.main['temp_max'],
                temp: main.temp //req.data.main['temp']
            }
        } catch (error){
            console.log("No se pudo obtener el clima del lugar", error);
        }
    }

    agregarHistorial(lugar = ''){
        // TODO: prevenir duplicados
        if (this.historial.indexOf(lugar) === -1){
            this.historial.unshift(lugar);
        }
        this.historial = this.historial.splice(0,5);

        // Grabar en DB
        this.guardaDB();
    }

    guardaDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        // Debe de existir...
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        // Si existe, cargar la informacion readFileSync(path, encoding utf-8)
        const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'});

        const data = JSON.parse(info);
        this.historial = data.historial;
        
    }

}

module.exports = Busquedas;