"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        /* Header */
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur">

            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                
                <div className="flex items-center gap-3">
                <Image src="/pallad.svg" alt="Logo" width={100} height={20}/>
                    <span className="text-sm font-semibold tracking-wide">Pallad</span>
                </div>

                <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
                    <Link className="hover:text-white" href="#features">
                        Fonctionnalités
                    </Link>
                    <Link className="hover:text-white" href="#pricing">
                        Tarifs
                    </Link>
                    <Link className="hover:text-white" href="#faq">
                        FAQ
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="#pricing"
                        className="hidden rounded-xl px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15 hover:bg-white/5 md:inline-flex"
                    >
                        Voir les offres
                    </Link>
                    <Link
                        href="#free"
                        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                    >
                        Lancer le diagnostic gratuit
                    </Link>
                </div>

            </div>

        </header>
    );
}