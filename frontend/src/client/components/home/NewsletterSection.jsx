export default function NewsletterSection() {
  return (
    <section className="bg-surface-container px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-[30px] font-semibold leading-[38px] text-primary">Tham gia cộng đồng Smart Workspace</h2>
        <p className="mb-8 text-base leading-6 text-on-surface-variant">
          Nhận tin tức về các dòng sản phẩm mới và mẹo setup hiệu suất hàng tuần.
        </p>
        <form className="flex flex-col gap-3 sm:flex-row">
          <input className="flex-1 rounded-lg border border-border-subtle px-6 py-4 outline-none transition focus:ring-2 focus:ring-secondary" placeholder="Email của bạn" type="email" />
          <button className="rounded-lg bg-primary px-8 py-4 font-mono text-sm font-medium text-on-primary transition hover:bg-primary/90">Đăng ký ngay</button>
        </form>
      </div>
    </section>
  )
}
