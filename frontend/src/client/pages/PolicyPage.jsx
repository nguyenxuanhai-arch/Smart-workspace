import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Cpu,
  CreditCard,
  Landmark,
  MapPinned,
  PackageCheck,
  PieChart,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Truck,
  Wallet,
  Wrench,
} from 'lucide-react'
import ClientLayout from '../components/layout/ClientLayout.jsx'
import { CLIENT_ROUTES } from '../routes.js'

const policyNav = [
  ['Đổi trả', CLIENT_ROUTES.returnPolicy, 'return'],
  ['Bảo hành', CLIENT_ROUTES.warrantyPolicy, 'warranty'],
  ['Thanh toán', CLIENT_ROUTES.paymentPolicy, 'payment'],
  ['Vận chuyển', CLIENT_ROUTES.shippingPolicy, 'shipping'],
]

const returnCards = [
  [CalendarDays, 'Cửa sổ 7 ngày', 'Yêu cầu đổi trả phải được khởi tạo trong vòng 7 ngày kể từ ngày hệ thống ghi nhận giao hàng thành công.'],
  [PackageCheck, 'Tình trạng nguyên bản', 'Sản phẩm cần giữ nguyên tình trạng kỹ thuật ban đầu, không trầy xước, không tháo lắp sai quy cách và còn đủ phụ kiện.'],
  [ReceiptText, 'Chứng từ hợp lệ', 'Cung cấp mã đơn hàng, hóa đơn điện tử hoặc số serial thiết bị để xác thực quyền lợi.'],
]

const returnSteps = [
  ['01', 'Khởi tạo', 'Gửi yêu cầu qua kênh hỗ trợ kèm hình ảnh hoặc video mô tả tình trạng sản phẩm.'],
  ['02', 'Xét duyệt', 'Kỹ thuật viên đánh giá trong 24 giờ và cấp mã RMA nếu đủ điều kiện.'],
  ['03', 'Vận chuyển', 'Đóng gói sản phẩm với bao bì chống sốc, dán mã RMA và gửi qua đối tác được chỉ định.'],
  ['04', 'Hoàn tất', 'Sau khi kiểm định phần cứng, tiền sẽ được hoàn lại vào phương thức thanh toán ban đầu.'],
]

const exclusions = [
  ['Tác động vật lý & môi trường', 'Móp méo, rơi vỡ, chập cháy do dùng sai nguồn điện hoặc hỏng do chất lỏng, độ ẩm vượt mức cho phép.'],
  ['Hao mòn tự nhiên', 'Trầy xước nhẹ, phai màu tự nhiên hoặc hao mòn bề mặt trong quá trình sử dụng thông thường.'],
  ['Can thiệp trái phép', 'Tự ý tháo dỡ, sửa chữa hoặc thay đổi cấu trúc cơ học/phần mềm bởi đơn vị không được ủy quyền.'],
  ['Sản phẩm tùy chỉnh', 'Đơn hàng gia công riêng theo kích thước, khắc tên hoặc logo cá nhân không hỗ trợ đổi trả, trừ lỗi từ nhà sản xuất.'],
]

const warrantyScope = [
  ['Bao gồm', ['Lỗi do nhà sản xuất trong quá trình lắp ráp.', 'Sự cố phần cứng do vật liệu khiếm khuyết.', 'Trục trặc động cơ nâng hạ không do tác động ngoại lực.']],
  ['Không bao gồm', ['Hao mòn tự nhiên đối với bề mặt hoàn thiện.', 'Thiệt hại do lắp đặt sai quy cách bởi bên thứ ba.', 'Hư hỏng do dùng sai mục đích hoặc vượt quá tải trọng quy định.']],
]

const warrantySteps = [
  ['01', 'Yêu cầu', 'Gửi yêu cầu qua Portal hỗ trợ hoặc liên hệ trực tiếp. Đội ngũ kỹ thuật tiếp nhận trong vòng 2 giờ làm việc.'],
  ['02', 'Chẩn đoán từ xa', 'Kỹ sư Lumina hướng dẫn kiểm tra qua video call và xác định linh kiện cần thay thế nếu có.'],
  ['03', 'Khắc phục tận nơi', 'Chuyên viên kỹ thuật đến không gian làm việc của bạn để sửa chữa, thay thế và căn chỉnh hệ thống.'],
]

