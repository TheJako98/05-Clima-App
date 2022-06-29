const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea haces?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'. green} Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('========================================='.green);
    console.log('\tSeleccione una opción'.yellow);
    console.log('========================================='.green);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;
};

const pausa = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar\n`
        }
    ]
    await inquirer.prompt(question);
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.lenght === 0){
                    return "Ingrese un lugar";
                }
                return true;
            }
        }        
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares = []) => {
    const choices = lugares.map( (lugar, i) => {
        const idx = `${i + 1}`.green;

        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}` 
        }
    });

    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecciona lugar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
};


module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    listarLugares
}

