import { site } from "@/lib/site";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted">{site.tagline}</p>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-end">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-muted transition-colors hover:text-green"
          >
            {site.email}
          </a>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
