"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Stethoscope,
  UserRound,
  Clock,
  Timer,
  MapPinned,
  HeartPulse,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const API = process.env.NEXT_PUBLIC_API_BASE!;

// Mapa (sin SSR)
const Map = dynamic(() => import("./mapa-medicos"), { ssr: false });

type Resumen = {
  total_medicos: number;
  total_enfermeros: number;
  consultas_en_curso: number;
  consultas_hoy: number;
  total_usuarios: number;
};

type Profesional = {
  id: number;
  nombre: string;
  tipo: "medico" | "enfermero";
  telefono: string;
  matricula?: string;
};

export default function DashboardHome() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [tiempoAtencion, setTiempoAtencion] = useState(0);
  const [tiempoLlegada, setTiempoLlegada] = useState(0);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const medicosConectados = profesionales.filter(
    (p) => p.tipo === "medico"
  ).length;

  const enfermerosConectados = profesionales.filter(
    (p) => p.tipo === "enfermero"
  ).length;

  useEffect(() => {
    fetch(`${API}/monitoreo/resumen`)
      .then((r) => r.json())
      .then(setResumen);

    fetch(`${API}/monitoreo/tiempo_promedio`)
      .then((r) => r.json())
      .then((d) => setTiempoAtencion(d.tiempo_promedio_min || 0));

    fetch(`${API}/monitoreo/tiempo_llegada_promedio`)
      .then((r) => r.json())
      .then((d) => setTiempoLlegada(d.tiempo_llegada_promedio_min || 0));

    const loadProfesionales = () =>
      fetch(`${API}/monitoreo/medicos_mapa`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.ok) {
            setProfesionales([]);
            return;
          }

          setProfesionales(
            (d.profesionales || []).map((p: any) => ({
              id: p.id,
              nombre: p.nombre,
              tipo: p.tipo,
              telefono: p.telefono ?? "",
              matricula: p.matricula,
            }))
          );
        })
        .catch(() => setProfesionales([]));

    loadProfesionales();
    const i = setInterval(loadProfesionales, 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-white">
          Panel de Monitoreo
        </h1>
        <p className="text-white/70">
          Estado operativo en tiempo real — DocYa
        </p>
      </div>

      {/* KPIs PRINCIPALES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <Kpi icon={Stethoscope} label="Médicos conectados" value={medicosConectados} />
        <Kpi icon={UserRound} label="Enfermeros conectados" value={enfermerosConectados} />
        <Kpi icon={Activity} label="Consultas en curso" value={resumen?.consultas_en_curso} />
        <Kpi icon={Clock} label="Consultas hoy" value={resumen?.consultas_hoy} />
        <Kpi icon={Users} label="Pacientes" value={resumen?.total_usuarios} />
        <Kpi icon={Timer} label="Llegada prom. (min)" value={tiempoLlegada} />
      </div>

      {/* KPIs SECUNDARIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi icon={HeartPulse} label="Total médicos" value={resumen?.total_medicos} />
        <Kpi icon={UserRound} label="Total enfermeros" value={resumen?.total_enfermeros} />
        <Kpi icon={Clock} label="Atención prom. (min)" value={tiempoAtencion} />
      </div>

      {/* MAPA */}
      <Card className="bg-white/10 backdrop-blur border border-white/20 text-white">
        <CardContent className="p-4 space-y-4 text-white">
          <div className="flex items-center gap-2 text-white">
            <MapPinned className="w-5 h-5 text-white" />
            <h2 className="font-semibold text-lg text-white">
              Profesionales activos con ubicación
            </h2>
          </div>

          <div className="h-[320px] md:h-[420px] rounded-lg overflow-hidden">
            <Map />
          </div>

          <TablaProfesionales data={profesionales} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ========================= */
/* KPI CARD */
/* ========================= */
function Kpi({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: number;
  icon: any;
}) {
  return (
    <Card className="bg-white/10 backdrop-blur border border-white/20 text-white">
      <CardContent className="p-4 flex items-center gap-4 text-white">
        <div className="p-3 rounded-xl bg-white/10 text-white">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-white">
          <p className="text-xs text-white/70">{label}</p>
          <p className="text-2xl font-bold text-white">
            {value ?? "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ========================= */
/* TABLA PROFESIONALES */
/* ========================= */
function TablaProfesionales({ data }: { data: Profesional[] }) {
  if (!data.length) {
    return (
      <div className="text-sm text-white/60">
        No hay profesionales activos con ubicación.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden text-white">
      <table className="w-full text-xs md:text-sm text-white">
        <thead className="bg-white/10 text-white">
          <tr>
            <th className="px-3 py-2 text-left text-white">Nombre</th>
            <th className="px-3 py-2 text-left text-white">Tipo</th>
            <th className="px-3 py-2 text-left text-white">Matrícula</th>
            <th className="px-3 py-2 text-left text-white">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-t border-white/5 text-white">
              <td className="px-3 py-2 font-medium text-white">{p.nombre}</td>
              <td className="px-3 py-2 text-white">{p.tipo}</td>
              <td className="px-3 py-2 text-white">{p.matricula || "—"}</td>
              <td className="px-3 py-2 text-white">{p.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
