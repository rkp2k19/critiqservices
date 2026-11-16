import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import logo from "@/assets/replad_logo.jpeg";
import { WhatsAppIcon } from "./WhatsAppIcon";
import {
  CONTACT_DISPLAY,
  CONTACT_TEL,
  CONTACT_WHATSAPP,
  OFFICE_LOCATION,
} from "@/lib/contact";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" search={{}} className="shrink-0" aria-label="REPLAD Home Services – home">
          <img
            src={logo}
            alt="REPLAD Home Services – One stop solutions for your home"
            width={1600}
            height={600}
            className="h-12 w-auto rounded-md sm:h-14"
          />
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {OFFICE_LOCATION}
          </span>

          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card py-1 pl-3 pr-1">
            <span className="mr-1 font-semibold tracking-tight">{CONTACT_DISPLAY}</span>
            <a
              href={CONTACT_TEL}
              aria-label={`Call ${CONTACT_DISPLAY}`}
              className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
              <Phone className="size-4" />
            </a>
            <a
              href={CONTACT_WHATSAPP}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${CONTACT_DISPLAY}`}
              className="inline-flex size-8 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
