import { Clock, Mail, MapPin, Phone } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-[1280px] px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-2">
        <div className="h-[400px] overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-lg">
          <div className="relative flex h-full min-h-80 items-center justify-center bg-[linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:34px_34px]">
            <div className="absolute h-36 w-36 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative rounded-xl bg-white px-6 py-5 text-center shadow-[0_24px_48px_-12px_rgba(19,27,46,0.08)]">
              <MapPin className="mx-auto text-secondary" size={34} />
              <p className="mt-2 font-semibold text-primary">LUMINA Showroom</p>
              <p className="text-sm text-on-surface-variant">Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
        <div className="lg:pl-12">
          <h2 className="mb-6 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary sm:text-5xl sm:leading-[56px]">Trải nghiệm trực tiếp</h2>
          <div className="space-y-6 text-on-surface-variant">
            <p className="flex items-start gap-4"><MapPin size={22} className="mt-0.5 text-secondary" /> <span><strong className="block font-mono text-sm text-primary">Showroom Quận 1</strong>123 Đường Smart, Phường Bến Nghé, Quận 1, TP. HCM</span></p>
            <p className="flex items-start gap-4"><Phone size={22} className="mt-0.5 text-secondary" /> <span><strong className="block font-mono text-sm text-primary">Hotline</strong>1900 8888 (08:00 - 21:00)</span></p>
            <p className="flex items-start gap-4"><Mail size={22} className="mt-0.5 text-secondary" /> <span><strong className="block font-mono text-sm text-primary">Email</strong>contact@lumina.vn</span></p>
            <p className="flex items-start gap-4"><Clock size={22} className="mt-0.5 text-secondary" /> <span><strong className="block font-mono text-sm text-primary">Giờ làm việc</strong>09:00 - 20:00, Thứ 2 - Chủ nhật</span></p>
          </div>
          <button className="mt-8 rounded-lg bg-primary px-8 py-4 font-mono text-sm font-medium text-on-primary transition hover:bg-primary/90">Chỉ đường</button>
        </div>
      </div>
    </section>
  )
}
