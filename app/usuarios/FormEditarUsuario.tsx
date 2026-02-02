"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Usuario } from "@/app/usuarios/page";

type Props = {
  usuario: Usuario;
  onSuccess: () => void;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function FormEditarUsuario({ usuario, onSuccess }: Props) {
  const [fullName, setFullName] = useState(usuario.full_name || "");
  const [email, setEmail] = useState(usuario.email || "");
  const [telefono, setTelefono] = useState(usuario.telefono || "");
  const [role, setRole] = useState(usuario.role || "");
  const [validado, setValidado] = useState(usuario.validado || false);
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    try {
      setLoading(true);

      await fetch(`${API}/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          telefono,
          role,
          validado,
        }),
      });

      onSuccess();
    } catch (e) {
      console.error("Error editando usuario", e);
      alert("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Nombre completo</Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="text-white"
        />
      </div>

      <div>
        <Label className="text-white">Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-white"
        />
      </div>

      <div>
        <Label className="text-white">Teléfono</Label>
        <Input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="text-white"
        />
      </div>

      <div>
        <Label className="text-white">Rol</Label>
        <Input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-white capitalize"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Label className="text-white">Usuario validado</Label>
        <Switch checked={validado} onCheckedChange={setValidado} />
      </div>

      <Button
        onClick={guardar}
        disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}
