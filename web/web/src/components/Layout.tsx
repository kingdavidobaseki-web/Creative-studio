import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/music", label: "Music Studio" },
  { to: "/video", label: "Video Studio" },
  { to: "/projects", label: "My Projects" },
  { to: "/settings", label: "Settings" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
  }`;

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-base font-semibold tracking-tight text-white" onClick={() => setOpen(false)}>
            AI Creative <span className="text-fuchsia-400">Studio</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col gap-1 border-t border-zinc-800 px-4 py-3 md:hidden">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 px-4 py-6 text-center text-xs text-zinc-500">
        AI Creative Studio is under construction. Features are marked Coming soon until they work.
      </footer>
    </div>
  );
}
