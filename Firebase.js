// Firebase.js
// Carga diferida: el SDK de Firebase (~250 KB) ya no entra en el bundle inicial.
// Firestore se descarga solo cuando la sección de reseñas se acerca a la vista,
// y Auth solo cuando alguien va a iniciar sesión.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Cuentas con acceso al panel. IMPORTANTE: esto solo controla la interfaz;
// la protección real está en firestore.rules (misma lista, con email verificado).
export const ADMIN_EMAILS = [
  "aloncelot@gmail.com",
  "aloncelot@hotmail.com",
  "jorgevaldezrivera@gmail.com",
];

export function isAdminUser(user) {
  if (!user || !user.email || !user.emailVerified) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

let appPromise;
let firestorePromise;
let authPromise;

function retryable(promise, reset) {
  return promise.catch((err) => {
    reset();
    throw err;
  });
}

function loadApp() {
  if (!appPromise) {
    appPromise = retryable(
      import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
        getApps().length ? getApp() : initializeApp(firebaseConfig)
      ),
      () => (appPromise = undefined)
    );
  }
  return appPromise;
}

/** Devuelve { db, fs } donde fs es el módulo firebase/firestore. */
export function loadFirestore() {
  if (!firestorePromise) {
    firestorePromise = retryable(
      Promise.all([loadApp(), import("firebase/firestore")]).then(([app, fs]) => ({
        db: fs.getFirestore(app),
        fs,
      })),
      () => (firestorePromise = undefined)
    );
  }
  return firestorePromise;
}

/** Devuelve { auth, fa } donde fa es el módulo firebase/auth. */
export function loadAuth() {
  if (!authPromise) {
    authPromise = retryable(
      Promise.all([loadApp(), import("firebase/auth")]).then(([app, fa]) => ({
        auth: fa.getAuth(app),
        fa,
      })),
      () => (authPromise = undefined)
    );
  }
  return authPromise;
}
