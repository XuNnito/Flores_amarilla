document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentName = '';
    let isPlaying = false;
    
    // Elementos del DOM
    const matrixFlowers = document.getElementById('matrixFlowers');
    const nameModal = document.getElementById('nameModal');
    const nameInput = document.getElementById('nameInput');
    const nameSubmit = document.getElementById('nameSubmit');
    const namePreview = document.getElementById('namePreview');
    const flowerBtn = document.getElementById('flowerBtn');
    const letterModal = document.getElementById('letterModal');
    const closeBtn = document.getElementById('closeBtn');
    const musicBtn = document.getElementById('musicBtn');
    const linkSection = document.getElementById('linkSection');
    const generatedLink = document.getElementById('generatedLink');
    const copyLink = document.getElementById('copyLink');
    const newLinkBtn = document.getElementById('newLinkBtn');
    
    const flowerSymbols = ['🌼', '🌻', '💐', '🌸', '💮', '🏵️'];
    const audio = new Audio('https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/AUDIO/Flores%20amarillas.mp3');
    
    // Inicialización
    initializePage();
    setupEventListeners();
    
    function initializePage() {
        // Verificar si hay un nombre en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        
        if (nameFromUrl) {
            // Si viene de un enlace personalizado, solo mostrar la dedicatoria
            currentName = decodeURIComponent(nameFromUrl);
            updatePageWithName(currentName, false); // false = no mostrar sección de enlaces
            nameModal.style.display = 'none';
        } else {
            // Si es una visita nueva, mostrar modal para crear dedicatoria
            nameModal.style.display = 'flex';
        }
        
        // Iniciar animación de flores
        setInterval(createMatrixFlowers, 100);
    }
    
    function updatePageWithName(name, showLinkSection = true) {
        currentName = name;
        
        // Actualizar todos los elementos con el nombre
        document.getElementById('nameDedication').textContent = 'Para ' + name;
        document.getElementById('personalMessage').textContent = name + ', este día especial, quiero que sepas...';
        document.getElementById('signatureName').textContent = name;
        document.getElementById('letterName').textContent = name;
        
        // Solo mostrar sección de enlace si se solicita (cuando se crea, no cuando se ve)
        if (showLinkSection) {
            document.getElementById('linkForName').textContent = name;
            linkSection.style.display = 'block';
            linkSection.style.visibility = 'visible';
            linkSection.style.opacity = '1';
            generatePersonalizedLink(name);
        } else {
            // Ocultar completamente la sección de enlaces
            linkSection.style.display = 'none';
        }
    }
    
    function generatePersonalizedLink(name) {
        const baseUrl = window.location.origin + window.location.pathname;
        const personalizedUrl = baseUrl + '?name=' + encodeURIComponent(name);
        generatedLink.value = personalizedUrl;
    }
    
    function setupEventListeners() {
        // Event Listeners para el modal de nombre
        nameInput.addEventListener('input', function() {
            const name = this.value.trim();
            if (name) {
                namePreview.textContent = 'Vista previa: "Para ' + name + '"';
                namePreview.style.display = 'block';
            } else {
                namePreview.style.display = 'none';
            }
        });
        
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitName();
            }
        });
        
        nameSubmit.addEventListener('click', submitName);
        
        // Event Listener para copiar enlace
        copyLink.addEventListener('click', function() {
            generatedLink.select();
            generatedLink.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
                this.textContent = '✓ ¡Copiado!';
                setTimeout(function() {
                    copyLink.textContent = '📋 Copiar';
                }, 2000);
            } catch (err) {
                navigator.clipboard.writeText(generatedLink.value).then(function() {
                    copyLink.textContent = '✓ ¡Copiado!';
                    setTimeout(function() {
                        copyLink.textContent = '📋 Copiar';
                    }, 2000);
                }).catch(function() {
                    alert('No se pudo copiar el enlace. Cópialo manualmente.');
                });
            }
        });
        
        // Event Listener para crear nuevo enlace
        newLinkBtn.addEventListener('click', function() {
            // Limpiar el input y mostrar el modal
            nameInput.value = '';
            namePreview.style.display = 'none';
            nameModal.style.display = 'flex';
        });
        
        // Event Listeners para modal de carta
        flowerBtn.addEventListener('click', function() {
            letterModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            for (let i = 0; i < 30; i++) {
                setTimeout(function() {
                    createFlowerExplosion();
                }, i * 50);
            }
            toggleAudio();
        });
        
        closeBtn.addEventListener('click', function() {
            letterModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === letterModal) {
                letterModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Event Listeners para música
        musicBtn.addEventListener('click', toggleAudio);
        
        window.addEventListener('mousemove', function autoPlayOnce() {
            if (!isPlaying) {
                audio.play().then(function() {
                    musicBtn.textContent = '❚❚';
                    isPlaying = true;
                }).catch(function(e) {
                    console.log("Autoplay bloqueado por el navegador.");
                });
            }
            window.removeEventListener('mousemove', autoPlayOnce);
        });
        
        // Prevenir doble click
        document.addEventListener('dblclick', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    
    function submitName() {
        const name = nameInput.value.trim();
        if (name) {
            updatePageWithName(name, true); // true = mostrar sección de enlaces al crear
            nameModal.style.display = 'none';
        } else {
            alert('Por favor, ingresa un nombre válido');
        }
    }
    
    function toggleAudio() {
        if (isPlaying) {
            audio.pause();
            musicBtn.textContent = '♪';
        } else {
            audio.play().catch(function(e) {
                console.log("La reproducción automática fue prevenida. Haz clic manualmente.");
            });
            musicBtn.textContent = '❚❚';
        }
        isPlaying = !isPlaying;
    }
    
    function createMatrixFlowers() {
        const flower = document.createElement('div');
        flower.className = 'flower-matrix';
        flower.innerHTML = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = 2 + Math.random() * 3 + 's';
        flower.style.opacity = Math.random() * 0.5 + 0.3;
        flower.style.fontSize = (10 + Math.random() * 15) + 'px';
        matrixFlowers.appendChild(flower);
        
        setTimeout(function() {
            flower.remove();
        }, 5000);
    }
    
    function createFlowerExplosion() {
        const explosion = document.createElement('div');
        explosion.innerHTML = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
        explosion.style.position = 'fixed';
        explosion.style.left = Math.random() * 100 + 'vw';
        explosion.style.top = Math.random() * 100 + 'vh';
        explosion.style.color = 'hsl(' + (Math.random() * 20 + 50) + ', 100%, 50%)';
        explosion.style.fontSize = '25px';
        explosion.style.zIndex = '100';
        explosion.style.transform = 'scale(0)';
        explosion.style.animation = 'pop 0.5s forwards, fadeOut 0.5s 0.5s forwards';
        
        document.body.appendChild(explosion);
        
        setTimeout(function() {
            explosion.remove();
        }, 1000);
    }
    
    // Agregar estilos CSS para las animaciones
    const style = document.createElement('style');
    style.textContent = '@keyframes pop { to { transform: scale(1); } } @keyframes fadeOut { to { opacity: 0; transform: scale(0.5); } }';
    document.head.appendChild(style);
});