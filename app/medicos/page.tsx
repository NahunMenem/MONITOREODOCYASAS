"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldOff,
  Search,
  Users,
  Image as ImageIcon,
  X,
  Wifi,
  Pencil,
  Trash2,
  MessageCircle, // 👈 NUEVO
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API = process.env.NEXT_PUBLIC_API_BASE!;


type Medico = {
  id: number;
  full_name: string;
  email: string;
  telefono: string;
  matricula: string;
  especialidad: string;
  provincia: string;
  localidad: string;
  tipo: "medico" | "enfermero";
  validado: boolean;
  matricula_validada: boolean;
  ultimo_ping?: string | null;
  foto_perfil?: string;
  foto_dni_frente?: string;
  foto_dni_dorso?: string;
  selfie_dni?: string;
};

export default function MedicosPage() {
  const [fotoGrande, setFotoGrande] = useState<string | null>(null);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "medico" | "enfermero">(
    "todos"
  );
  const [fotoMedico, setFotoMedico] = useState<Medico | null>(null);
  const [editarMedico, setEditarMedico] = useState<Medico | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // ===============================
  // 📡 FETCH
  // ===============================
  const fetchMedicos = async () => {
    const res = await fetch(`${API}/monitoreo/medicos_registrados`);
    const data = await res.json();
    setMedicos(data.medicos || []);
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  // ===============================
  // 🔍 FILTROS
  // ===============================
  const medicosFiltrados = useMemo(() => {
    return medicos
      .filter((m) => {
        const texto =
          `${m.full_name} ${m.email} ${m.telefono} ${m.matricula}`.toLowerCase();
        const matchTexto = texto.includes(search.toLowerCase());
        const matchTipo =
          tipoFiltro === "todos" ? true : m.tipo === tipoFiltro;
        return matchTexto && matchTipo;
      })
      .sort((a, b) => {
        if (!a.ultimo_ping && !b.ultimo_ping) return 0;
        if (!a.ultimo_ping) return 1;
        if (!b.ultimo_ping) return -1;
        return (
          new Date(b.ultimo_ping).getTime() -
          new Date(a.ultimo_ping).getTime()
        );
      });
  }, [medicos, search, tipoFiltro]);

  // ===============================
  // 🔐 ACCESO APP
  // ===============================
  const toggleAcceso = async (m: Medico) => {
    setLoadingId(m.id);
    try {
      await fetch(`${API}/monitoreo/validar_matricula/${m.id}`, {
        method: "PUT",
      });
      fetchMedicos();
    } finally {
      setLoadingId(null);
    }
  };

  const formatPing = (ping?: string | null) => {
    if (!ping) return "Nunca conectado";
    return new Date(ping).toLocaleString("es-AR");
  };

  return (
    <div className="flex min-h-screen bg-[var(--docya-dark-1)] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto text-white">
        {/* 🔎 FILTROS */}
        <Card className="bg-[var(--docya-dark-2)] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users size={18} /> Profesionales
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 text-white" size={16} />
              <Input
                placeholder="Buscar por nombre, email, matrícula, teléfono…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-[var(--docya-dark-3)] text-white border-none placeholder:text-slate-300"
              />
            </div>

            <div className="flex gap-2">
              {["todos", "medico", "enfermero"].map((t) => (
                <Button
                  key={t}
                  variant={tipoFiltro === t ? "default" : "outline"}
                  className="text-black border-white"
                  onClick={() => setTipoFiltro(t as any)}
                >
                  {t === "todos"
                    ? "Todos"
                    : t === "medico"
                    ? "Médicos"
                    : "Enfermeros"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 📋 LISTADO */}
        {medicosFiltrados.map((m) => (
          <Card
            key={m.id}
            className={`bg-[var(--docya-dark-2)] text-white border-l-4 ${
              m.tipo === "medico"
                ? "border-[var(--docya-primary)]"
                : "border-blue-500"
            }`}
          >
            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4 text-white">
              {/* DATOS */}
              <div className="space-y-1 text-white">
                <p className="font-semibold flex items-center gap-1">
                  <User size={14} /> {m.full_name}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Mail size={14} /> {m.email}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Phone size={14} /> {m.telefono}
                </p>
                <p className="text-sm">
                  <b>{m.tipo.toUpperCase()}</b> · {m.especialidad}
                </p>
                <p className="text-sm">Matrícula: {m.matricula}</p>
                <p className="text-sm">
                  {m.localidad}, {m.provincia}
                </p>

                <p className="text-sm flex items-center gap-1 mt-2">
                  <Wifi size={14} />
                  Última conexión: {formatPing(m.ultimo_ping)}
                </p>

                <Badge className="mt-2 bg-transparent border border-white text-white">
                  {m.validado ? "Identidad validada" : "No validado"}
                </Badge>
              </div>

              {/* ACCIONES */}
              <div className="flex flex-col gap-2 text-red">

                <Button
                  variant="outline"
                  className="text-black border-green-500 hover:bg-green-600/20"
                  onClick={() => {
                    const telefonoLimpio = m.telefono?.replace(/\D/g, "");
                    if (!telefonoLimpio) return alert("El médico no tiene teléfono cargado");

                    window.open(
                      `https://wa.me/${telefonoLimpio}`,
                      "_blank"
                    );
                  }}
                >
                  <MessageCircle size={16} className="text-green-500" />
                  WhatsApp
                </Button>


                <Button
                  variant="outline"
                  className="text-black border-white"
                  onClick={() => setFotoMedico(m)}
                >
                  <ImageIcon size={16} /> Ver fotos
                </Button>

                <Button
                  variant="outline"
                  className="text-black border-white"
                  onClick={() => setEditarMedico(m)}
                >
                  <Pencil size={16} /> Editar
                </Button>

                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!confirm(`¿Eliminar a ${m.full_name}?`)) return;
                    await fetch(`${API}/monitoreo/medicos/${m.id}`, {
                      method: "DELETE",
                    });
                    fetchMedicos();
                  }}
                >
                  <Trash2 size={16} /> Eliminar
                </Button>

                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={m.matricula_validada}
                    onChange={() => toggleAcceso(m)}
                    disabled={loadingId === m.id}
                  />
                  <ShieldCheck size={16} /> Acceso habilitado
                </label>

                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={!m.matricula_validada}
                    onChange={() => toggleAcceso(m)}
                    disabled={loadingId === m.id}
                  />
                  <ShieldOff size={16} /> Acceso bloqueado
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* 🖼️ MODAL FOTOS */}
      {/* 🖼️ MODAL FOTOS */}
      {fotoMedico && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 text-white"
          onClick={() => setFotoMedico(null)}
        >
          <div
            className="bg-[var(--docya-dark-2)] p-6 rounded-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 z-50 bg-black/60 rounded p-1 hover:bg-black/80"
              onClick={() => setFotoMedico(null)}
            >
              <X className="text-white" />
            </button>

            <h2 className="text-lg font-bold mb-4">
              Fotos – {fotoMedico.full_name}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                fotoMedico.foto_perfil,
                fotoMedico.foto_dni_frente,
                fotoMedico.foto_dni_dorso,
                fotoMedico.selfie_dni,
              ].map(
                (f, i) =>
                  f && (
                    <img
                      key={i}
                      src={f}
                      onClick={() => setFotoGrande(f)}
                      className="rounded border border-white object-contain cursor-pointer hover:opacity-80 transition"
                    />
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔍 MODAL FOTO GRANDE */}
      {fotoGrande && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          onClick={() => setFotoGrande(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3 z-50 bg-black/70 rounded-full p-2 hover:bg-black"
              onClick={() => setFotoGrande(null)}
            >
              <X className="text-white" />
            </button>

            <img
              src={fotoGrande}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}




      {/* ✏️ MODAL EDITAR */}
      {editarMedico && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white">
          <div className="bg-[var(--docya-dark-2)] p-6 rounded max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">
              Editar – {editarMedico.full_name}
            </h2>

            {[
              "full_name",
              "email",
              "telefono",
              "especialidad",
              "provincia",
              "localidad",
            ].map((field) => (
              <Input
                key={field}
                className="mb-2 bg-[var(--docya-dark-3)] text-white placeholder:text-slate-300"
                value={(editarMedico as any)[field]}
                onChange={(e) =>
                  setEditarMedico({
                    ...editarMedico,
                    [field]: e.target.value,
                  })
                }
              />
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                className="text-black border-white"
                onClick={() => setEditarMedico(null)}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  await fetch(
                    `${API}/monitoreo/medicos/${editarMedico.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(editarMedico),
                    }
                  );
                  setEditarMedico(null);
                  fetchMedicos();
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
