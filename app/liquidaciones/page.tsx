"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const API = process.env.NEXT_PUBLIC_API_BASE!;


/* ===================== */
/* TIPOS */
/* ===================== */
type PreviewMedico = {
  medico_id: number;
  medico: string;
  resumen: {
    cantidad_consultas: number;
    total_efectivo: number;
    total_digital: number;
    docya_comision_total: number;
    a_pagar_medico: number;
  };
};

type Liquidacion = {
  id: number;
  medico: string;
  semana_inicio: string;
  semana_fin: string;
  neto_mp: number;
  comision_efectivo: number;
  monto_final: number;
  estado: string;
};

/* ===================== */
/* PAGE */
/* ===================== */
export default function LiquidacionesPage() {
  const [preview, setPreview] = useState<PreviewMedico[]>([]);
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [liquidacionActiva, setLiquidacionActiva] =
    useState<Liquidacion | null>(null);

  const loadPreview = () =>
    fetch(`${API}/monitoreo/liquidaciones/preview_semana_actual`)
      .then((r) => r.json())
      .then((d) => setPreview(d.medicos || []));

  const loadLiquidaciones = () =>
    fetch(`${API}/monitoreo/liquidaciones`)
      .then((r) => r.json())
      .then((d) => setLiquidaciones(d.liquidaciones || []));

  useEffect(() => {
    loadPreview();
    loadLiquidaciones();
  }, []);

  const generarSemanaAnterior = async () => {
    setLoading(true);
    try {
      await fetch(
        `${API}/monitoreo/liquidaciones/generar_semana_anterior`,
        { method: "POST" }
      );
      loadLiquidaciones();
    } finally {
      setLoading(false);
    }
  };

  const enviarDetalle = async () => {
    if (!liquidacionActiva) return;

    await fetch(
      `${API}/monitoreo/liquidaciones/${liquidacionActiva.id}/enviar_detalle`,
      { method: "POST" }
    );

    setLiquidacionActiva(null);
  };

  return (
    <div className="flex min-h-screen bg-[var(--docya-dark-1)] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-8 overflow-y-auto text-white">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Liquidaciones profesionales
          </h1>
          <p className="text-white/70">
            Ingresos por profesional y tipo de pago
          </p>
        </div>
        {/* INFO TARIFAS Y LIQUIDACIÓN */}
        <Card className="bg-white/5 border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              Reglas de liquidación y tarifas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-white">
            <p className="text-white/80">
              Las liquidaciones se calculan automáticamente según el tipo de
              profesional, el horario de atención y el método de pago.
            </p>

            {/* HORARIOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">
                  🕖 Horario diurno
                </h4>
                <p className="text-white/70">
                  Desde las <b>06:00</b> hasta las <b>21:59</b>
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">
                  🌙 Horario nocturno
                </h4>
                <p className="text-white/70">
                  Desde las <b>22:00</b> hasta las <b>05:59</b>
                </p>
              </div>
            </div>

            {/* TARIFAS */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">
                💰 Tarifas por consulta
              </h4>

              <table className="w-full text-sm text-white border border-white/20">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-left">Profesional</th>
                    <th className="p-2 text-center">Diurna</th>
                    <th className="p-2 text-center">Nocturna</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="p-2">Médico</td>
                    <td className="p-2 text-center">$30.000</td>
                    <td className="p-2 text-center">$40.000</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-2">Enfermero</td>
                    <td className="p-2 text-center">$20.000</td>
                    <td className="p-2 text-center">$30.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* METODO DE PAGO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">
                  💳 Pagos por App
                </h4>
                <ul className="space-y-1 text-white/70">
                  <li>• Se descuenta comisión de Mercado Pago</li>
                  <li>• Sobre el neto real, DocYa aplica 20%</li>
                  <li>• El monto final ya incluye todos los descuentos</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">
                  💵 Pagos en efectivo
                </h4>
                <ul className="space-y-1 text-white/70">
                  <li>• No tiene comisión de Mercado Pago</li>
                  <li>• DocYa descuenta únicamente el 20%</li>
                  <li>• El descuento se compensa en la liquidación</li>
                </ul>
              </div>
            </div>

            <p className="text-white/60 text-xs">
              Todos los montos mostrados en esta pantalla ya están calculados
              automáticamente según estas reglas.
            </p>
          </CardContent>
        </Card>

        {/* PREVIEW SEMANA ACTUAL */}
        <Card className="bg-white/10 border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              Semana actual (preview)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <table className="w-full text-sm text-white">
              <thead className="bg-white/10 text-white">
                <tr>
                  <th className="p-2 text-left text-white">Profesional</th>
                  <th className="p-2 text-center text-white">Consultas</th>
                  <th className="p-2 text-center text-white">Efectivo</th>
                  <th className="p-2 text-center text-white">App</th>
                  <th className="p-2 text-center text-white">A pagar</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((m) => (
                  <tr key={m.medico_id} className="border-t border-white/10">
                    <td className="p-2 font-medium text-white">{m.medico}</td>
                    <td className="p-2 text-center text-white">
                      {m.resumen.cantidad_consultas}
                    </td>
                    <td className="p-2 text-center text-white">
                      ${m.resumen.total_efectivo.toLocaleString()}
                    </td>
                    <td className="p-2 text-center text-white">
                      ${m.resumen.total_digital.toLocaleString()}
                    </td>
                    <td className="p-2 text-center font-bold text-white">
                      ${m.resumen.a_pagar_medico.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ACCIÓN */}
        <Button
          onClick={generarSemanaAnterior}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Cerrar y generar liquidación semana anterior
        </Button>

        {/* HISTÓRICO */}
        <Card className="bg-white/10 border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              Histórico de liquidaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <table className="w-full text-sm text-white">
              <thead className="bg-white/10 text-white">
                <tr>
                  <th className="p-2 text-left text-white">Profesional</th>
                  <th className="p-2 text-left text-white">Semana</th>
                  <th className="p-2 text-center text-white">Monto final</th>
                  <th className="p-2 text-center text-white">Estado</th>
                  <th className="p-2 text-center text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {liquidaciones.map((l) => (
                  <tr key={l.id} className="border-t border-white/10">
                    <td className="p-2 text-white">{l.medico}</td>
                    <td className="p-2 text-white">
                      {l.semana_inicio} → {l.semana_fin}
                    </td>
                    <td className="p-2 text-center font-bold text-white">
                      ${l.monto_final.toLocaleString()}
                    </td>
                    <td className="p-2 text-center text-white">
                      <Badge
                        className={
                          l.estado === "pagado"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-white"
                        }
                      >
                        {l.estado}
                      </Badge>
                    </td>
                    <td className="p-2 text-center text-white">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => setLiquidacionActiva(l)}
                      >
                        Enviar detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {/* MODAL SHADCN */}
      <Dialog
        open={!!liquidacionActiva}
        onOpenChange={() => setLiquidacionActiva(null)}
      >
        <DialogContent className="bg-[var(--docya-dark-1)] text-white border border-white/20">
          <DialogHeader className="text-white">
            <div className="flex justify-center mb-2">
              <img
                src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
                className="h-10"
              />
            </div>
            <DialogTitle className="text-center text-white">
              Liquidación semanal cerrada
            </DialogTitle>
          </DialogHeader>

          {liquidacionActiva && (
            <div className="space-y-3 bg-white/10 p-4 rounded-xl text-sm text-white">
              <div className="flex justify-between">
                <span className="text-white/70">Profesional</span>
                <span className="text-white">
                  {liquidacionActiva.medico}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Semana</span>
                <span className="text-white">
                  {liquidacionActiva.semana_inicio} →{" "}
                  {liquidacionActiva.semana_fin}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Ingresos App</span>
                <span className="text-white">
                  ${liquidacionActiva.neto_mp.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">
                  Comisión DocYa (efectivo)
                </span>
                <span className="text-red-400">
                  -${liquidacionActiva.comision_efectivo.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                <span className="text-white">Total a cobrar</span>
                <span className="text-emerald-400">
                  ${liquidacionActiva.monto_final.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setLiquidacionActiva(null)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={enviarDetalle}
            >
              Enviar al profesional
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
