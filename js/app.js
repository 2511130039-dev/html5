/* ============================================================
   Configuración de EmailJS
   ============================================================ */
const SERVICE_ID = "service_mujqmfo";
const TEMPLATE_ID = "template_rj8f33q";
const PUBLIC_KEY = "zKr68UpFWKkDAnJcw";

/* URL pública de la imagen que se mostrará en el correo.
   Debe ser una URL accesible desde internet (no una ruta local). */
const LOGO_URL = "https://TU-DOMINIO.com/logo.png";

/* ============================================================
   Inicialización de EmailJS al cargar la página
   ============================================================ */
emailjs.init({ publicKey: PUBLIC_KEY });

/* Referencias a elementos del DOM */
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

/* Expresión regular para validar el formato del correo */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ============================================================
   validarFormulario()
   Valida cada campo y muestra los errores debajo de cada input.
   Devuelve true si todo es correcto, false si hay errores.
   ============================================================ */
function validarFormulario() {
  const campos = {
    from_name: document.getElementById("from_name").value.trim(),
    to_email: document.getElementById("to_email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  let esValido = true;

  /* Limpia los errores previos en la interfaz */
  limpiarErrores();

  /* Nombre: no vacío y mínimo 3 caracteres */
  if (campos.from_name === "") {
    marcarError("from_name", "El nombre es obligatorio.");
    esValido = false;
  } else if (campos.from_name.length < 3) {
    marcarError("from_name", "El nombre debe tener al menos 3 caracteres.");
    esValido = false;
  }

  /* Correo: no vacío y formato válido */
  if (campos.to_email === "") {
    marcarError("to_email", "El correo es obligatorio.");
    esValido = false;
  } else if (!EMAIL_REGEX.test(campos.to_email)) {
    marcarError("to_email", "Ingresa un correo con formato válido.");
    esValido = false;
  }

  /* Asunto: no vacío */
  if (campos.subject === "") {
    marcarError("subject", "El asunto es obligatorio.");
    esValido = false;
  }

  /* Mensaje: no vacío y mínimo 10 caracteres */
  if (campos.message === "") {
    marcarError("message", "El mensaje es obligatorio.");
    esValido = false;
  } else if (campos.message.length < 10) {
    marcarError("message", "El mensaje debe tener al menos 10 caracteres.");
    esValido = false;
  }

  return esValido;
}

/* Marca un campo como inválido y muestra su mensaje de error */
function marcarError(idCampo, mensaje) {
  const input = document.getElementById(idCampo);
  const errorSpan = document.querySelector(`[data-error-for="${idCampo}"]`);
  if (input) input.classList.add("invalid");
  if (errorSpan) errorSpan.textContent = mensaje;
}

/* Limpia los estados de error de todos los campos */
function limpiarErrores() {
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  document.querySelectorAll(".form__error").forEach((el) => (el.textContent = ""));
}

/* ============================================================
   mostrarNotificacion()
   Crea un aviso visual (toast) que desaparece a los 5 segundos.
   tipo: "success" | "error"
   ============================================================ */
function mostrarNotificacion(mensaje, tipo = "success") {
  const contenedor = document.getElementById("toast-container");
  if (!contenedor) return;

  /* Crear el elemento del toast */
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  /* Mostrar con transición */
  requestAnimationFrame(() => toast.classList.add("toast--show"));

  /* Ocultar y eliminar después de 5 segundos */
  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/* ============================================================
   enviarCorreo()
   Envía los datos del formulario mediante EmailJS.
   ============================================================ */
function enviarCorreo() {
  const templateParams = {
    from_name: document.getElementById("from_name").value.trim(),
    name: document.getElementById("from_name").value.trim(),
    to_email: document.getElementById("to_email").value.trim(),
    reply_to: document.getElementById("to_email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
    logo_url: LOGO_URL,
  };

  /* Estado de carga: deshabilitar botón y cambiar texto */
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(() => {
      /* Éxito */
      mostrarNotificacion("Correo enviado correctamente", "success");
      form.reset();
      limpiarErrores();
    })
    .catch((error) => {
      /* Error: mostrar notificación roja y registrar en consola */
      const mensajeError = error?.text || error?.message || "Error desconocido al enviar.";
      mostrarNotificacion(`Error: ${mensajeError}`, "error");
      console.error("Error al enviar el correo:", error);
    })
    .finally(() => {
      /* Rehabilitar el botón al terminar */
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar";
    });
}

/* ============================================================
   Evento submit del formulario
   ============================================================ */
form.addEventListener("submit", (event) => {
  event.preventDefault();

  /* Validar antes de enviar */
  if (!validarFormulario()) {
    mostrarNotificacion("Revisa los campos marcados en rojo.", "error");
    return;
  }

  /* Enviar el correo */
  enviarCorreo();
});
