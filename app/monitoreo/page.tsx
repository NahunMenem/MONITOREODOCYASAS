"use client";

import dynamic from "next/dynamic";
import { MapPinned } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/sidebar"; // 👈 TU sidebar existente

// Mapa sin SSR
const MapaMedicos = dynamic(
  () => import("../dashboard/mapa-medicos"),
  { ssr: false }
);

export default function MonitoreoPage() {
  return (
    <div className="flex h-screen w-full text-white">
      {/* SIDEBAR EXISTENTE */}
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-4 md:px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur">
          <div className="flex items-center gap-2">
            <MapPinned className="w-5 h-5 text-white" />
            <h1 className="text-lg md:text-2xl font-semibold">
              Monitoreo en tiempo real
            </h1>
          </div>
          <p className="text-xs md:text-sm text-white/70">
            Profesionales conectados y disponibles — DocYa
          </p>
        </div>

        {/* MAPA FULL */}
        <div className="flex-1 p-3 md:p-4 overflow-hidden">
          <Card className="h-full bg-white/5 backdrop-blur border border-white/10">
            <CardContent className="p-2 md:p-3 h-full">
              <div className="h-full w-full rounded-lg overflow-hidden">
                <MapaMedicos />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
