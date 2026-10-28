// components/CookiePreferencesButton.js
"use client";
import React from "react";
import { openCookiePreferences } from "./consent";

const CookiePreferencesButton = ({ className }) => (
  <button type="button" className={className} onClick={openCookiePreferences}>
    Preferencias de cookies
  </button>
);

export default CookiePreferencesButton;
