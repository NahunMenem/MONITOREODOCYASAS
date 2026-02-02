"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAdmin } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginAdmin(email, password);

      // 🔐 Guardamos token y datos mínimos
      localStorage.setItem("docya_token", data.access_token);
      localStorage.setItem("docya_admin", JSON.stringify(data.admin));

      router.push("/dashboard");
    } catch (err) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl">
      <CardHeader className="flex flex-col items-center space-y-4">
        <img
          src="https://res.cloudinary.com/dqsacd9ez/image/upload/v1757197807/logoblanco_1_qdlnog.png"
          alt="DocYa"
          className="h-16"
        />

        <CardTitle className="text-white text-2xl font-bold">
          DocYa Monitoreo
        </CardTitle>

        <p className="text-white/70 text-sm">
          Acceso exclusivo para el equipo
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              placeholder="admin@docya.com.ar"
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus-visible:ring-[var(--docya-primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus-visible:ring-[var(--docya-primary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--docya-primary)] text-black hover:brightness-110"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
