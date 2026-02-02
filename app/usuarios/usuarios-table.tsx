"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Usuario } from "@/app/usuarios/page";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  usuarios: Usuario[];
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function UsuariosTable({ usuarios }: Props) {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const abrirEditar = (u: Usuario) => {
    setUsuario(u);
    setOpen(true);
  };

  const guardar = async () => {
    if (!usuario) return;

    try {
      setLoading(true);

      await fetch(`${API}/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: usuario.full_name,
          email: usuario.email,
          telefono: usuario.telefono,
          role: usuario.role,
          validado: usuario.validado,
        }),
      });

      setOpen(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-10 text-white/60">
        No se encontraron usuarios
      </div>
    );
  }

  return (
    <>
      {/* ================= TABLA ================= */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--docya-dark-3)]">
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">DNI</TableHead>
              <TableHead className="text-white">Teléfono</TableHead>
              <TableHead className="text-white">Rol</TableHead>
              <TableHead className="text-white">Estado</TableHead>
              <TableHead className="text-white text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usuarios.map((u) => (
              <TableRow
                key={u.id}
                className="border-[var(--docya-dark-3)] hover:bg-white/5"
              >
                <TableCell className="text-white">
                  {u.full_name || "-"}
                </TableCell>

                <TableCell className="text-white">
                  {u.email || "-"}
                </TableCell>

                <TableCell className="text-white">
                  {u.dni || "-"}
                </TableCell>

                <TableCell className="text-white">
                  {u.telefono || "-"}
                </TableCell>

                <TableCell className="text-white capitalize">
                  {u.role}
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      u.validado
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }
                  >
                    {u.validado ? "Validado" : "Pendiente"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => abrirEditar(u)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= MODAL EDITAR ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            bg-[#0b1f1c]
            border border-white/10
            text-white
            max-w-md
            rounded-xl
            shadow-2xl
          "
        >

          <DialogHeader>
            <DialogTitle className="text-white">
              Editar usuario
            </DialogTitle>
          </DialogHeader>

          {usuario && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Nombre completo</Label>
                <Input
                  value={usuario.full_name || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, full_name: e.target.value })
                  }
                  className="text-white"
                />
              </div>

              <div>
                <Label className="text-white">Email</Label>
                <Input
                  value={usuario.email || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, email: e.target.value })
                  }
                  className="text-white"
                />
              </div>

              <div>
                <Label className="text-white">Teléfono</Label>
                <Input
                  value={usuario.telefono || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, telefono: e.target.value })
                  }
                  className="text-white"
                />
              </div>

              <div>
                <Label className="text-white">Rol</Label>
                <Input
                  value={usuario.role || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, role: e.target.value })
                  }
                  className="text-white capitalize"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label className="text-white">Usuario validado</Label>
                <Switch
                  checked={usuario.validado}
                  onCheckedChange={(v) =>
                    setUsuario({ ...usuario, validado: v })
                  }
                />
              </div>

              <Button
                onClick={guardar}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
