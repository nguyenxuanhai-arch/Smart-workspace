import { ArrowRight, Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'

const showroomAddress = '123 Đường Smart, Quận 1, TP. HCM'
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(showroomAddress)}&output=embed`

const contactInfo = [
  [MapPin, 'Địa chỉ', showroomAddress],
  [Phone, 'Hotline', '1900 8888'],
  [Mail, 'Email', 'contact@lumina.vn'],
  [Clock, 'Giờ làm việc', 'Thứ 2 - Thứ 6: 8:00 - 18:00\nThứ 7: 9:00 - 13:00'],
]

function Field({ label, placeholder, type = 'text' }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-sm font-medium text-on-surface">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-lg border border-border-subtle bg-surface px-4 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

export default function ContactPage() {
  return (
    <ClientLayout>
      <main className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4 pb-section-gap-mobile pt-32 sm:px-6 md:gap-24 lg:pb-section-gap lg:pt-36">
        <section className="max-w-3xl text-center md:text-left">
          <h1 className="text-[44px] font-bold leading-[52px] text-primary sm:text-[72px] sm:leading-[80px]">Liên hệ với chúng tôi</h1>
          <p className="mt-4 text-lg leading-7 text-on-surface-variant">
            Chúng tôi luôn sẵn sàng hỗ trợ. Hãy kết nối để được tư vấn về giải pháp không gian làm việc hoặc các cơ hội hợp tác.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="rounded-xl border border-border-subtle bg-surface-container p-6 shadow-sm sm:p-8">
            <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Họ và tên" placeholder="Nhập họ và tên" />
                <Field label="Địa chỉ Email" placeholder="Nhập email của bạn" type="email" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Số điện thoại" placeholder="Nhập số điện thoại" type="tel" />
                <Field label="Tiêu đề" placeholder="Bạn cần hỗ trợ về vấn đề gì?" />
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-sm font-medium text-on-surface">Lời nhắn</span>
                <textarea
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                  className="min-h-[150px] resize-y rounded-lg border border-border-subtle bg-surface px-4 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-on-surface md:w-fit">
                Gửi tin nhắn <Send size={18} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center gap-10">
            <div>
              <h2 className="mb-6 text-[30px] font-semibold leading-[38px] text-primary">Showroom của chúng tôi</h2>
              <div className="flex flex-col gap-6">
                {contactInfo.map(([Icon, title, detail]) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon size={22} strokeWidth={1.5} className="mt-1 shrink-0 text-secondary" />
                    <div>
                      <p className="font-mono text-sm font-semibold text-on-surface">{title}</p>
                      <p className="mt-1 whitespace-pre-line text-base leading-6 text-on-surface-variant">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="h-[400px] overflow-hidden rounded-xl border border-border-subtle bg-surface-container-highest md:h-[500px]">
          <iframe
            title="Bản đồ Google Maps showroom Smart Workspace"
            src={mapEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

        <section className="flex flex-col items-center gap-6 rounded-xl border border-border-subtle bg-surface-container p-8 text-center md:p-12">
          <MessageSquare size={40} strokeWidth={1.5} className="text-secondary" />
          <h2 className="text-[30px] font-semibold leading-[38px] text-primary">Ý kiến của bạn rất quan trọng</h2>
          <p className="max-w-2xl text-base leading-6 text-on-surface-variant">
            Chúng tôi luôn nỗ lực cải thiện sản phẩm. Hãy cho chúng tôi biết cảm nhận của bạn.
          </p>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-2 font-semibold text-primary transition hover:bg-primary hover:text-on-primary">
            Gửi phản hồi <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </section>
      </main>
    </ClientLayout>
  )
}
