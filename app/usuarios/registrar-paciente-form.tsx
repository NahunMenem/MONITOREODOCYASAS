"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_BASE!;

const PROVINCIAS = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

type Props = {
  onSuccess: () => void;
};

export default function RegistrarPacienteForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [cargandoLocalidades, setCargandoLocalidades] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    dni: "",
    telefono: "",
    pais: "Argentina",
    provincia: "",
    localidad: "",
    fecha_nacimiento: "",
    sexo: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===================== */
  /* LOCALIDADES */
  /* ===================== */
  useEffect(() => {
    if (!form.provincia) {
      setLocalidades([]);
      setForm((f) => ({ ...f, localidad: "" }));
      return;
    }

    const fetchLocalidades = async () => {
      setCargandoLocalidades(true);
      try {
        const res = await fetch(
          `${API}/localidades/${encodeURIComponent(form.provincia)}`
        );
        const data = await res.json();
        setLocalidades(data.localidades || []);
      } finally {
        setCargandoLocalidades(false);
      }
    };

    fetchLocalidades();
  }, [form.provincia]);

  /* ===================== */
  /* REGISTRAR */
  /* ===================== */
  const registrar = async () => {
    if (!acepto) {
      alert("Debe aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          acepto_condiciones: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error al registrar paciente");
        return;
      }

      alert("Paciente registrado correctamente. Email enviado.");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
      <div>
        <Label className="text-white">Nombre completo</Label>
        <Input name="full_name" value={form.full_name} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Email</Label>
        <Input name="email" type="email" value={form.email} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Contraseña</Label>
        <Input name="password" type="password" value={form.password} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">DNI</Label>
        <Input name="dni" value={form.dni} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Teléfono</Label>
        <Input name="telefono" value={form.telefono} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Sexo</Label>
        <Input name="sexo" value={form.sexo} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Fecha de nacimiento</Label>
        <Input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={onChange} className="bg-[var(--docya-dark-3)] text-white" />
      </div>

      <div>
        <Label className="text-white">Provincia</Label>
        <select
          name="provincia"
          value={form.provincia}
          onChange={onChange}
          className="w-full h-10 rounded-md bg-[var(--docya-dark-3)] text-white px-3"
        >
          <option value="">Seleccionar provincia</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <Label className="text-white">Localidad</Label>
        <select
          name="localidad"
          value={form.localidad}
          onChange={onChange}
          disabled={!form.provincia || cargandoLocalidades}
          className="w-full h-10 rounded-md bg-[var(--docya-dark-3)] text-white px-3 disabled:opacity-50"
        >
          <option value="">
            {cargandoLocalidades ? "Cargando localidades..." : "Seleccionar localidad"}
          </option>
          {localidades.map((l, i) => (
            <option key={`${l}-${i}`} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="col-span-2 flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={acepto}
          onChange={(e) => setAcepto(e.target.checked)}
          className="w-4 h-4 accent-[var(--docya-primary)]"
        />
        <span className="text-sm text-white">
          Acepto los términos y condiciones
        </span>
      </div>

      <div className="col-span-2 mt-4">
        <Button
          onClick={registrar}
          disabled={loading}
          className="w-full bg-[var(--docya-primary)] text-white font-semibold"
        >
          {loading ? "Registrando..." : "Registrar paciente"}
        </Button>
      </div>
    </div>
  );
}
