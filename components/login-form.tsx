"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import type { Role } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi").min(8, "Password minimal 8 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roleRedirect: Record<Role, string> = {
  guest: "/",
  mahasiswa: "/dashboard",
  dosen: "/lecturer",
  tu: "/staff",
  admin: "/admin",
};

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const result = await login(data);
    if (result.success) {
      const user = useAuthStore.getState().user!;
      router.push(roleRedirect[user.role]);
    } else {
      setError("email", { message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          icon={<Mail size={16} className="text-muted" />}
          {...register("email")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 karakter"
          error={errors.password?.message}
          icon={<Lock size={16} className="text-muted" />}
          {...register("password")}
        />
      </div>
      <Button type="submit" className="mt-2" disabled={isLoading}>
        {isLoading ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
