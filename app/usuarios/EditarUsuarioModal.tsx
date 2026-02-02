"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Usuario } from "@/app/usuarios/page";
import FormEditarUsuario from "./FormEditarUsuario";

type Props = {
  usuario: Usuario | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditarUsuarioModal({
  usuario,
  open,
  onClose,
  onUpdated,
}: Props) {
  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--docya-dark-1)] border-[var(--docya-dark-3)] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Editar usuario
          </DialogTitle>
        </DialogHeader>

        <FormEditarUsuario
          usuario={usuario}
          onSuccess={() => {
            onUpdated();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
