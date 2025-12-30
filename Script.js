
let restaurantReservations = JSON.parse(localStorage.getItem('restaurantReservations')) || [];

// ========== FUNCIONES GENERALES ==========

function mostrarAlerta(mensaje) {
    alert(mensaje);
}

function scrollSuave(targetId) {
    if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
}

function actualizarAñoFooter() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ========== FUNCIONES MODAL DE PLATOS GASTRONOMÍA ==========

function openDishModal(button) {
    const galleryItem = button.closest('.gallery-item');
    const dishName = galleryItem.getAttribute('data-name');
    const dishDescription = galleryItem.getAttribute('data-description');
    
    document.getElementById('dishName').textContent = dishName;
    document.getElementById('dishDescription').textContent = dishDescription;
    
    const dishModal = document.getElementById('dishModal');
    dishModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDishModal() {
    const dishModal = document.getElementById('dishModal');
    dishModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
    const dishModal = document.getElementById('dishModal');
    if (dishModal) {
        dishModal.addEventListener('click', function(e) {
            if (e.target === dishModal) {
                closeDishModal();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dishModal.classList.contains('active')) {
                closeDishModal();
            }
        });
    }
});

// ========== FUNCIONES DE RESERVAS GASTRONOMÍA ==========

function actualizarDisplayReservas() {
    const reservationsBody = document.getElementById('reservationsBody');
    const noReservationsRow = document.getElementById('noReservationsRow');
    
    if (!reservationsBody) return;
    
    // Limpiar tabla
    reservationsBody.innerHTML = '';
    
    if (restaurantReservations.length === 0) {
        if (noReservationsRow) {
            reservationsBody.appendChild(noReservationsRow);
            noReservationsRow.style.display = '';
        }
    } else {
        if (noReservationsRow) {
            noReservationsRow.style.display = 'none';
        }
        
        // Ordenar reservas por fecha (más recientes primero)
        restaurantReservations.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        
        // Agregar cada reserva a la tabla
        restaurantReservations.forEach(reservation => {
            const row = document.createElement('tr');
            
            // Formatear fecha para mostrar
            const fechaObj = new Date(reservation.fecha);
            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            // Nombre del restaurante
            const restauranteNombres = {
                'tradicional': 'Comida Tradicional',
                'fusion': 'Fusión Andina',
                'mar': 'Sabores del Mar',
                'vegetariano': 'Cocina Vegetariana'
            };
            
            row.innerHTML = `
                <td>${reservation.nombre}</td>
                <td>${fechaFormateada}</td>
                <td>${reservation.hora}</td>
                <td>${reservation.personas}</td>
                <td>${restauranteNombres[reservation.restaurante] || reservation.restaurante}</td>
                <td>
                    <button onclick="eliminarReserva(${reservation.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            
            reservationsBody.appendChild(row);
        });
    }
    
    actualizarResumenReservas();
}

function actualizarResumenReservas() {
    const totalReservasSpan = document.getElementById('totalReservas');
    const totalPersonasSpan = document.getElementById('totalPersonas');
    
    if (!totalReservasSpan || !totalPersonasSpan) return;
    
    const totalReservas = restaurantReservations.length;
    const totalPersonas = restaurantReservations.reduce((sum, reservation) => sum + reservation.personas, 0);
    
    totalReservasSpan.textContent = totalReservas;
    totalPersonasSpan.textContent = totalPersonas;
}

// Función global para eliminar reserva
window.eliminarReserva = function(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        restaurantReservations = restaurantReservations.filter(reservation => reservation.id !== id);
        localStorage.setItem('restaurantReservations', JSON.stringify(restaurantReservations));
        actualizarDisplayReservas();
    }
};

// ========== FUNCIONES DE LUGARES TURÍSTICOS ==========

function filtrarLugares(categoria) {
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (categoria === 'all' || cardCategory === categoria) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function animarTarjetasLugares() {
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// ========== FUNCIONES DE IMÁGENES ROTATIVAS ==========

function rotarImagenesFondo() {
    const cards = ['card1', 'card2', 'card3'];
    const cardImages = {
        card1: ['carp1/cendero1.jpg', 'carp1/cendero2.jpg', 'carp1/cendero3.jpg'],
        card2: ['carp2/unic1.jpg', 'carp2/unic2.jpg', 'carp2/unic3.jpg'],
        card3: ['carp3/plat1.jpg', 'carp3/plat2.jpg', 'carp3/plat3.jpg']
    };
    
    let currentIndex = 0;
    
    return function() {
        cards.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                const images = cardImages[cardId];
                if (images && images.length > 0) {
                    currentIndex = (currentIndex + 1) % images.length;
                    card.style.backgroundImage = `url('${images[currentIndex]}')`;
                    card.style.transition = 'background-image 1s ease-in-out';
                }
            }
        });
    };
}

// ========== INICIALIZACIÓN AL CARGAR EL DOM ==========

document.addEventListener('DOMContentLoaded', function() {
    // 1. EFECTO DE CARGA SUAVE
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 2. MENÚ HAMBURGUESA RESPONSIVO
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // 3. ROTACIÓN DE IMÁGENES (solo si existe el contenedor)
    const infoSection = document.querySelector('.info-section');
    if (infoSection) {
        const rotateImages = rotarImagenesFondo();
        setInterval(rotateImages, 5000);
    }
    
    // 4. BOTÓN DE REGISTRO
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            mostrarAlerta('¡Próximamente podrás registrarte en Huarmaca!');
        });
    }
    

    
    // 6. BOTONES DE RESERVA DE HOTELES
    const hotelBookBtns = document.querySelectorAll('.hotel-card .book-btn');
    hotelBookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hotelCard = this.closest('.hotel-card');
            const hotelName = hotelCard.querySelector('h3').textContent;
            mostrarAlerta(`Reservando: ${hotelName}\nSerás redirigido al formulario`);
            scrollSuave('#reservationForm');
        });
    });
    
    // 7. FORMULARIO DE RESERVA DE HOTEL (si existe)
    const hotelReservationForm = document.querySelector('form.reservation-form');
    if (hotelReservationForm && !hotelReservationForm.id) {
        hotelReservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación simple
            const nombre = this.querySelector('input[type="text"]')?.value;
            const email = this.querySelector('input[type="email"]')?.value;
            const fecha = this.querySelector('input[type="date"]')?.value;
            const hotel = this.querySelector('select')?.value;
            const terminos = this.querySelector('#terms')?.checked;
            
            if (!nombre || !email || !fecha || !hotel || !terminos) {
                mostrarAlerta('Por favor complete todos los campos requeridos');
                return;
            }
            
            mostrarAlerta(`¡Reserva confirmada para ${nombre}!\nRecibirás un correo en ${email}`);
            this.reset();
        });
    }
    
    // 8. FORMULARIO DE RESERVA DE RESTAURANTE
    const restaurantReservationForm = document.getElementById('reservationForm');
    if (restaurantReservationForm) {
        // Configurar fecha mínima (hoy)
        const today = new Date().toISOString().split('T')[0];
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            fechaInput.setAttribute('min', today);
        }
        
        // Inicializar display de reservas
        actualizarDisplayReservas();
        
        // Manejar envío del formulario
        restaurantReservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(restaurantReservationForm);
            const reservationData = {
                id: Date.now(),
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                fecha: formData.get('fecha'),
                hora: formData.get('hora'),
                personas: parseInt(formData.get('personas')),
                restaurante: formData.get('restaurante'),
                comentarios: formData.get('comentarios'),
                fechaRegistro: new Date().toLocaleString()
            };
            
            restaurantReservations.push(reservationData);
            localStorage.setItem('restaurantReservations', JSON.stringify(restaurantReservations));
            actualizarDisplayReservas();
            
            mostrarAlerta(`¡Reserva confirmada, ${reservationData.nombre}!\nTe esperamos el ${reservationData.fecha} a las ${reservationData.hora} hrs.`);
            restaurantReservationForm.reset();
        });
        
        // Botón limpiar formulario
        const clearFormBtn = document.getElementById('limpiarFormulario');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
                    restaurantReservationForm.reset();
                }
            });
        }
    }
    
    // 9. MODAL DE EVENTOS - VER DETALLES
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const verDetallesBtns = document.querySelectorAll('.ver-detalles-btn');
    
    if (modalOverlay && verDetallesBtns.length > 0) {
        verDetallesBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const titulo = this.getAttribute('data-titulo');
                const fecha = this.getAttribute('data-fecha');
                const lugar = this.getAttribute('data-lugar');
                const hora = this.getAttribute('data-hora');
                const descripcion = this.getAttribute('data-descripcion');
                const imagen = this.getAttribute('data-imagen');
                
                document.getElementById('modalTitulo').textContent = titulo;
                document.getElementById('modalFecha').textContent = fecha;
                document.getElementById('modalLugar').textContent = lugar;
                document.getElementById('modalHora').textContent = hora;
                document.getElementById('modalDescripcion').textContent = descripcion;
                document.getElementById('modalImagen').src = imagen;
                
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // 10. CALENDARIO INTERACTIVO
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            if (this.classList.contains('event-day')) {
                mostrarAlerta(`¡Hay un evento programado para el día ${this.textContent}!`);
            }
        });
    });
    
    // 11. LUGARES TURÍSTICOS - FILTROS
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Obtener la categoría del filtro
                const filterCategory = this.getAttribute('data-filter');
                
                // Aplicar filtro
                filtrarLugares(filterCategory);
            });
        });
        
        // Animar tarjetas al cargar
        animarTarjetasLugares();
    }
    
    // 12. BOTONES "VER MÁS DETALLES" EN LUGARES
    const placeButtons = document.querySelectorAll('.place-btn');
    placeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.place-card');
            const placeName = card.querySelector('h3').textContent;
            const placeCategory = card.querySelector('.place-category').textContent;
            
            mostrarAlerta(`Próximamente: Página detallada de "${placeName}"\nCategoría: ${placeCategory}`);
        });
    });
    
    // 13. BOTÓN "VER MENÚ" EN RESTAURANTES
    const verMenuBtn = document.querySelector('.restaurant-card button');
    if (verMenuBtn) {
        verMenuBtn.addEventListener('click', function() {
            mostrarAlerta('Mostrando menú de comida tradicional de Huarmaca');
        });
    }
    
    // 14. NAVEGACIÓN ACTIVA
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 15. SCROLL SUAVE PARA ENLACES INTERNOS (solo anchors con #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                scrollSuave(targetId);
            }
        });
    });
    
    // 16. MOSTRAR AÑO ACTUAL EN FOOTER
    actualizarAñoFooter();
    
    // 17. MODAL SOLICITAR GUÍA TURÍSTICO
    const solicitarGuiaBtn = document.getElementById('solicitarGuiaBtn');
    const solicitarGuiaModal = document.getElementById('solicitarGuiaModal');
    const closeGuiaModal = document.getElementById('closeGuiaModal');
    const solicitarGuiaForm = document.getElementById('solicitarGuiaForm');
    
    if (solicitarGuiaBtn) {
        solicitarGuiaBtn.addEventListener('click', function() {
            solicitarGuiaModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeGuiaModal) {
        closeGuiaModal.addEventListener('click', function() {
            solicitarGuiaModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (solicitarGuiaModal) {
        solicitarGuiaModal.addEventListener('click', function(e) {
            if (e.target === solicitarGuiaModal) {
                solicitarGuiaModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && solicitarGuiaModal && solicitarGuiaModal.classList.contains('active')) {
            solicitarGuiaModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Validación en tiempo real para campos de letras
    document.querySelectorAll('.input-only-letters').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g, '');
        });
        
        input.addEventListener('blur', function() {
            validateLettersField(this);
        });
    });
    
    // Validación en tiempo real para campos numéricos
    document.querySelectorAll('.input-only-numbers').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
        
        input.addEventListener('blur', function() {
            validateNumbersField(this);
        });
    });
    
    // Validación del formulario al enviar
    if (solicitarGuiaForm) {
        solicitarGuiaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos requeridos
             const nombre = document.getElementById('guia_nombre').value.trim();
             const apellido = document.getElementById('guia_apellido').value.trim();
             const email = document.getElementById('guia_email').value.trim();
             const procedencia = document.getElementById('guia_procedencia').value.trim();
            
            let isValid = true;
            
            // Validar nombre
            if (!nombre) {
                showFieldError('guia_nombre', 'El nombre es requerido');
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
                showFieldError('guia_nombre', 'El nombre solo debe contener letras');
                isValid = false;
            } else {
                clearFieldError('guia_nombre');
            }
            
            // Validar apellido
            if (!apellido) {
                showFieldError('guia_apellido', 'Los apellidos son requeridos');
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
                showFieldError('guia_apellido', 'Los apellidos solo deben contener letras');
                isValid = false;
            } else {
                clearFieldError('guia_apellido');
            }
            
            // Validar email
            if (!email) {
                showFieldError('guia_email', 'El email es requerido');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFieldError('guia_email', 'Email inválido');
                isValid = false;
            } else {
                clearFieldError('guia_email');
            }
            

            // Validar procedencia
            if (!procedencia) {
                showFieldError('guia_procedencia', 'La procedencia es requerida');
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(procedencia)) {
                showFieldError('guia_procedencia', 'La procedencia solo debe contener letras');
                isValid = false;
            } else {
                clearFieldError('guia_procedencia');
            }
            
            // Si es válido, enviar a WhatsApp
            if (isValid) {
                enviarAlWhatsApp();
                solicitarGuiaForm.reset();
                solicitarGuiaModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// ========== FUNCIONES DE VALIDACIÓN ==========

function validateLettersField(field) {
    const value = field.value.trim();
    if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        showFieldError(field.id, 'Solo se permiten letras');
    } else {
        clearFieldError(field.id);
    }
}

function validateNumbersField(field) {
    const value = field.value.trim();
    if (value && !/^\d+$/.test(value)) {
        showFieldError(field.id, 'Solo se permiten números');
    } else {
        clearFieldError(field.id);
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById('error_' + fieldId.replace('guia_', ''));
    
    if (field) {
        field.classList.add('error');
    }
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById('error_' + fieldId.replace('guia_', ''));
    
    if (field) {
        field.classList.remove('error');
    }
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('show');
    }
}

// ========== FUNCIÓN ENVIAR AL WHATSAPP ==========

function enviarAlWhatsApp() {
     const nombre = document.getElementById('guia_nombre').value;
     const apellido = document.getElementById('guia_apellido').value;
     const email = document.getElementById('guia_email').value;
     const procedencia = document.getElementById('guia_procedencia').value;
     const observaciones = document.getElementById('guia_observaciones').value;
     
     // Número de WhatsApp del dueño de la página (desde footer)
     const numeroWhatsApp = '51957370391'; // +51 913 867 133
     
     // Construir mensaje
     const mensaje = `
 *SOLICITUD DE GUÍA TURÍSTICO*
 
 *Datos Personales:*
 👤 Nombre: ${nombre} ${apellido}
 📧 Email: ${email}
 🏠 Procedencia: ${procedencia}
 ${observaciones ? '💬 Observaciones: ' + observaciones : ''}
 
 Enviado desde: Huarmaca Turístico
 Fecha: ${new Date().toLocaleString('es-PE')}
 `.trim();
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // URL de WhatsApp API
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, '_blank');
}