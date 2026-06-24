document.addEventListener('DOMContentLoaded', () => {
    const movieForm = document.getElementById('movieForm');
    const usernameInput = document.getElementById('username');
    const correoInput = document.getElementById('correo');
    const tituloInput = document.getElementById('titulo');
    const contenidoInput = document.getElementById('contenido');
    const commentsContainer = document.getElementById('commentsContainer');

    cargarComentarios();

    usernameInput.addEventListener('input', () => validarCampoComplejo(usernameInput, 'usernameError'));
    correoInput.addEventListener('change', () => validarCampoComplejo(correoInput, 'correoError'));

    function validarCampoComplejo(input, errorSpanId) {
        const errorSpan = document.getElementById(errorSpanId);
        if (!input.value.trim()) {
            input.className = 'invalid';
            errorSpan.textContent = 'Este campo es obligatorio.';
            return false;
        }
        if (input.id === 'username' && input.value.length < 4) {
            input.className = 'invalid';
            errorSpan.textContent = 'El username debe tener al menos 4 letras.';
            return false;
        }
        if (input.id === 'correo' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            input.className = 'invalid';
            errorSpan.textContent = 'Por favor introduce un correo válido.';
            return false;
        }

        input.className = 'valid';
        errorSpan.textContent = '';
        return true;
    }

    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUserValid = validarCampoComplejo(usernameInput, 'usernameError');
        const isCorreoValid = validarCampoComplejo(correoInput, 'correoError');
        
        let isContenidoValid = true;
        const contenidoError = document.getElementById('contenidoError');
        if (contenidoInput.value.length < 10) {
            contenidoInput.className = 'invalid';
            contenidoError.textContent = 'La reseña debe ser más descriptiva (mínimo 10 caracteres).';
            isContenidoValid = false;
        } else {
            contenidoInput.className = 'valid';
            contenidoError.textContent = '';
        }

        let isTituloValid = true;
        const tituloError = document.getElementById('tituloError');
        if (tituloInput.value.toLowerCase().includes('admin') || tituloInput.value.trim() === '') {
            tituloInput.className = 'invalid';
            tituloError.textContent = 'Título inválido o vacío. No uses la palabra restringida "admin".';
            isTituloValid = false;
        } else {
            tituloInput.className = 'valid';
            tituloError.textContent = '';
        }

        if (isUserValid && isCorreoValid && isContenidoValid && isTituloValid) {
            const dataComentario = {
                username: usernameInput.value,
                correo: correoInput.value,
                titulo: tituloInput.value,
                contenido: contenidoInput.value
            };

            fetch('/comentarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataComentario)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const nuevoElemento = document.createElement('div');
                    nuevoElemento.className = 'resena-card';
                    nuevoElemento.innerHTML = `<h4>${dataComentario.titulo} (por ${dataComentario.username})</h4><p>${dataComentario.contenido}</p>`;
                    
                    commentsContainer.prepend(nuevoElemento);
                    movieForm.reset(); // Limpiar el formulario
                    
                    // Resetear clases visuales
                    usernameInput.className = '';
                    correoInput.className = '';
                    tituloInput.className = '';
                    contenidoInput.className = '';
                }
            })
            .catch(err => console.error('Error al guardar crítica:', err));
        }
    });

    function cargarComentarios() {
        fetch('/comentarios')
            .then(res => res.json())
            .then(comentarios => {
                commentsContainer.innerHTML = '';
                comentarios.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'resena-card';
                    div.innerHTML = `<h4>${c.titulo} (por ${c.username})</h4><p>${c.contenido}</p>`;
                    commentsContainer.appendChild(div);
                });
            });
    }
});