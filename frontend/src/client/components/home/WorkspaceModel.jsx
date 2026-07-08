export default function WorkspaceModel({ deskColor, rotate, activeStyle }) {
  const hotspots = [
    ['Smart Standing Desk S1', '6.990.000đ', 'left-[42%] top-[55%]'],
    ['Ergo Mesh Chair M2', '4.190.000đ', 'left-[19%] top-[62%]'],
    ['Monitor Light Bar', '1.190.000đ', 'left-[48%] top-[27%]'],
    ['Laptop Stand', '690.000đ', 'left-[64%] top-[45%]'],
    ['Cable Management Kit', '390.000đ', 'left-[36%] top-[72%]'],
  ]

  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-3xl bg-black/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(0,88,190,0.28),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.65))]" />
      <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-white/10 px-4 py-2 font-mono text-xs font-medium text-on-primary backdrop-blur-md">
        {activeStyle} preview
      </div>
      <div className="absolute inset-x-8 bottom-4 top-16 transition-transform duration-700" style={{ transform: `perspective(900px) rotateY(${rotate}deg)` }}>
        <div className="absolute bottom-0 left-[10%] h-24 w-[80%] rounded-[50%] bg-slate-300/35 blur-xl" />
        <div className="absolute bottom-20 left-[20%] h-20 w-16 rounded-t-3xl bg-slate-800 shadow-xl" />
        <div className="absolute bottom-32 left-[18%] h-16 w-24 -skew-x-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-950 shadow-xl" />
        <div className="absolute bottom-44 left-[40%] h-20 w-32 rounded-xl bg-slate-950 shadow-2xl">
          <div className="m-2 h-12 rounded-md bg-gradient-to-br from-cyan-200 to-navy-800" />
        </div>
        <div className="absolute bottom-[8.75rem] left-[48%] h-12 w-3 rounded-full bg-slate-800" />
        <div className="absolute bottom-28 left-[34%] h-3 w-60 rounded-full bg-slate-700" />
        <div className={`absolute bottom-24 left-[25%] h-8 w-[48%] rounded-xl bg-gradient-to-r ${deskColor} shadow-2xl`} />
        <div className="absolute bottom-5 left-[29%] h-24 w-3 rounded-full bg-slate-700" />
        <div className="absolute bottom-5 left-[66%] h-24 w-3 rounded-full bg-slate-700" />
        <div className="absolute bottom-[8.25rem] left-[58%] h-4 w-24 rotate-[-8deg] rounded bg-slate-700 shadow-lg" />
        <div className="absolute bottom-[9.25rem] left-[59%] h-2 w-20 rotate-[-8deg] rounded bg-slate-100" />
        <div className="absolute bottom-[7.75rem] left-[72%] h-16 w-6 rounded-full bg-emerald-600" />
        <div className="absolute bottom-[7.5rem] left-[70%] h-8 w-10 rounded-full bg-emerald-100" />
        <div className="absolute bottom-[8rem] left-[76%] h-20 w-2 rounded-full bg-slate-700" />
        <div className="absolute bottom-[12.5rem] left-[75%] h-10 w-12 rounded-full bg-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.8)]" />
        <div className="absolute bottom-16 left-[38%] h-1 w-40 rounded-full bg-slate-500" />
        <div className="absolute bottom-14 left-[38%] h-1 w-28 rounded-full bg-slate-400" />
        <div className="absolute right-[8%] top-20 h-52 w-20 rounded-xl bg-white/10 shadow-sm" />
      </div>

      {hotspots.map(([name, price, position]) => (
        <button key={name} className={`absolute ${position} group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-left font-mono text-xs font-medium text-on-primary shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-secondary`}>
          <span className="h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_0_5px_rgba(0,88,190,0.2)]" />
          <span className="hidden sm:block">
            {name}
            <span className="block text-[11px] font-medium text-on-primary-container">{price}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
