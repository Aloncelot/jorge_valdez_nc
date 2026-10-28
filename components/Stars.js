// components/Stars.js
// Reemplaza react-simple-star-rating (sin soporte oficial para React 19).
// StarsDisplay: solo lectura, admite fracciones. StarsInput: radios accesibles.
"use client";
import { useId, useState } from "react";

const STAR_PATH =
  "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z";

function Star({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );
}

function Row({ size }) {
  return (
    <span className="stars-row">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} />
      ))}
    </span>
  );
}

export function StarsDisplay({ value = 0, size = 16 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className="stars" role="img" aria-label={`Calificación: ${v} de 5`}>
      <span className="stars-base">
        <Row size={size} />
      </span>
      <span className="stars-fill" style={{ width: `${(v / 5) * 100}%` }}>
        <Row size={size} />
      </span>
    </span>
  );
}

export function StarsInput({ value, onChange, size = 30, legend = "Calificación:" }) {
  const name = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset className="field star-input">
      <legend>{legend}</legend>
      <div className="star-input-row" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const id = `${name}-${n}`;
          return (
            <span key={n}>
              <input
                className="visually-hidden"
                type="radio"
                id={id}
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                required
              />
              <label
                htmlFor={id}
                className={n <= shown ? "is-on" : undefined}
                onMouseEnter={() => setHover(n)}
              >
                <Star size={size} />
                <span className="visually-hidden">
                  {n} {n === 1 ? "estrella" : "estrellas"}
                </span>
              </label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}
