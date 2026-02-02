"use client";

import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { UserPlus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UsuariosTable from "@/app/usuarios/usuarios-table";
import ModalNuevoUsuario from "@/app/usuarios/modal-nuevo-usuario";

const API = process.env.NEXT_PUBLIC_API_BASE!;

/* ===================== */
/* TIPOS */
/* ===================== */
export type Usuario = {
  id: number;
  full_name: string | null;
  email: string | null;
  dni: string | null;
  telefono: string | null;
  role: string;
  validado: boolean;
  created_at?: string;
};

/* ===================== */
/* PAGE */
/* ===================== */
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // paginación
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchUsuarios = async () => {
    const res = await fetch(
      `${API}/monitoreo/usuarios?page=${page}&limit=15`
    );
    const data = await res.json();

    setUsuarios(data.usuarios || []);
    setPages(data.pages || 1);
  };

  useEffect(() => {
    fetchUsuarios();
  }, [page]);

  /* ===================== */
  /* BUSCADOR DEFENSIVO */
  /* ===================== */
  const filtrados = usuarios.filter((u) =>
    `${u.full_name || ""} ${u.email || ""} ${u.dni || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[var(--docya-dark-1)] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <Card className="bg-[var(--docya-dark-2)] text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Users size={18} /> Usuarios
            </CardTitle>

            <Button
              onClick={() => setOpen(true)}
              className="bg-[var(--docya-primary)] text-white flex items-center gap-2"
            >
              <UserPlus size={16} />
              Nuevo usuario
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* BUSCADOR */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-white/50"
                size={16}
              />
              <Input
                placeholder="Buscar por nombre, email o DNI"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[var(--docya-dark-3)] text-white border-none"
              />
            </div>

            {/* TABLA */}
            <UsuariosTable usuarios={filtrados} />

            {/* PAGINACIÓN */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-black hover:text-black disabled:text-black/50"
              >
                Anterior
              </Button>


              <span className="text-sm text-white/70">
                Página {page} de {pages}
              </span>

              <Button
                variant="outline"
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="text-black hover:text-black disabled:text-black/50"
              >
                Siguiente
              </Button>

            </div>
          </CardContent>
        </Card>
      </main>

      {/* MODAL NUEVO USUARIO */}
      <ModalNuevoUsuario
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setPage(1); // vuelve a la primera página
          fetchUsuarios();
        }}
      />
    </div>
  );
}
