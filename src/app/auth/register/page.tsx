"use client";

import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/error-message";
import { normalizeNextPath } from "@/lib/routing";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const isSubmitDisabled = loading || !trimmedName || !trimmedEmail || password.length < 8;

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
      await register({ name: trimmedName, email: trimmedEmail, password });
      const redirectPath = nextPath ?? "/dashboard";
      router.replace(redirectPath);
    } catch (err) {
      setError(getErrorMessage(err, "Akkaunt yaratib bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <section className="glass-card auth-layout frame-reveal">
        <aside className="auth-aside">
          <div>
            <h2>Jamoaviy hujjat ish maydoningizni yarating.</h2>
            <p>Hamkorlarni taklif qiling, onlayn foydalanuvchilarni ko&apos;ring va o&apos;zgarishlarni bir zumda sinxron qiling.</p>
          </div>
          <p className="auth-note">
            Tezkor jamoaviy yozish, aniq rollar va toza versiya snapshotlari uchun yaratilgan.
          </p>
        </aside>
        <div className="auth-card">
          <h1 className="auth-title">Ish maydonini yarating</h1>
          <p className="auth-subtitle">Jamoangiz bilan hujjat yozishni bir necha soniyada boshlang.</p>
          <div className="auth-prelude">
            <span className="auth-tag">Tez boshlash</span>
            <p className="auth-prelude-copy">
              Ro&apos;yxatdan o&apos;tgach, yangi note ochib bir zumda hamkorlaringizni taklif qilishingiz mumkin.
            </p>
          </div>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-name">
                To&apos;liq ism
              </label>
              <input
                className="input"
                id="register-name"
                type="text"
                placeholder="Ism Familya"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                autoComplete="name"
                maxLength={120}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-email">
                Elektron pochta
              </label>
              <input
                className="input"
                id="register-email"
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
              <label className="auth-field-label" htmlFor="register-password">
                Parol
              </label>
              <input
                className="input"
                id="register-password"
                type="password"
                placeholder="Kamida 8 ta belgi"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            {error ? (
              <p aria-live="polite" className="error-text">
                {error}
              </p>
            ) : null}
            <button className="button" disabled={isSubmitDisabled} type="submit">
              {loading ? "Yaratilmoqda..." : "Akkaunt yaratish"}
            </button>
          </form>
          <p style={{ marginTop: 16, color: "var(--text-secondary)" }}>
            Akkauntingiz bormi?{" "}
            <Link
              className="inline-link"
              href={
                nextPath
                  ? "/auth/login?next=" + encodeURIComponent(nextPath)
                  : "/auth/login"
              }
            >
              Kirish
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
