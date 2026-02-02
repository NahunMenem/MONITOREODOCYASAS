"use client";

import Sidebar from "@/components/sidebar";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Filter,
  Activity,
  CheckCircle,
  Clock,
  Truck,
  Home,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/* 👉 ALERT DIALOG */
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API = process.env.NEXT_PUBLIC_API_BASE!;

/* ===================== */
/* TIPOS */
/* ===================== */
type Consulta = {
  id: number;
  creado_en: string;
  estado: string;
  motivo: string;
  metodo_pago: string;
  direccion: string;
  paciente: string;
  profesional: string;
  tipo: string;
  inicio_atencion: string | null;
  fin_atencion: string | null;
  duracion_min: number | null;
};

/* ===================== */
/* PAGE */
/* ===================== */
export default function MonitoreoConsultasPage() {
  const hoy = new Date().toISOString().slice(0, 10);

  const [desde, setDesde] = useState(hoy);
  const [hasta, setHasta] = useState(hoy);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/monitoreo/consultas?desde=${desde}&hasta=${hasta}`
      );
      const data = await res.json();
      setConsultas(data.consultas || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  /* ===================== */
  /* ELIMINAR CONSULTA */
  /* ===================== */
  const eliminarConsulta = async (id: number) => {
    try {
      const res = await fetch(`${API}/monitoreo/consultas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setConsultas((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("No se pudo eliminar la consulta");
    }
  };

  /* ===================== */
  /* KPIs */
  /* ===================== */
  const totalConsultas = consultas.length;

  const kpiMap = useMemo(() => {
    const map: Record<string, number> = {};
    consultas.forEach((c) => {
      map[c.estado] = (map[c.estado] || 0) + 1;
    });
    return map;
  }, [consultas]);

  const estados = [
    { key: "pendiente", label: "Pendientes", icon: Clock },
    { key: "aceptada", label: "Aceptadas", icon: CheckCircle },
    { key: "en_camino", label: "En camino", icon: Truck },
    { key: "en_domicilio", label: "En domicilio", icon: Home },
    { key: "finalizada", label: "Finalizadas", icon: Activity },
  ];

  const estadoBadge = (estado: string) => (
    <Badge className="bg-[var(--docya-primary)]/20 text-white border border-[var(--docya-primary)]">
      {estado.replace("_", " ")}
    </Badge>
  );

  return (
    <div className="flex min-h-screen bg-[var(--docya-dark-1)] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto text-white">
        {/* ===================== */}
        {/* FILTROS */}
        {/* ===================== */}
        <Card className="bg-[var(--docya-dark-2)] border-[var(--docya-dark-3)] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter size={18} /> Consultas – Monitoreo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 text-white">
            <div>
              <label className="text-sm flex items-center gap-1 text-white">
                <Calendar size={14} /> Desde
              </label>
              <Input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="bg-[var(--docya-dark-3)] border-none text-white"
              />
            </div>
            <div>
              <label className="text-sm flex items-center gap-1 text-white">
                <Calendar size={14} /> Hasta
              </label>
              <Input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                className="bg-[var(--docya-dark-3)] border-none text-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchConsultas}
                disabled={loading}
                className="bg-[var(--docya-primary)] text-white font-semibold"
              >
                {loading ? "Cargando..." : "Filtrar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ===================== */}
        {/* KPIs */}
        {/* ===================== */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="bg-[var(--docya-dark-2)] text-white">
            <CardContent className="p-4 text-white">
              <p className="text-sm flex items-center gap-1 text-white">
                <Activity size={14} /> Total
              </p>
              <p className="text-2xl font-bold text-white">{totalConsultas}</p>
            </CardContent>
          </Card>

          {estados.map((e) => {
            const Icon = e.icon;
            return (
              <Card key={e.key} className="bg-[var(--docya-dark-2)] text-white">
                <CardContent className="p-4 text-white">
                  <p className="text-sm flex items-center gap-1 text-white">
                    <Icon size={14} /> {e.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {kpiMap[e.key] || 0}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ===================== */}
        {/* TABLA */}
        {/* ===================== */}
        <Card className="bg-[var(--docya-dark-2)] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity size={18} /> Listado de consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto text-white">
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--docya-dark-3)]">
                  {[
                    "ID",
                    "Fecha",
                    "Estado",
                    "Paciente",
                    "Profesional",
                    "Tipo",
                    "Pago",
                    "Dirección",
                    "Duración",
                    "Acciones",
                  ].map((h) => (
                    <TableHead key={h} className="text-white">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {consultas.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-[var(--docya-dark-3)] text-white"
                  >
                    <TableCell className="text-white">{c.id}</TableCell>
                    <TableCell className="text-white">
                      {format(new Date(c.creado_en), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell className="text-white">
                      {estadoBadge(c.estado)}
                    </TableCell>
                    <TableCell className="text-white">{c.paciente}</TableCell>
                    <TableCell className="text-white">{c.profesional}</TableCell>
                    <TableCell className="text-white">{c.tipo}</TableCell>
                    <TableCell className="text-white">{c.metodo_pago}</TableCell>
                    <TableCell className="max-w-xs truncate text-white">
                      {c.direccion}
                    </TableCell>
                    <TableCell className="text-white">
                      {c.duracion_min ? `${c.duracion_min} min` : "-"}
                    </TableCell>

                    <TableCell className="text-right text-white">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="bg-[#0F2027] text-white border border-[#2C5364] shadow-2xl rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white text-lg font-semibold">
                              ¿Eliminar consulta?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/80">
                              Esta acción es{" "}
                              <span className="font-semibold text-red-400">
                                irreversible
                              </span>
                              .
                              <br />
                              La consulta se eliminará de forma permanente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="bg-[#203A43] text-white border border-white/20 hover:bg-[#2C5364]">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => eliminarConsulta(c.id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
