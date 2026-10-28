import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

// Content Security Policy sin nonces (ver node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// Orígenes permitidos: Firebase (Firestore/Auth), EmailJS y Google Maps.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://apis.google.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  "font-src 'self'",
  [
    "connect-src 'self'",
    "https://api.emailjs.com",
    "https://firestore.googleapis.com",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://www.googleapis.com",
    "https://apis.google.com",
    isDev ? "ws: http://localhost:*" : "",
  ]
    .filter(Boolean)
    .join(" "),
  [
    "frame-src https://www.google.com https://accounts.google.com https://*.firebaseapp.com",
    authDomain ? `https://${authDomain}` : "",
  ]
    .filter(Boolean)
    .join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Necesario para el popup de inicio de sesión con Google
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Solo WebP (formato por defecto). AVIF se quitó: además de ser más lento
  // de generar, fue el vector de una RCE crítica en el optimizador de imágenes.
  images: {
    formats: ["image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...["/admin", "/admin-login"].map((source) => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      })),
    ];
  },
};

export default nextConfig;
