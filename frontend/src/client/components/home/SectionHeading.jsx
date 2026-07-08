export default function SectionHeading({ eyebrow, title, desc, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'mx-auto text-center'

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow && <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>}
      <h2 className="mt-3 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary sm:text-5xl sm:leading-[56px]">{title}</h2>
      {desc && <p className="mt-4 text-base leading-7 text-on-surface-variant sm:text-lg">{desc}</p>}
    </div>
  )
}
