"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/studio";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <main className="studio-login-page">
      <section className="studio-login-card">
        <span className="eyebrow">LUNGNUAD PRODUCTION</span>

        <h1>Admin Login</h1>

        <p>เข้าสู่ Content Studio เพื่อจัดการ Reels และเนื้อหาเว็บไซต์</p>

        <form onSubmit={handleSubmit}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoFocus
              required
            />
          </label>

          {error && <div className="studio-login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="studio-login-page">
          <section className="studio-login-card">
            <p>Loading...</p>
          </section>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}