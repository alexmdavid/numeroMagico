const max = 100;
let numeroMagico = Math.floor(Math.random() * max) + 1; // Asegurarse de que el número sea entre 1 y 100
let intentosRestantes;
let intentosUsados = 0;
let mejorJugador = '';
let mejorIntentos = Infinity;
let mejorTiempo = Infinity;
let tiempoInicio, tiempoFin;
let tiempoLimite; // Nuevo valor para almacenar el tiempo límite según la dificultad
let intervaloTiempo; // Variable para el intervalo del temporizador

// Carga el récord guardado
function cargarRecord() {
    const recordGuardado = localStorage.getItem('record');
    if (recordGuardado) {
        const recordData = JSON.parse(recordGuardado);
        mejorJugador = recordData.jugador;
        mejorIntentos = recordData.intentos;
        mejorTiempo = recordData.tiempo;
        document.getElementById('record').textContent = 'El mejor récord es de ' + mejorJugador + ' con ' + mejorIntentos + ' intentos en ' + mejorTiempo + ' segundos.';
    }
}

// Guardar récord
function guardarRecord(jugador, intentos, tiempo) {
    const recordData = {
        jugador: jugador,
        intentos: intentos,
        tiempo: tiempo
    };
    localStorage.setItem('record', JSON.stringify(recordData));
}

// Función para actualizar el contador de tiempo en la página
function iniciarContador() {
    let tiempoRestante = tiempoLimite;
    document.getElementById('contadorTiempo').textContent = tiempoRestante;

    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        document.getElementById('contadorTiempo').textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(intervaloTiempo);
            deshabilitarJuego();
            document.getElementById('valor_intento').textContent = '¡Se acabó el tiempo! El número mágico era ' + numeroMagico + '.';
            document.getElementById('botonReiniciar').style.display = 'block';
        }
    }, 1000);
}

// Registro de usuario y configuración según la dificultad
function registrarUsuario() {
    const nombreInput = document.getElementById('nombre').value.trim();
    const dificultad = document.getElementById('dificultad').value;

    if (nombreInput === '') {
        alert('Por favor, ingrese su nombre.');
        return;
    }

    document.getElementById('nombreJugador').textContent = nombreInput;
    document.getElementById('registro').style.display = 'none';
    document.getElementById('juego').style.display = 'block';

    // Ajustar la dificultad
    switch (dificultad) {
        case 'facil':
            intentosRestantes = 10;
            tiempoLimite = 60;
            break;
        case 'medio':
            intentosRestantes = 7;
            tiempoLimite = 45;
            break;
        case 'dificil':
            intentosRestantes = 5;
            tiempoLimite = 30;
            break;
        default:
            // Por defecto, dificultad fácil
            intentosRestantes = 10;
            tiempoLimite = 60;
            break;
    }

    tiempoInicio = Date.now(); // Iniciar el contador de tiempo
    iniciarContador(); // Iniciar el contador visible
    cargarRecord();
}

// Calcular el tiempo en segundos
function calcularTiempo() {
    tiempoFin = Date.now();
    return ((tiempoFin - tiempoInicio) / 1000).toFixed(2);
}

function pista() {
    const intentoInput = document.getElementById('intento');
    let valorIntento = parseInt(intentoInput.value);

    if (isNaN(valorIntento) || valorIntento < 1 || valorIntento > 100) {
        document.getElementById('valor_intento').textContent = "Por favor, ingrese un número válido entre 1 y 100.";
        return;
    }

    if (intentosRestantes > 0) { // Solo permitir jugar si hay intentos restantes
        intentosRestantes--;
        intentosUsados++;

        if (valorIntento > numeroMagico) {
            document.getElementById('valor_intento').textContent = 'El número mágico es menor. Intentos restantes: ' + intentosRestantes + '.';
        } else if (valorIntento < numeroMagico) {
            document.getElementById('valor_intento').textContent = 'El número mágico es mayor. Intentos restantes: ' + intentosRestantes + '.';
        } else {
            clearInterval(intervaloTiempo); // Detener el temporizador al ganar
            const tiempoUsado = calcularTiempo();
            document.getElementById('valor_intento').textContent = `¡Felicidades! Adivinaste el número en ${intentosUsados} intentos y ${tiempoUsado} segundos.`;
            actualizarRecord(intentosUsados, tiempoUsado);
            deshabilitarJuego();
            document.getElementById('botonReiniciar').style.display = 'block'; // Mostrar botón al ganar
            return;
        }

        if (intentosRestantes === 0) {
            clearInterval(intervaloTiempo); // Detener el temporizador si se acabaron los intentos
            document.getElementById('valor_intento').textContent = '¡Se acabaron los intentos! El número mágico era: ' + numeroMagico + '.';
            deshabilitarJuego();
            document.getElementById('botonReiniciar').style.display = 'block'; // Mostrar botón al perder
        }
    } else {
        document.getElementById('valor_intento').textContent = '¡No te quedan más intentos! El número mágico era: ' + numeroMagico + '.';
    }
}

// Actualizar récord si es necesario
function actualizarRecord(intentos, tiempo) {
    const nombreJugador = document.getElementById('nombreJugador').textContent;
    if (intentos < mejorIntentos || (intentos === mejorIntentos && tiempo < mejorTiempo)) {
        mejorIntentos = intentos;
        mejorTiempo = tiempo;
        mejorJugador = nombreJugador;
        document.getElementById('record').textContent = `El mejor récord es de ${mejorJugador} con ${mejorIntentos} intentos en ${mejorTiempo} segundos.`;
        guardarRecord(mejorJugador, mejorIntentos, mejorTiempo);
    }
}

// Deshabilitar el juego
function deshabilitarJuego() {
    document.getElementById('intento').disabled = true;
    document.getElementById('botonPista').disabled = true;
}

// Reiniciar el juego
function reiniciarJuego() {
    clearInterval(intervaloTiempo); // Detener cualquier temporizador previo
    numeroMagico = Math.floor(Math.random() * max) + 1; // Generar un nuevo número entre 1 y 100
    intentosUsados = 0;
    document.getElementById('valor_intento').textContent = '';
    document.getElementById('intento').value = '';
    document.getElementById('botonReiniciar').style.display = 'none';
    document.getElementById('intento').disabled = false;
    document.getElementById('botonPista').disabled = false;
    
    tiempoInicio = Date.now(); // Reiniciar el tiempo
    iniciarContador(); // Reiniciar el contador visible
}
