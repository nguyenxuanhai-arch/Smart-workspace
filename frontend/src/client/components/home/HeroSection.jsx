import { Box, RotateCcw, ShieldCheck, Truck, WalletCards } from 'lucide-react'
import { heroImage, trustBadges } from '../../data/home.js'

const trustIcons = [RotateCcw, ShieldCheck, Truck, WalletCards]

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-background px-4 pb-12 pt-[160px] sm:px-6 lg:flex lg:min-h-[921px] lg:items-center lg:pb-0 lg:pt-24">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="z-10">
          <h1 className="mb-6 max-w-2xl text-[44px] font-bold leading-[52px] tracking-[-0.02em] text-primary sm:text-[72px] sm:leading-[80px]">
            Setup thông minh cho thế hệ làm việc mới.
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-7 text-on-surface-variant">
            Kiến tạo không gian hiệu suất cao cho Coder, Creator và Freelancer chuyên nghiệp. Tối ưu sức khoẻ, tối đa cảm hứng.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#products" className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 font-mono text-sm font-medium text-on-primary transition hover:bg-primary/90">
              Khám phá sản phẩm
            </a>
            <a href="#workspace-3d" className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary px-8 py-4 font-mono text-sm font-medium text-secondary transition hover:bg-secondary/5">
              Thử Workspace 3D <Box size={18} />
            </a>
          </div>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-2xl shadow-2xl sm:h-[600px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        </div>
      </div>
      <div className="mt-8 w-full lg:absolute lg:bottom-12 lg:left-0 lg:mt-0 lg:px-6">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 md:grid-cols-4">
          {trustBadges.map((badge, index) => {
            const Icon = trustIcons[index]
            return (
              <div key={badge} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface/40 p-4 backdrop-blur-sm">
                <Icon size={22} strokeWidth={1.5} className="text-secondary" />
                <span className="font-mono text-xs font-medium text-on-surface">{badge}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
