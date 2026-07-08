import { Share2 } from 'lucide-react'
import { reviews } from '../../data/home.js'
import Rating from './Rating.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-surface-container-low px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <SectionHeading title="Được yêu thích bởi cộng đồng" />
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[30px] font-semibold leading-[38px] text-secondary">4.8/5</span>
            <Rating />
            <span className="font-mono text-xs text-on-surface-variant">(2,000+ đánh giá thực tế)</span>
          </div>
          <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-white px-5 py-3 font-mono text-sm font-medium text-primary shadow-sm hover:text-secondary">
            <Share2 size={17} /> Chia sẻ setup của bạn
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map(([name, role, comment, image]) => (
            <article key={name} className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/15" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-primary">{name}</h3>
                  <p className="font-mono text-[10px] text-on-surface-variant">{role}</p>
                </div>
              </div>
              <p className="mb-4 text-base leading-6 text-on-surface-variant">"{comment}"</p>
              <img src={image} alt={`Góc làm việc của ${name}`} className="h-32 w-full rounded-lg object-cover" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
