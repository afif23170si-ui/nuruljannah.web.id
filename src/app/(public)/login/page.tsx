"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Berhasil masuk!");
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-zinc-50 relative overflow-hidden">
      {/* Background Pattern - Subtle Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
      
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        {/* Form Container (No Card Style) */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-serif font-medium text-zinc-800">Area Pengurus</h1>
            <p className="text-zinc-500 text-sm">Silakan login untuk mengelola data masjid</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
                className="h-12 bg-zinc-50 border-zinc-200 focus:border-emerald-500 transition-all rounded-xl outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-12 bg-zinc-50 border-zinc-200 focus:border-emerald-500 transition-all rounded-xl outline-none focus:ring-0 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent text-zinc-400 hover:text-zinc-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] hover:shadow-emerald-600/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </Button>
            </div>
          </form>

          <div className="flex justify-center pt-4">
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-700 transition-colors py-2 px-4 rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full pointer-events-none select-none">
        <p className="text-zinc-400/50 text-[10px] uppercase tracking-widest">
          Masjid Nurul Jannah &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
