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

// ===== Reveal on scroll =====
(function(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el=> io.observe(el));
})();

// ===== Header sticky con blur al hacer scroll =====
(function(){
  const header = document.querySelector('.main-header');
  if(!header) return;
  const onScroll = ()=> {
    if(window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
})();

// ===== Parallax sutil del hero =====
(function(){
  const hero = document.querySelector('.hero');
  const media = hero?.querySelector('.hero-media');
  if(!hero || !media) return;
  document.documentElement.classList.add('parallax-on');
  window.addEventListener('scroll', ()=>{
    const rect = hero.getBoundingClientRect();
    const view = Math.max(1, window.innerHeight);
    if(rect.bottom > 0 && rect.top < view){
      const p = (rect.top / view); // -1..1 aprox
      media.style.transform = `translateY(${p * 10}px)`;
    }
  }, { passive:true });
})();

// ===== Botón "volver arriba" =====
(function(){
  const btn = document.querySelector('.to-top');
  if(!btn) return;
  const toggle = ()=> {
    if(window.scrollY > 600) btn.classList.add('is-show');
    else btn.classList.remove('is-show');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive:true });
  btn.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
})();


// ===== Popup de cookies =====
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("cookie-popup");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  if (!localStorage.getItem("cookieConsent")) {
    popup.style.display = "block"; // mostrar si no hay elección guardada
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    popup.style.display = "none";
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "rejected");
    popup.style.display = "none";
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
// 
// --- Reserva por mailto ---
(function(){
  const form = document.getElementById('booking-form');
  if(!form) return;

  // fecha mínima = hoy
  const fecha = document.getElementById('fecha');
  if (fecha) {
    const hoy = new Date().toISOString().split('T')[0];
    fecha.min = hoy;
  }

  const ok = document.getElementById('booking-ok');
  const emailTo = 'elrincondearturo1@gmail.com';

  const setErr = (input, msg='')=>{
    const err = input?.parentElement?.querySelector('.error-msg');
    if (err) err.textContent = msg;
  };

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const f = (id)=>document.getElementById(id);
    const v = (id)=>f(id)?.value?.trim() || '';

    const campos = {
      fecha: f('fecha'),
      hora: f('hora'),
      personas: f('personas'),
      nombre: f('nombre'),
      telefono: f('telefono'),
      email: f('email'),
      acepto: f('acepto'),
    };

    // limpiar errores
    Object.values(campos).forEach(el=> el && setErr(el, ''));

    // validación
    let valid = true;
    if(!v('fecha'))     { setErr(campos.fecha,'Elige una fecha.'); valid=false; }
    if(!v('hora'))      { setErr(campos.hora,'Elige una hora.'); valid=false; }
    if(!v('personas'))  { setErr(campos.personas,'Indica cuántas personas.'); valid=false; }
    if(!v('nombre'))    { setErr(campos.nombre,'Dinos tu nombre.'); valid=false; }
    if(!v('telefono'))  { setErr(campos.telefono,'Añade un teléfono.'); valid=false; }
    if(!v('email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))){
      setErr(campos.email,'Email no válido.'); valid=false;
    }
    if(!campos.acepto?.checked){ alert('Debes aceptar la Política de Privacidad.'); valid=false; }

    if(!valid) return;

    const asunto = `Reserva ${v('fecha')} ${v('hora')} - ${v('nombre')} (${v('personas')} pax)`;

    const cuerpo =
`Hola,

Quisiera reservar:
- Fecha: ${v('fecha')}
- Hora: ${v('hora')}
- Personas: ${v('personas')}
- Zona: ${v('zona')}
- Ocasión: ${v('ocasion')}

Datos de contacto:
- Nombre: ${v('nombre')}
- Teléfono: ${v('telefono')}
- Email: ${v('email')}

Comentarios:
${v('comentarios') || '(sin comentarios)'}
`;

    if(ok) ok.hidden = false;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  });
})();
