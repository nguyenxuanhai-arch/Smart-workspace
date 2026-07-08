import { comboCards } from '../../data/home.js'
import Rating from './Rating.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function ComboSection() {
  return (
    <section id="combos" className="mx-auto max-w-[1280px] px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div>
        <SectionHeading title="Combo chuyên dụng" />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {comboCards.map((combo) => (
            <article key={combo.name} className="group rounded-2xl border border-border-subtle bg-surface-container-low p-8 transition hover:border-secondary">
              <div className="mb-6 aspect-video overflow-hidden rounded-xl">
                <img src={combo.image} alt={combo.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Rating />
                  <span className="font-mono text-xs font-medium text-on-surface">4.9 (120 đánh giá)</span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-primary">{combo.name}</h3>
                <p className="mb-6 text-base leading-6 text-on-surface-variant">{combo.desc}</p>
                <button className="w-full rounded-lg bg-primary py-3 font-mono text-sm font-medium text-on-primary transition group-hover:bg-secondary">
                  Tùy chỉnh & Mua
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