const paymentMethods = [
  [Landmark, 'Chuyển khoản ngân hàng', 'Thanh toán trực tiếp vào tài khoản công ty. Đơn hàng sẽ được xử lý ngay sau khi hệ thống ghi nhận thanh toán.', ['Ngân hàng: Vietcombank', 'Số TK: 0123 456 789', 'Chủ TK: CTY TNHH LUMINA']],
  [CreditCard, 'Thẻ tín dụng / ghi nợ', 'Chấp nhận thanh toán qua cổng Napas với các loại thẻ phổ biến, xác thực qua 3D Secure.', ['VISA', 'MASTER', 'JCB']],
  [Wallet, 'Ví điện tử', 'Thanh toán nhanh bằng cách quét mã QR thông qua các ứng dụng ví điện tử hàng đầu tại Việt Nam.', ['MoMo', 'VNPay QR', 'ZaloPay']],
  [PieChart, 'Trả góp 0%', 'Chia nhỏ khoản thanh toán qua thẻ tín dụng của hơn 25 ngân hàng, không lãi suất cho kỳ hạn 3, 6, 9, 12 tháng.', ['Phổ biến']],
]

const shippingCards = [
  [Truck, 'Phí vận chuyển', ['Miễn phí nội thành cho đơn hàng trên 10.000.000đ tại Hà Nội và TP.HCM.', 'Ngoại thành và tỉnh áp dụng cước phí tiêu chuẩn theo trọng lượng thể tích.']],
  [Clock, 'Thời gian giao hàng', ['Nội thành: 2-3 ngày làm việc sau khi xác nhận thanh toán.', 'Ngoại thành và tỉnh: 3-5 ngày làm việc tùy đối tác logistics.']],
  [Wrench, 'Quy trình lắp đặt', ['Kỹ thuật viên chứng nhận lắp đặt mặc định tại khu vực nội thành.', 'Kiểm tra cơ chế công thái học và kết nối điện tử sau lắp đặt.']],
]

