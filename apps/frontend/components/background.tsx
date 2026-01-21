export default function Background() {
    return (
      /* Background */
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(900px_circle_at_40%_90%,rgba(59,130,246,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
    );
}