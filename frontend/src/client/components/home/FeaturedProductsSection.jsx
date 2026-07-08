import { Focus, Palette, Settings2, Target } from 'lucide-react'

const values = [
  [Settings2, 'Ergonomics', 'Thiết kế dựa trên nghiên cứu cơ thể học.'],
  [Target, 'Focus', 'Giảm thiểu xao nhãng bằng sự tinh gọn.'],
  [Focus, 'Flexibility', 'Thích ứng với mọi nhu cầu công việc.'],
  [Palette, 'Aesthetics', 'Vẻ đẹp hiện đại, chuyên nghiệp.'],
]

export default function FeaturedProductsSection() {
  return (
    <section className="bg-surface px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-4">
        {values.map(([Icon, title, desc]) => (
          <div key={title} className="text-center">
            <Icon size={48} strokeWidth={1.5} className="mx-auto mb-4 text-secondary" />
            <h4 className="mb-2 font-mono text-sm font-bold uppercase tracking-[0.05em] text-primary">{title}</h4>
            <p className="text-base leading-6 text-on-surface-variant">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
