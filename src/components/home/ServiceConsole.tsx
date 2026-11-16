"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SERVICES, SERVICE_EVENT } from "./services";

/** Services as the six channel strips of a mixing console (ARIA tabs). */
export default function ServiceConsole() {
  const [current, setCurrent] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SERVICES[current];

  const move = (i: number) => {
    setCurrent(i);
    tabs.current[i]?.focus();
  };

  return (
    <div className="console">
      <div className="strips" role="tablist" aria-label="Services">
        {SERVICES.map((service, i) => (
          <button
            key={service.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className="ch"
            role="tab"
            id={`service-tab-${i}`}
            aria-controls="service-panel"
            aria-selected={i === current}
            tabIndex={i === current ? 0 : -1}
            onClick={() => setCurrent(i)}
            onKeyDown={(e) => {
              const n = SERVICES.length;
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move((i + 1) % n);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move((i + n - 1) % n);
              } else if (e.key === "Home") {
                e.preventDefault();
                move(0);
              } else if (e.key === "End") {
                e.preventDefault();
                move(n - 1);
              }
            }}
          >
            <small>CH {String(i + 1).padStart(2, "0")}</small>
            <span className="meter">
              <i />
            </span>
            <b>{service.title}</b>
          </button>
        ))}
      </div>
      <div className="panel" id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${current}`}>
        <div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <div className="actions">
            <a
              className="btn btn-main"
              href="#contact"
              onClick={() => window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: s.title }))}
            >
              Demander un devis{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
            <Link className="text-link" href={s.href}>
              En savoir plus
            </Link>
          </div>
        </div>
        <ul>
          {s.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
