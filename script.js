document.addEventListener("DOMContentLoaded", () => {
  const weddingDate = new Date("2027-09-25T18:00:00+02:00");

  // APERTURA DEL SOBRE
  const envelopeScreen = document.getElementById("envelopeScreen");
  const openEnvelope = document.getElementById("openEnvelope");

  document.body.classList.add("no-scroll");

  openEnvelope.addEventListener("click", () => {
    if (envelopeScreen.classList.contains("opening")) return;

    envelopeScreen.classList.add("opening");

    window.setTimeout(() => {
      envelopeScreen.classList.add("is-hidden");
      document.body.classList.remove("no-scroll");
    }, 700);
  });

  // CUENTA ATRÁS
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const countdown = document.getElementById("countdown");

  function updateCountdown() {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      countdown.innerHTML = "<p>¡Hoy es nuestro gran día! ♡</p>";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = days;
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // GOOGLE CALENDAR
  const calendarLink = document.getElementById("calendarLink");
  const calendarStart = "20270925T160000Z";
  const calendarEnd = "20270925T170000Z";

  const calendarDetails = {
    text: "Boda de Juan y Gema",
    dates: `${calendarStart}/${calendarEnd}`,
    details: "¡Nos casamos! Os esperamos el 25 de septiembre de 2027 a las 18:00.",
    location: "Real Monasterio de Guadalupe, Guadalupe, Cáceres"
  };

  const calendarURL =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&" +
    new URLSearchParams(calendarDetails).toString();

  calendarLink.href = calendarURL;

  // LÓGICA DEL FORMULARIO Y PREBODA
  const selectBoda = document.getElementById("boda");
  const detallesAsistencia = document.getElementById("detallesAsistencia");
  const inputNombre = document.getElementById("nombre");
  const bloquePreboda = document.getElementById("bloquePreboda");
  const selectPreboda = document.getElementById("preboda");

  // Nombres autorizados a la preboda (en minúsculas)
  const invitadosPreboda = ["anton", "pablo", "familia garcia", "carlos"];

  function actualizarFormulario() {
    const asisteBoda = selectBoda.value === "Si";
    const nombreEscrito = inputNombre.value.toLowerCase().trim();

    if (asisteBoda) {
      detallesAsistencia.style.display = "block";

      const estaInvitadoPreboda = invitadosPreboda.some(invitado => nombreEscrito.includes(invitado));

      if (estaInvitadoPreboda) {
        bloquePreboda.style.display = "block";
        selectPreboda.setAttribute("required", "true");
      } else {
        bloquePreboda.style.display = "none";
        selectPreboda.removeAttribute("required");
        selectPreboda.value = "";
      }
    } else {
      detallesAsistencia.style.display = "none";
      bloquePreboda.style.display = "none";
      selectPreboda.removeAttribute("required");
    }
  }

  if (selectBoda && inputNombre) {
    selectBoda.addEventListener("change", actualizarFormulario);
    inputNombre.addEventListener("input", actualizarFormulario);
  }

  // ENVÍO DE FORMULARIO A FORMSPREE CON MENSAJE EMERGENTE
  const rsvpForm = document.getElementById("rsvpForm");
  const successModal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");
  const submitBtn = document.getElementById("submitBtn");

  // CAMBIA ESTE ENLACE POR EL QUE TE DÉ FORMSPREE:
  const FORMSPREE_URL = "https://formspree.io/f/mnpjyzpb";

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      submitBtn.textContent = "Enviando... ♡";
      submitBtn.disabled = true;

      const formData = new FormData(rsvpForm);

      fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Mostrar ventana emergente
          successModal.style.display = "flex";
          // Limpiar formulario
          rsvpForm.reset();
          if (detallesAsistencia) detallesAsistencia.style.display = "none";
          if (bloquePreboda) bloquePreboda.style.display = "none";
        } else {
          alert("Hubo un error al enviar el formulario. Inténtalo de nuevo.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error de conexión. Inténtalo más tarde.");
      })
      .finally(() => {
        submitBtn.textContent = "Enviar respuesta ♡";
        submitBtn.disabled = false;
      });
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      successModal.style.display = "none";
    });
  }

  // CEREZOS: entran por los lados cuando cada hoja aparece en pantalla
  const hojas = document.querySelectorAll(".page");
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      entrada.target.classList.toggle("is-visible", entrada.isIntersecting);
    });
  }, { threshold: 0.15 });
  hojas.forEach((hoja) => observador.observe(hoja));
});