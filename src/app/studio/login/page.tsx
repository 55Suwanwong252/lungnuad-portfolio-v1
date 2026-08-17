"use client";

import { FormEvent, Suspense, useState } from "react";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/studio";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("รหัสผ่านไม่ถูกต้อง");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-icon"><ShieldCheck /></div>
        <span className="eyebrow">PRIVATE STUDIO</span>
        <h1>Admin Login</h1>
        <p>เข้าสู่ Content Studio เพื่อจัดการ Reel และ Media ของเว็บไซต์</p>

        <label>
          <span>Password</span>
          <div className="admin-password-field">
            <LockKeyhole />
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
        </label>

        {error && <div className="admin-login-error">{error}</div>}

        <button className="admin-login-button" disabled={!password || loading}>
          <LogIn /> {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ Studio"}
        </button>
        <small>Build 07 · Reel Library Manager</small>
      </form>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login-page">
          <div className="admin-login-card"><p>Loading...</p></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
