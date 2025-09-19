// Ejemplo: scroll suave al hacer clic en los enlaces del menú
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    // Evita errores si el enlace lleva a otra página
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// --- Carrusel de reseñas ---
const reviews = document.querySelectorAll(".review");
let currentReview = 0;

function showReview(index) {
  reviews.forEach((review, i) => {
    review.classList.toggle("active", i === index);
  });
}

function nextReview() {
  currentReview = (currentReview + 1) % reviews.length;
  showReview(currentReview);
}

// Solo ejecutar si hay reseñas en la página
if (reviews.length > 0) {
  showReview(currentReview);
  setInterval(nextReview, 5000); // cambia cada 5s
}
// --- Envío del formulario de contacto (mailto) ---
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;

  const ok = document.getElementById('form-ok');
  const emailTo = 'elrincondearturo1@gmail.com';

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // Campos
    const nombre   = (document.getElementById('nombre')  || {}).value?.trim()   || '';
    const apellidos= (document.getElementById('apellidos')|| {}).value?.trim() || '';
    const email    = (document.getElementById('email')    || {}).value?.trim() || '';
    const mensaje  = (document.getElementById('mensaje')  || {}).value?.trim() || '';

    // Validación simple
    let valid = true;
    const setErr = (id,msg)=>{
      const el = document.getElementById(id);
      const err = el?.parentElement?.querySelector('.error-msg');
      if(err){ err.textContent = msg || ''; }
      if(msg){ valid = false; }
    };

    setErr('nombre', '');
    setErr('email', '');
    setErr('mensaje', '');

    if(!nombre){ setErr('nombre','Por favor, dinos tu nombre.'); }
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setErr('email','Introduce un email válido.');
    }
    if(!mensaje){ setErr('mensaje','Escribe un mensaje.'); }

    if(!valid) return;

    // Componer mailto
    const asunto = `Contacto desde la web - ${nombre} ${apellidos}`.trim();
    const cuerpo =
`Nombre: ${nombre} ${apellidos}
Email: ${email}

Mensaje:
${mensaje}`;

    const href = `mailto:${emailTo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    if(ok){ ok.hidden = false; }
    window.location.href = href;
  });
})();
