"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Activity,
  Users,
  Stethoscope,
  Wallet,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ===================== */
/* MENU */
/* ===================== */
const menu = [
  {
    label: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Monitoreo",
    href: "/monitoreo",
    icon: Activity,
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: UserCog, // 👈 usuarios / admin
  },
  {
    label: "Médicos",
    href: "/medicos",
    icon: Stethoscope,
  },
  {
    label: "Consultas",
    href: "/consultas",
    icon: Users,
  },
  {
    label: "Liquidaciones",
    href: "/liquidaciones",
    icon: Wallet,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ───────── MOBILE TOPBAR ───────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0F2027] border-b border-white/10 flex items-center justify-between px-4">
        <img
          src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
          alt="DocYa"
          className="h-7"
        />

        <button onClick={() => setOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* ───────── MOBILE OVERLAY ───────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ───────── SIDEBAR DRAWER (mobile) ───────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[#0F2027] border-r border-white/10 transform transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
          <img
            src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
            alt="DocYa"
            className="h-7"
          />
          <button onClick={() => setOpen(false)} className="text-white">
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-[var(--docya-primary)] text-black font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ───────── DESKTOP SIDEBAR ───────── */}
      <aside className="hidden md:flex w-64 min-h-screen bg-[#0F2027] border-r border-white/10 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <img
            src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
            alt="DocYa"
            className="h-10"
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition",
                  active
                    ? "bg-[var(--docya-primary)] text-black font-semibold"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-white/50">
          DocYa © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}
