"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/error-message";
import { normalizeNextPath } from "@/lib/routing";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const trimmedEmail = email.trim();
  const isSubmitDisabled = loading || !trimmedEmail || !password;

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    setNextPath(normalizeNextPath(next));
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email: trimmedEmail, password });
      const redirectPath = nextPath ?? "/dashboard";
      router.replace(redirectPath);
    } catch (err) {
      setError(getErrorMessage(err, "Tizimga kirib bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <section className="glass-card auth-layout frame-reveal">
        <aside className="auth-aside">
          <div>
            <h2>Birga yozing, uzilishsiz ishlang.</h2>
            <p>Note oching, hamkorlarni taklif qiling va bitta maydonda real-time ishlang.</p>
          </div>
          <p className="auth-note">
            Xavfsiz JWT autentifikatsiya, real-time sinxron, kommentlar va ixcham versiya tarixi.
          </p>
        </aside>
        <div className="auth-card">
          <h1 className="auth-title">Qaytganingizdan xursandmiz</h1>
          <p className="auth-subtitle">Jamoa bilan ishlashni davom ettirish uchun tizimga kiring.</p>
          <div className="auth-prelude">
            <span className="auth-tag">Xavfsiz kirish</span>
            <p className="auth-prelude-copy">
              Kirishingiz bilan ochiq hujjatlar, izohlar va hamkorlaringiz holati bir joyda ko&apos;rinadi.
            </p>
          </div>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-email">
                Elektron pochta
              </label>
              <input
                className="input"
                id="login-email"
                type="email"
                placeholder="siz@pochta.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                autoComplete="email"
                inputMode="email"
                maxLength={320}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-password">
                Parol
              </label>
              <input
                className="input"
                id="login-password"
                type="password"
                placeholder="Parolingiz"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <p aria-live="polite" className="error-text">
                {error}
              </p>
            ) : null}
            <button className="button" disabled={isSubmitDisabled} type="submit">
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
          <p style={{ marginTop: 16, color: "var(--text-secondary)" }}>
            Akkauntingiz yo&apos;qmi?{" "}
            <Link
              className="inline-link"
              href={
                nextPath
                  ? "/auth/register?next=" + encodeURIComponent(nextPath)
                  : "/auth/register"
              }
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
