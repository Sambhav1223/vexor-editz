"use client";

import { useState } from "react";
import { Check, Copy, Gamepad2, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "./ui/Reveal";
import { YouTubeIcon } from "./ui/icons";

const projectTypes = ["Anime edit", "Movie edit", "Gaming edit", "Cinematic edit", "Something else"];
const { email, discordHandle, discordUrl } = siteConfig.contact;

function ContactRow({
  icon,
  label,
  value,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-soft">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted">{label}</span>
        <span className={`block truncate font-medium ${value ? "" : "text-muted"}`}>{value ?? "Coming soon"}</span>
      </span>
    </>
  );
  const cls = "card flex items-center gap-4 p-4 transition-colors duration-300";
  return (
    <li className="flex gap-2">
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`${cls} flex-1 hover:border-accent/60`}
        >
          {inner}
        </a>
      ) : (
        <div className={`${cls} flex-1`}>{inner}</div>
      )}
      {children}
    </li>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy Discord handle"
      className="card px-4 hover:border-accent/60"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

function EnquiryForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [details, setDetails] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = `Collaboration enquiry: ${type}`;
    const body = `Hi ${siteConfig.name},\n\nName: ${name}\nProject type: ${type}\n\n${details}\n`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-muted/70 focus:border-accent-soft focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <h3 className="font-display text-3xl font-extrabold uppercase tracking-wide">Collaboration enquiry</h3>
      <p className="mt-2 text-sm text-muted">
        Share the type of project, a rough length, a deadline and any reference edits you like.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="enq-name" className="text-sm font-medium">
            Your name
          </label>
          <input id="enq-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="enq-type" className="text-sm font-medium">
            Project type
          </label>
          <select id="enq-type" value={type} onChange={(e) => setType(e.target.value)} className={field}>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="enq-details" className="text-sm font-medium">
            Project details
          </label>
          <textarea
            id="enq-details"
            required
            rows={5}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="What are you making, and what should the edit feel like?"
            className={field}
          />
        </div>
      </div>

      <button type="submit" disabled={!email} className="btn-primary mt-6 w-full sm:w-auto">
        <Mail size={16} aria-hidden="true" />
        Send enquiry by email
      </button>
      {!email ? (
        <p className="mt-3 text-xs text-muted">Email enquiries open once an email address is added. Use the channel link for now.</p>
      ) : null}
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-white/10 bg-surface py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full opacity-30"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.3), transparent)" }}
      />
      <div className="wrap relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <h2
              id="contact-title"
              className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:text-7xl"
            >
              Let&apos;s create something extraordinary.
            </h2>
            <p className="mt-5 max-w-md text-base text-muted md:text-lg">
              Have a project in mind? Let&apos;s bring your vision to life.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 grid gap-3">
              <ContactRow
                icon={<YouTubeIcon className="h-5 w-5" />}
                label="YouTube"
                value={siteConfig.youtube.handle}
                href={siteConfig.youtube.url}
              />
              <ContactRow
                icon={<Gamepad2 size={20} />}
                label="Discord"
                value={discordHandle || (discordUrl ? "Join the Discord server" : undefined)}
                href={discordUrl || undefined}
              >
                {discordHandle ? <CopyButton text={discordHandle} /> : null}
              </ContactRow>
              <ContactRow
                icon={<Mail size={20} />}
                label="Email"
                value={email || undefined}
                href={email ? `mailto:${email}` : undefined}
              />
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
