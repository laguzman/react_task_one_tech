"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { LIMITS, TEAM_SIZES, validateDemo, type DemoErrors, type DemoFields, type TextKey } from "@/lib/demo";

const empty: DemoFields = { name: "", email: "", company: "", teamSize: "", message: "", privacy: false, newsletter: false };

const control =
  "w-full rounded-2xl border border-ink/30 bg-paper px-4 py-3 text-base text-ink placeholder:text-mute focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-[invalid=true]:border-accent";

type FieldProps = {
  id: keyof DemoFields;
  label: string;
  optional?: boolean;
  helper?: string;
  error?: string;
  children: (p: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

function Field({ id, label, optional, helper, error, children }: FieldProps) {
  const describedBy = [helper && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-mute"> (optional)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {helper && (
        <p id={`${id}-help`} className="text-sm text-mute">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

export function DemoForm() {
  const [values, setValues] = useState<DemoFields>(empty);
  const [errors, setErrors] = useState<DemoErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");

  const set = (k: TextKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const check = (k: keyof DemoFields) => () => {
    const found = validateDemo(values)[k];
    setErrors((e) => ({ ...e, [k]: found }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const found = validateDemo(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: trap }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl bg-paper p-8 md:p-10">
        <CheckCircle weight="regular" size={36} aria-hidden className="text-accent" />
        <h3 className="mt-5 text-2xl font-medium tracking-tight">Request received.</h3>
        <p className="mt-3 max-w-[44ch] text-base leading-relaxed text-mute">
          Thanks, {values.name.trim().split(" ")[0]}. We will email {values.email.trim().toLowerCase()} with times for your demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id="name" label="Full name" error={errors.name}>
        {(p) => <input {...p} name="name" required aria-required maxLength={LIMITS.name} value={values.name} onChange={set("name")} onBlur={check("name")} autoComplete="name" className={control} />}
      </Field>
      <Field id="email" label="Work email" error={errors.email}>
        {(p) => (
          <input {...p} name="email" type="email" inputMode="email" required aria-required maxLength={LIMITS.email} value={values.email} onChange={set("email")} onBlur={check("email")} autoComplete="email" className={control} />
        )}
      </Field>
      <Field id="company" label="Company" error={errors.company}>
        {(p) => (
          <input {...p} name="company" required aria-required maxLength={LIMITS.company} value={values.company} onChange={set("company")} onBlur={check("company")} autoComplete="organization" className={control} />
        )}
      </Field>
      <Field id="teamSize" label="Sales team size" error={errors.teamSize}>
        {(p) => (
          <select {...p} name="teamSize" required aria-required value={values.teamSize} onChange={set("teamSize")} onBlur={check("teamSize")} className={control}>
            <option value="">Select a range</option>
            {TEAM_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </Field>
      <div className="sm:col-span-2">
        <Field
          id="message"
          label="What would you like to see?"
          optional
          helper="For example the tools you use today or the process you would most like to simplify."
          error={errors.message}
        >
          {(p) => (
            <textarea {...p} name="message" rows={4} maxLength={LIMITS.message} value={values.message} onChange={set("message")} onBlur={check("message")} className={`${control} resize-y`} />
          )}
        </Field>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="privacy" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
            <input
              id="privacy"
              name="privacy"
              type="checkbox"
              required
              aria-required
              aria-invalid={Boolean(errors.privacy)}
              aria-describedby={errors.privacy ? "privacy-error" : undefined}
              checked={values.privacy}
              onChange={(e) => {
                setValues((v) => ({ ...v, privacy: e.target.checked }));
                if (e.target.checked) setErrors((er) => ({ ...er, privacy: undefined }));
              }}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <span>
              I agree that One Tech may use my data to respond to this request and arrange the demo, as described in the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-2">
                privacy policy
              </a>
              .
            </span>
          </label>
          {errors.privacy && (
            <p id="privacy-error" role="alert" className="text-sm font-medium text-accent">
              {errors.privacy}
            </p>
          )}
        </div>
        <label htmlFor="newsletter" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={values.newsletter}
            onChange={(e) => setValues((v) => ({ ...v, newsletter: e.target.checked }))}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <span>
            Subscribe me to the One Tech newsletter <span className="text-mute">(optional)</span>
          </span>
        </label>
      </div>

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div className="flex flex-col items-start gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition duration-300 hover:-translate-y-px hover:bg-accent active:translate-y-0 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {status === "sending" ? "Sending" : "Book a demo"}
        </button>
        {formError && (
          <p role="alert" className="text-sm font-medium text-accent">
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}
