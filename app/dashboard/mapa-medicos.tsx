"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";

const API = process.env.NEXT_PUBLIC_API_BASE!;

/* ================================
   IMPORTS REACT-LEAFLET (SIN SSR)
================================ */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

/* ================================
   ICONOS DOCYA
================================ */

const medicoIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 14px;
      height: 14px;
      background: #14B8A6;
      border: 2px solid #0F766E;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(20,184,166,.9);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const enfermeroIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 14px;
      height: 14px;
      background: #3B82F6;
      border: 2px solid #1D4ED8;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(59,130,246,.9);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/* ================================
   TIPOS
================================ */

type Profesional = {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  especialidad: string;
  telefono: string;
  matricula?: string;
  tipo: "medico" | "enfermero";
};

/* ================================
   COMPONENTE
================================ */

export default function MapaMedicos() {
  const [mounted, setMounted] = useState(false);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  // asegurar DOM (fix Next + Leaflet)
  useEffect(() => {
    setMounted(true);
  }, []);

  // cargar profesionales conectados (backend decide)
  useEffect(() => {
    if (!mounted) return;

    const load = () =>
      fetch(`${API}/monitoreo/profesionales_conectados`)
        .then((r) => r.json())
        .then((d) => {
          if (d.ok) {
            setProfesionales(d.profesionales || []);
          } else {
            setProfesionales([]);
          }
        })
        .catch(() => setProfesionales([]));

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="h-[420px] flex items-center justify-center text-white/60">
        Cargando mapa…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* LEYENDA */}
      <div className="flex gap-6 text-xs text-white/80">
        <Legend color="#14B8A6" label="Médico" />
        <Legend color="#3B82F6" label="Enfermero" />
      </div>

      {/* MAPA */}
      <div className="h-[420px] rounded-lg overflow-hidden border border-white/10">
        <MapContainer
          center={[-34.6037, -58.3816]}
          zoom={12}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution="© OpenStreetMap © CARTO"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {profesionales.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={p.tipo === "medico" ? medicoIcon : enfermeroIcon}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color:
                        p.tipo === "medico" ? "#14B8A6" : "#3B82F6",
                      marginBottom: 4,
                    }}
                  >
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {p.especialidad}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>
                    {p.telefono}
                  </div>
                  {p.matricula && (
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      Matrícula: {p.matricula}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* TABLA */}
      <TablaProfesionales data={profesionales} />
    </div>
  );
}

/* ================================
   COMPONENTES AUX
================================ */

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
        }}
      />
      <span>{label}</span>
    </div>
  );
}

function TablaProfesionales({ data }: { data: Profesional[] }) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <table className="w-full text-xs md:text-sm text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="text-left px-3 py-2">Nombre</th>
            <th className="text-left px-3 py-2">Tipo</th>
            <th className="text-left px-3 py-2">Especialidad</th>
            <th className="text-left px-3 py-2">Teléfono</th>
            <th className="text-left px-3 py-2">Matrícula</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr
              key={p.id}
              className="border-t border-white/5 hover:bg-white/5"
            >
              <td className="px-3 py-2 font-medium">
                {p.nombre}
              </td>
              <td
                className={`px-3 py-2 ${
                  p.tipo === "medico"
                    ? "text-teal-400"
                    : "text-blue-400"
                }`}
              >
                {p.tipo}
              </td>
              <td className="px-3 py-2">
                {p.especialidad}
              </td>
              <td className="px-3 py-2">
                {p.telefono}
              </td>
              <td className="px-3 py-2">
                {p.matricula || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
