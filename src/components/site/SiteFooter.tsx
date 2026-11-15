import { MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { CONTACT_DISPLAY, CONTACT_TEL, CONTACT_WHATSAPP, OFFICE_LOCATION } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary-deep text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-xl font-bold">
            REPLAD <span className="text-highlight">Tenant Search</span>
          </p>
          <p className="mt-1 text-sm text-primary-foreground/70">
            One stop solutions for your home.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-highlight" /> {OFFICE_LOCATION}
          </span>
          <a href={CONTACT_TEL} className="inline-flex items-center gap-1.5 hover:text-highlight">
            <Phone className="size-4 text-highlight" /> {CONTACT_DISPLAY}
          </a>
          <a
            href={CONTACT_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-highlight"
          >
            <WhatsAppIcon className="size-4 text-highlight" /> WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} REPLAD Home Services, Bangalore
      </div>
    </footer>
  );
}
