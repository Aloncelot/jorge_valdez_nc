// app/aviso-de-privacidad/page.js
// Aviso de Privacidad Integral conforme a la Ley Federal de Protección de Datos
// Personales en Posesión de los Particulares (DOF 20/03/2025).
// IMPORTANTE: confirmar con el cliente el domicilio del responsable y la fecha.
import Link from "next/link";
import CookiePreferencesButton from "../../components/CookiePreferencesButton";
import "../../components/PrivacyNotice.css";

export const metadata = {
  title: "Aviso de Privacidad | Jorge Valdez Rivera N.C.",
  description:
    "Aviso de Privacidad Integral: qué datos personales recabamos en este sitio, para qué los usamos y cómo ejercer tus derechos ARCO.",
};

const UPDATED = "28 de octubre de 2026";
const EMAIL = "jorgevaldezrivera@gmail.com";

export default function AvisoDePrivacidad() {
  return (
    <section className="privacy-page">
      <article className="privacy-container">
        <header className="privacy-header">
          <h1>Aviso de Privacidad Integral</h1>
          <p className="privacy-updated">Última actualización: {UPDATED}</p>
        </header>

        <p>
          Este aviso describe cómo se tratan los datos personales que compartes a través de este
          sitio web, en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión
          de los Particulares (en adelante, &ldquo;la Ley&rdquo;).
        </p>

        <h2>1. Responsable de tus datos</h2>
        <p>
          <strong>Jorge Valdez Rivera</strong>, Nutriólogo Clínico (N.C.), Cédula Profesional
          6587086, con domicilio para oír y recibir notificaciones en Torre Médica Mocel, Gelati 33,
          Col. San Miguel Chapultepec, Ciudad de México, Consultorio 202, y correo electrónico{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, es el responsable del tratamiento de tus datos
          personales.
        </p>

        <h2>2. Datos personales que recabamos</h2>
        <p>A través de este sitio recabamos únicamente los datos que tú nos proporcionas:</p>
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> nombre completo, correo electrónico y el
            contenido de tu mensaje.
          </li>
          <li>
            <strong>Reseñas:</strong> nombre, calificación y comentario. Si inicias sesión con
            Google, también tu nombre, correo electrónico y foto de perfil de esa cuenta, y un
            identificador de usuario. Tu correo no se publica.
          </li>
          <li>
            <strong>Datos técnicos:</strong> tu preferencia de cookies y, si inicias sesión con
            Google, la sesión guardada en tu navegador.
          </li>
        </ul>
        <p>
          <strong>Datos sensibles.</strong> Este sitio no solicita datos sensibles, como información
          sobre tu estado de salud. Te pedimos no incluirlos en el formulario de contacto ni en tus
          reseñas; la información clínica se trata únicamente en consulta. Si decides incluirlos, al
          aceptar este aviso consientes expresamente que se traten solo para las finalidades aquí
          descritas, y podremos no publicar una reseña que los contenga.
        </p>

        <h2>3. Finalidades del tratamiento</h2>
        <p>Tus datos se usan exclusivamente para estas finalidades, necesarias para el servicio:</p>
        <ul>
          <li>Responder tus mensajes, dudas y solicitudes de cita.</li>
          <li>Recibir, moderar y, en su caso, publicar tus reseñas en este sitio.</li>
          <li>Identificar las reseñas verificadas con una cuenta de Google.</li>
          <li>Proteger el sitio contra spam y usos indebidos.</li>
        </ul>
        <p>
          No usamos tus datos para finalidades secundarias: no enviamos publicidad, no hacemos
          perfiles y no vendemos ni compartimos tu información con fines comerciales.
        </p>

        <h2>4. Proveedores y transferencias</h2>
        <p>
          Para operar el sitio nos apoyamos en proveedores que tratan los datos por nuestra cuenta y
          bajo nuestras instrucciones. Sus servidores pueden encontrarse fuera de México:
        </p>
        <ul>
          <li>
            <strong>Google LLC</strong> (Firebase): almacenamiento de reseñas e inicio de sesión
            con Google. Google Maps, para los mapas de ubicación, solo si los aceptas.
          </li>
          <li>
            <strong>EmailJS</strong>: envío de los mensajes del formulario de contacto a nuestro
            correo.
          </li>
          <li>El proveedor de hospedaje del sitio web.</li>
        </ul>
        <p>
          No transferimos tus datos personales a terceros, salvo en los casos previstos en la Ley
          que no requieren tu consentimiento, como el requerimiento de una autoridad competente.
        </p>

        <h2>5. Cómo limitar el uso de tus datos</h2>
        <ul>
          <li>Puedes pedir que retiremos tu reseña en cualquier momento.</li>
          <li>Puedes cerrar tu sesión de Google y revocar el acceso desde tu cuenta de Google.</li>
          <li>
            Puedes cambiar tus preferencias de cookies cuando quieras:{" "}
            <CookiePreferencesButton className="privacy-inline-button" />.
          </li>
        </ul>

        <h2>6. Derechos ARCO y revocación del consentimiento</h2>
        <p>
          Tienes derecho a <strong>Acceder</strong> a tus datos, <strong>Rectificarlos</strong>,{" "}
          <strong>Cancelarlos</strong> u <strong>Oponerte</strong> a su tratamiento, así como a
          revocar el consentimiento que nos hayas otorgado. Para hacerlo, envía un correo a{" "}
          <a href={`mailto:${EMAIL}?subject=Derechos%20ARCO`}>{EMAIL}</a> con el asunto
          &ldquo;Derechos ARCO&rdquo; e incluye:
        </p>
        <ul>
          <li>Tu nombre y un medio para comunicarte la respuesta.</li>
          <li>
            Un documento que acredite tu identidad o, en su caso, la representación legal de quien
            presente la solicitud.
          </li>
          <li>La descripción clara del derecho que quieres ejercer y de los datos involucrados.</li>
          <li>En caso de rectificación, los cambios que solicitas.</li>
        </ul>
        <p>
          Te responderemos en un plazo máximo de 20 días hábiles a partir de la recepción de tu
          solicitud. Si resulta procedente, la haremos efectiva dentro de los 15 días hábiles
          siguientes. Ambos plazos podrán ampliarse una sola vez por un periodo igual cuando las
          circunstancias lo justifiquen.
        </p>

        <h2 id="cookies">7. Cookies y tecnologías similares</h2>
        <p>
          Este sitio <strong>no usa cookies de publicidad ni de analítica</strong>. Utilizamos:
        </p>
        <div className="privacy-table-wrapper">
          <table className="privacy-table">
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Para qué sirve</th>
                <th scope="col">¿Se puede desactivar?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Necesarias (almacenamiento local)</td>
                <td>
                  Recordar tu elección sobre cookies y, si inicias sesión con Google, mantener tu
                  sesión para publicar una reseña.
                </td>
                <td>No, son indispensables para que el sitio funcione.</td>
              </tr>
              <tr>
                <td>De terceros: Google Maps</td>
                <td>Mostrar los mapas de nuestras ubicaciones. Google instala sus propias cookies.</td>
                <td>Sí. Solo se cargan si aceptas todas las cookies o pides ver un mapa.</td>
              </tr>
              <tr>
                <td>De terceros: inicio de sesión con Google</td>
                <td>Verificar tu identidad cuando eliges &ldquo;Continuar con Google&rdquo;.</td>
                <td>Sí. Solo se usan si inicias sesión; puedes dejar tu reseña sin hacerlo.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Puedes cambiar tu elección en <em>Preferencias de cookies</em>, al pie de cada página, o
          borrar las cookies desde la configuración de tu navegador.
        </p>

        <h2>8. Menores de edad</h2>
        <p>
          Este sitio no está dirigido a menores de 18 años. Si eres menor de edad, pide a tu madre,
          padre o tutor que se ponga en contacto con nosotros.
        </p>

        <h2>9. Cambios a este aviso</h2>
        <p>
          Cualquier cambio a este Aviso de Privacidad se publicará en esta misma página, con la
          fecha de su última actualización.
        </p>

        <h2>10. Autoridad</h2>
        <p>
          Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes
          acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad encargada de vigilar el
          cumplimiento de la Ley.
        </p>

        <div className="privacy-back">
          <Link href="/" className="btn-primary">
            Volver al Inicio
          </Link>
        </div>
      </article>
    </section>
  );
}
