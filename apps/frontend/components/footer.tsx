"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        /* Footer */
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
            
            <div className="text-sm text-white/70">© {new Date().getFullYear()} Pallad — Monitoring cyber pour PME/ETI.</div>

            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <Link className="hover:text-white" href="#free">
                Diagnostic
              </Link>
              <Link className="hover:text-white" href="#features">
                Fonctionnalités
              </Link>
              <Link className="hover:text-white" href="#pricing">
                Tarifs
              </Link>
            </div>

          </div>
        </footer>
    );
}