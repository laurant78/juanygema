// Al recargar la página, empezar siempre por la hoja 1 (el navegador suele recordar dónde estabas)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

document.addEventListener("DOMContentLoaded", () => {
  const weddingDate = new Date("2027-09-25T18:00:00+02:00");

  // APERTURA DEL SOBRE
  const envelopeScreen = document.getElementById("envelopeScreen");
  const openEnvelope = document.getElementById("openEnvelope");

  document.body.classList.add("no-scroll");
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  window.addEventListener("load", () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));

  openEnvelope.addEventListener("click", () => {
    if (envelopeScreen.classList.contains("opening")) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });  // al abrir, siempre la hoja 1

    envelopeScreen.classList.add("opening");

    window.setTimeout(() => {
      envelopeScreen.classList.add("is-hidden");
      document.body.classList.remove("no-scroll");
    }, 900);
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

  // LÓGICA DEL FORMULARIO
  const selectBoda = document.getElementById("boda");
  const detallesAsistencia = document.getElementById("detallesAsistencia");
  const selectAcompanado = document.getElementById("acompanado");
  const bloqueAcompanantes = document.getElementById("bloqueAcompanantes");
  const numAcompanantes = document.getElementById("numAcompanantes");
  const listaAcompanantes = document.getElementById("listaAcompanantes");
  const selectNinos = document.getElementById("ninos");
  const bloqueNinos = document.getElementById("bloqueNinos");

  // Muestra u oculta un grupo y lo desactiva (un grupo desactivado no se envía ni se valida)
  function mostrarGrupo(grupo, visible) {
    grupo.hidden = !visible;
    grupo.disabled = !visible;
  }

  // Crea un bloque "nombre + alergias" por cada acompañante, conservando lo ya escrito
  function pintarAcompanantes() {
    const max = parseInt(numAcompanantes.max, 10) || 4;
    const n = Math.min(Math.max(parseInt(numAcompanantes.value, 10) || 0, 0), max);
    const anteriores = [...listaAcompanantes.querySelectorAll(".acompanante")].map((bloque) => [
      bloque.querySelector("input").value,
      bloque.querySelector("textarea").value
    ]);

    listaAcompanantes.innerHTML = "";
    for (let i = 1; i <= n; i++) {
      const bloque = document.createElement("div");
      bloque.className = "acompanante";
      bloque.innerHTML = `
        <label for="acompNombre${i}">Nombre del acompañante ${i}</label>
        <input id="acompNombre${i}" name="Acompañante ${i} - Nombre" type="text" placeholder="Nombre y apellidos" required>
        <label for="acompAlergias${i}">¿Tiene alguna alergia?</label>
        <textarea id="acompAlergias${i}" name="Acompañante ${i} - Alergias" rows="2" placeholder="Si no tiene ninguna, déjalo en blanco"></textarea>`;
      if (anteriores[i - 1]) {
        bloque.querySelector("input").value = anteriores[i - 1][0];
        bloque.querySelector("textarea").value = anteriores[i - 1][1];
      }
      listaAcompanantes.appendChild(bloque);
    }
  }

  function actualizarFormulario() {
    const asiste = selectBoda.value === "Si";
    mostrarGrupo(detallesAsistencia, asiste);
    mostrarGrupo(bloqueAcompanantes, asiste && selectAcompanado.value === "Si");
    mostrarGrupo(bloqueNinos, asiste && selectNinos.value === "Si");
  }

  selectBoda.addEventListener("change", actualizarFormulario);
  selectAcompanado.addEventListener("change", actualizarFormulario);
  selectNinos.addEventListener("change", actualizarFormulario);
  numAcompanantes.addEventListener("input", pintarAcompanantes);

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
          listaAcompanantes.innerHTML = "";
          actualizarFormulario();
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

});