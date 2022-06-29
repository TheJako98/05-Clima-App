const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config()

//console.log(process.env);
const main = async() => {
    let opt = 0;
    const Busqueda = new Busquedas();
    
    do{
        opt = await inquirerMenu();
        
        switch(opt){
            case 1:
                // Buscar los lugares
                const lugar = await leerInput("Ingresa un lugar:")
                
                const lugares = await Busqueda.ciudad(lugar);
                const id = await listarLugares(lugares);
                if(id == 0) continue;
                //Seleccionar el lugar
                const lugarsel = lugares.find(l => l.id === id);
                Busqueda.agregarHistorial(lugarsel.nombre);
                
                // Clima
                const clima = await Busqueda.climaLugar(lugarsel.lat, lugarsel.lng); 
                // Mostrar tesultados
                //console.clear();
                console.log(`\nInformación de la ciudad\n`.green);
                console.log('Lugar:',lugarsel.nombre.green);
                console.log('Lat:', lugarsel.lat);
                console.log('Lng:', lugarsel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.tmin);
                console.log('Máxima:', clima.tmax);
                console.log('Día:', clima.desc.yellow, '\n');
                break;
            case 2:
                Busqueda.leerDB();
                Busqueda.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}. `.green;
                    console.log(`${idx} ${lugar}`)
                })
                break;
        }

        if (opt!== 0 ) await pausa();
    }while(opt!==0)

};

main() 
