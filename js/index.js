const max = 100;
let numeroMagico = parseInt(Math.random() * max);
let intentosRestantes = 5;
let intentosUsados = 0;
let mejorJugador = '';
let mejorIntentos = Infinity;

// cargar los datos del récord guardado si existe
function cargarRecord() {
    const recordGuardado = localStorage.getItem('record');
    if (recordGuardado) {
        const recordData = JSON.parse(recordGuardado);
        mejorJugador = recordData.jugador;
        mejorIntentos = recordData.intentos;
        document.getElementById('record').textContent = "El mejor récord es de " + mejorJugador + " con " + mejorIntentos + " intentos.";
    }
}

// guardar los datos del récord en el Local Storage
function guardarRecord(jugador, intentos) {
    const recordData = {
        jugador: jugador,
        intentos: intentos
    };
    localStorage.setItem('record', JSON.stringify(recordData));
}

// registro de usuario y transición entre vistas
function registrarUsuario() {
    const nombreInput = document.getElementById('nombre').value;

    // validar si el nombre está vacío
    if (nombreInput.trim() === '') {
        alert('Por favor, ingrese su nombre.');
        return;
    }

    // mostrar nombre del jugador en la vista de juego
    document.getElementById('nombreJugador').textContent = nombreInput;

    // Ocultar vista de registro y mostrar la vista del juego
    document.getElementById('registro').style.display = 'none';
    document.getElementById('juego').style.display = 'block';

    // cargar el record existente
    cargarRecord();
}

function pista() {
    const intento = document.getElementById('intento');
    let valorIntento = parseInt(intento.value);

    if (isNaN(valorIntento)) {
        document.getElementById('valor_intento').textContent = "Por favor, ingrese un número válido.";
    } else {
        intentosRestantes--;
        intentosUsados++;

        if (valorIntento > numeroMagico) {
            document.getElementById('valor_intento').textContent = "El número mágico es menor. Intentos restantes: " + intentosRestantes;
        } else if (valorIntento < numeroMagico) {
            document.getElementById('valor_intento').textContent = "El número mágico es mayor. Intentos restantes: " + intentosRestantes;
        } else {
            document.getElementById('valor_intento').textContent = "¡Felicidades! Adivinaste el número en " + intentosUsados + " intentos.";
            actualizarRecord(intentosUsados);
            document.getElementById('botonReiniciar').style.display = 'block';
        }

        if (intentosRestantes === 0 && valorIntento !== numeroMagico) {
            document.getElementById('valor_intento').textContent = "¡Se acabaron los intentos! El número mágico era: " + numeroMagico;
            document.getElementById('botonReiniciar').style.display = 'block';
        }
    }
}

// actualiza el record si el jugador lo ha superado
function actualizarRecord(intentos) {
    const nombreJugador = document.getElementById('nombreJugador').textContent;
    if (intentos < mejorIntentos) {
        mejorIntentos = intentos;
        mejorJugador = nombreJugador;
        document.getElementById('record').textContent = "El mejor récord es de " + mejorJugador + " con " + mejorIntentos + " intentos.";

        // guardar el nuevo record en el almacenamiento local
        guardarRecord(mejorJugador, mejorIntentos);
    }
}

function reiniciarJuego() {
    numeroMagico = parseInt(Math.random() * max);
    intentosRestantes = 5;
    intentosUsados = 0;
    document.getElementById('valor_intento').textContent = '';
    document.getElementById('intento').value = '';
    document.getElementById('botonReiniciar').style.display = 'none';
}