function PolicyTabs({ active }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border-subtle pb-4">
      {policyNav.map(([label, to, key]) => (
        <Link
          key={key}
          to={to}
          className={`rounded-lg px-4 py-2 font-mono text-sm font-medium transition ${
            active === key ? 'bg-primary text-on-primary' : 'bg-white text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="mb-10 border-b border-border-subtle pb-4">
      <h2 className="text-[32px] font-semibold leading-10 text-primary">{children}</h2>
    </div>
  )
}

function ReturnPolicy() {
  return (
    <>
      <section className="mb-section-gap-mobile max-w-3xl lg:mb-section-gap">
        <h1 className="mb-6 text-[44px] font-semibold leading-[52px] text-primary sm:text-[64px] sm:leading-[72px]">Chính sách Đổi trả</h1>
        <p className="text-lg leading-7 text-on-surface-variant">
          Nếu sản phẩm không đáp ứng tiêu chuẩn khắt khe của bạn, quy trình hoàn trả của Smart Workspace được xây dựng để minh bạch, nhanh chóng và không gây gián đoạn.
        </p>
      </section>

      <section className="mb-section-gap-mobile lg:mb-section-gap">
        <SectionTitle>01. Điều kiện Đổi trả</SectionTitle>
        <div className="grid gap-gutter md:grid-cols-3">
          {returnCards.map(([Icon, title, desc]) => (
            <article key={title} className="rounded-lg border border-border-subtle bg-white p-8 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <Icon size={32} strokeWidth={1.5} className="mb-6 text-primary" />
              <h3 className="mb-4 text-xl font-semibold text-primary">{title}</h3>
              <p className="text-base leading-6 text-on-surface-variant">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-section-gap-mobile lg:mb-section-gap">
        <SectionTitle>02. Quy trình Thực hiện</SectionTitle>
        <div className="grid gap-8 md:grid-cols-4">
          {returnSteps.map(([step, title, desc], index) => (
            <article key={step}>
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full border font-mono text-sm font-medium ${index === 0 ? 'border-primary bg-primary text-on-primary' : 'border-border-subtle bg-white text-primary'}`}>
                {step}
              </div>
              <h3 className="mb-2 font-mono text-sm font-medium uppercase text-primary">{title}</h3>
              <p className="text-base leading-6 text-on-surface-variant">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>03. Trường hợp Loại trừ</SectionTitle>
        <div className="overflow-x-auto rounded-lg border border-border-subtle bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-surface-container-low font-mono text-sm font-medium text-primary">
              <tr>
                <th className="w-1/3 border-b border-border-subtle px-6 py-4">Phân loại</th>
                <th className="border-b border-border-subtle px-6 py-4">Chi tiết vi phạm</th>
              </tr>
            </thead>
            <tbody className="text-base text-on-surface-variant">
              {exclusions.map(([type, detail]) => (
                <tr key={type} className="hover:bg-surface">
                  <td className="border-b border-border-subtle px-6 py-5 font-medium text-primary">{type}</td>
                  <td className="border-b border-border-subtle px-6 py-5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function WarrantyPolicy() {
  return (
    <>
      <section className="mb-section-gap-mobile max-w-4xl lg:mb-section-gap">
        <h1 className="mb-6 text-[44px] font-semibold leading-[52px] text-primary sm:text-[64px] sm:leading-[72px]">Cam kết Chất lượng</h1>
        <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
          Chính sách bảo hành phản ánh sự tự tin vào quy trình kỹ thuật và vật liệu cao cấp. Mọi không gian làm việc thông minh đều được hỗ trợ bởi dịch vụ bảo hành tận nơi chuyên nghiệp.
        </p>
      </section>

      <section className="mb-section-gap-mobile grid gap-gutter md:grid-cols-12 lg:mb-section-gap">
        <article className="rounded-lg border border-border-subtle bg-white p-8 md:col-span-8 md:p-12">
          <ShieldCheck size={32} strokeWidth={1.5} className="mb-6 text-primary" />
          <h2 className="mb-2 text-[32px] font-semibold leading-10 text-primary">Khung & Cơ khí</h2>
          <p className="mb-6 font-mono text-sm font-medium uppercase text-secondary">Bảo hành 5 năm</p>
          <p className="text-base leading-6 text-on-surface-variant">Bảo hành toàn diện cho cấu trúc khung, thép định hình và các chi tiết cơ khí chịu lực trong điều kiện sử dụng bình thường.</p>
        </article>
        <article className="rounded-lg border border-border-subtle bg-white p-8 md:col-span-4 md:p-12">
          <Cpu size={32} strokeWidth={1.5} className="mb-6 text-primary" />
          <h2 className="mb-2 text-[30px] font-semibold leading-[38px] text-primary">Linh kiện Điện tử</h2>
          <p className="mb-6 font-mono text-sm font-medium uppercase text-secondary">Bảo hành 2 năm</p>
          <p className="text-base leading-6 text-on-surface-variant">Bao gồm động cơ nâng hạ, bảng điều khiển, module sạc và hệ thống dây dẫn nội bộ.</p>
        </article>
      </section>

      <section className="mb-section-gap-mobile lg:mb-section-gap">
        <SectionTitle>Phạm vi áp dụng</SectionTitle>
        <div className="grid gap-8 md:grid-cols-3">
          {warrantyScope.map(([title, items]) => (
            <div key={title} className="border-l border-border-subtle pl-6">
              <h3 className="mb-3 font-mono text-sm font-medium uppercase text-primary">{title}</h3>
              <ul className="space-y-4 text-base leading-6 text-on-surface-variant">
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
          <div className="rounded-lg bg-surface-container-low p-6">
            <CheckCircle2 size={28} strokeWidth={1.5} className="mb-4 text-secondary" />
            <h3 className="mb-2 font-mono text-sm font-medium uppercase text-primary">Tài liệu yêu cầu</h3>
            <p className="text-base leading-6 text-on-surface-variant">Giữ lại hóa đơn điện tử hoặc số serial để quy trình xác minh diễn ra nhanh chóng.</p>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Quy trình Hỗ trợ Tận nơi</SectionTitle>
        <div className="grid gap-8 md:grid-cols-3">
          {warrantySteps.map(([step, title, desc], index) => (
            <article key={step}>
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-sm font-medium ${index === 0 ? 'border-primary bg-primary text-on-primary' : 'border-border-subtle bg-white text-primary'}`}>{step}</div>
              <h3 className="mb-3 font-mono text-sm font-medium uppercase text-primary">{title}</h3>
              <p className="text-base leading-6 text-on-surface-variant">{desc}</p>
            </article>
          ))}
        </div>
        <button type="button" className="mt-12 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-mono text-sm font-medium uppercase text-on-primary transition hover:opacity-90">
          Gửi yêu cầu bảo hành <ArrowRight size={18} strokeWidth={1.5} />
        </button>
      </section>
    </>
  )
}

function PaymentPolicy() {
  return (
    <>
      <section className="mx-auto mb-section-gap-mobile max-w-3xl text-center lg:mb-section-gap">
        <h1 className="mb-6 text-[44px] font-semibold leading-[52px] text-primary sm:text-[64px] sm:leading-[72px]">Chính sách Thanh toán.</h1>
        <p className="text-lg leading-7 text-on-surface-variant">Các phương thức thanh toán an toàn, linh hoạt cho mọi cấu hình mua sắm không gian làm việc thông minh.</p>
      </section>

      <section className="mb-section-gap-mobile rounded-xl border border-border-subtle bg-surface-container-low p-8 lg:mb-section-gap">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="mb-2 text-[30px] font-semibold leading-[38px] text-primary">Bảo mật tuyệt đối</h2>
            <p className="text-base leading-6 text-on-surface-variant">Tất cả giao dịch được mã hóa SSL 256-bit. Chúng tôi không lưu trữ thông tin thẻ tín dụng của khách hàng.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-gutter md:grid-cols-2">
        {paymentMethods.map(([Icon, title, desc, tags]) => (
          <article key={title} className="relative overflow-hidden rounded-xl border border-border-subtle bg-white p-8 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            {title === 'Trả góp 0%' && <span className="absolute right-0 top-0 rounded-bl-lg bg-secondary px-3 py-1 font-mono text-xs text-white">Phổ biến</span>}
            <div className="mb-6 flex items-center gap-4">
              <Icon size={30} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-2xl font-semibold leading-8 text-primary">{title}</h2>
            </div>
            <p className="mb-6 text-base leading-6 text-on-surface-variant">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => <span key={tag} className="rounded border border-border-subtle bg-surface-container-low px-3 py-1 font-mono text-xs text-on-surface-variant">{tag}</span>)}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function ShippingPolicy() {
  return (
    <>
      <section className="mb-section-gap-mobile max-w-4xl lg:mb-section-gap">
        <h1 className="mb-6 text-[44px] font-semibold leading-[52px] text-primary sm:text-[64px] sm:leading-[72px]">Vận chuyển & Logistics</h1>
        <p className="max-w-3xl text-lg leading-7 text-on-surface-variant">Thông tin chi tiết về quy trình vận chuyển, thời gian ước tính và giao thức lắp đặt chuyên nghiệp cho thiết bị Smart Workspace.</p>
      </section>

      <section className="mb-section-gap-mobile grid gap-gutter md:grid-cols-3 lg:mb-section-gap">
        {shippingCards.map(([Icon, title, items]) => (
          <article key={title} className="border border-border-subtle bg-white p-8 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <Icon size={32} strokeWidth={1.5} className="mb-6 text-secondary" />
            <h2 className="mb-4 border-b border-border-subtle pb-2 font-mono text-sm font-medium uppercase text-primary">{title}</h2>
            <ul className="space-y-3 text-base leading-6 text-on-surface-variant">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-8 text-[30px] font-semibold leading-[38px] text-primary">Khu vực hỗ trợ Logistics</h2>
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-surface-container-low">
          <MapPinned size={140} strokeWidth={1} className="absolute text-secondary/20" />
          <div className="relative z-10 max-w-md border border-border-subtle bg-white/90 p-6 backdrop-blur-sm">
            <h3 className="mb-2 font-mono text-sm font-medium uppercase text-primary">Zone 1: Lắp đặt tiêu chuẩn</h3>
            <p className="text-base leading-6 text-on-surface-variant">Hà Nội trong bán kính 20km từ trung tâm và các quận nội thành TP. Hồ Chí Minh.</p>
            <h3 className="mb-2 mt-4 font-mono text-sm font-medium uppercase text-primary">Zone 2: Vận chuyển toàn quốc</h3>
            <p className="text-base leading-6 text-on-surface-variant">Hỗ trợ vận chuyển qua đối tác đến 61 tỉnh thành còn lại, không bao gồm lắp đặt tận nơi.</p>
          </div>
        </div>
      </section>
    </>
  )
}

const renderContent = {
  return: <ReturnPolicy />,
  warranty: <WarrantyPolicy />,
  payment: <PaymentPolicy />,
  shipping: <ShippingPolicy />,
}

export default function PolicyPage({ type = 'return' }) {
  return (
    <ClientLayout>
      <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-32 sm:px-6 lg:pb-section-gap lg:pt-36">
        <div className="mb-12">
          <PolicyTabs active={type} />
        </div>
        {renderContent[type] || renderContent.return}
      </main>
    </ClientLayout>
  )
}
