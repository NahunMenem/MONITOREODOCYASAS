"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";

import RegistrarPacienteForm from "@/app/usuarios/registrar-paciente-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ModalNuevoUsuario({
  open,
  onClose,
  onSuccess,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* OVERLAY OSCURO */}
      <DialogOverlay className="bg-black/70 backdrop-blur-sm" />

      {/* MODAL SÓLIDO */}
      <DialogContent
        className="
          max-w-3xl
          bg-[var(--docya-dark-2)]
          text-white
          border border-[var(--docya-dark-3)]
          shadow-2xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Nuevo paciente
          </DialogTitle>
        </DialogHeader>

        <RegistrarPacienteForm
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
