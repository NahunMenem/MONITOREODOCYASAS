"use client";

import { Button } from "@/components/ui/button";

type Liquidacion = {
  id: number;
  medico: string;
  semana_inicio: string;
  semana_fin: string;
  neto_mp: number;
  comision_efectivo: number;
  monto_final: number;
  telefono?: string; // ← si lo tenés en backend, mejor
};

type Props = {
  liquidacion: Liquidacion;
  onClose: () => void;
  onEnviar: (id: number) => void;
};

export default function ModalDetalleLiquidacion({
  liquidacion,
  onClose,
  onEnviar,
}: Props) {
  console.log("TEL:", liquidacion.telefono);
  const enviarWhatsapp = () => {
    if (!liquidacion.telefono) {
      alert("El profesional no tiene teléfono cargado");
      return;
    }

    const mensaje = `
DocYa – Liquidación semanal

Profesional: ${liquidacion.medico}
Semana: ${liquidacion.semana_inicio} → ${liquidacion.semana_fin}

Ingresos por App (neto): $${liquidacion.neto_mp.toLocaleString()}
Comisión DocYa (efectivo): -$${liquidacion.comision_efectivo.toLocaleString()}

Total a cobrar: $${liquidacion.monto_final.toLocaleString()}

ℹ️ Pagos por App incluyen comisión de Mercado Pago.
ℹ️ En efectivo se descuenta únicamente el 20% de DocYa.

Gracias por trabajar con DocYa.
    `.trim();

    const url = `https://wa.me/${liquidacion.telefono}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-[var(--docya-dark-1)] p-6 text-white shadow-xl">
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
            alt="DocYa"
            className="h-10"
          />
        </div>

        <h2 className="text-xl font-bold text-center text-white">
          Liquidación semanal cerrada
        </h2>

        <p className="mt-1 text-center text-white/70 text-sm">
          Detalle de ingresos y descuentos aplicados
        </p>

        {/* CONTENIDO */}
        <div className="mt-6 space-y-3 rounded-xl bg-white/10 p-4 text-sm text-white">
          <div className="flex justify-between">
            <span className="text-white/70">Profesional</span>
            <span className="font-medium">{liquidacion.medico}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Semana</span>
            <span>
              {liquidacion.semana_inicio} → {liquidacion.semana_fin}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Ingresos App (neto)</span>
            <span>${liquidacion.neto_mp.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Comisión Mercado Pago</span>
            <span className="text-white/60">Incluida (≈ 6,29% + IVA)</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/70">Comisión DocYa (20% efectivo)</span>
            <span className="text-red-400">
              -${liquidacion.comision_efectivo.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-white/20 pt-3 flex justify-between font-bold">
            <span>Total a cobrar</span>
            <span className="text-emerald-400">
              ${liquidacion.monto_final.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ACLARACIÓN */}
        <p className="mt-3 text-xs text-white/60 text-center">
          Los pagos realizados por App incluyen comisión de Mercado Pago.
          En efectivo no se aplica comisión de MP.
        </p>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={enviarWhatsapp}
          >
            Enviar por WhatsApp
          </Button>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onEnviar(liquidacion.id)}
          >
            Marcar como enviada
          </Button>
        </div>
      </div>
    </div>
  );
}
