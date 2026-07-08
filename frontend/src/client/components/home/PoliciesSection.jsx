import { CreditCard, ShieldCheck, Truck } from 'lucide-react'

const policies = [
  [CreditCard, 'Thanh toán an toàn', 'Hỗ trợ COD, chuyển khoản ngân hàng, MoMo, ZaloPay, VNPay và thẻ thanh toán.'],
  [Truck, 'Giao hàng nhanh', 'Giao hàng dự kiến 2-5 ngày tại TP.HCM và Hà Nội.'],
  [ShieldCheck, 'Bảo hành & đổi trả', 'Hỗ trợ đổi trả 7 ngày với sản phẩm lỗi, bảo hành 6-12 tháng cho sản phẩm chính.'],
]

export default function PoliciesSection() {
  return (
    <section id="policies" className="bg-white px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="mx-auto grid max-w-[1280px] gap-gutter lg:grid-cols-3">
        {policies.map(([Icon, title, desc]) => (
          <div key={title} className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Icon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            <p className="mt-2 leading-7 text-on-surface-variant">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
