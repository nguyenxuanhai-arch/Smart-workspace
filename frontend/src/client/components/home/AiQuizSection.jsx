const quizGroups = [
  ['Bạn là ai?', ['Sinh viên', 'Lập trình viên', 'Creator', 'Nhân viên hybrid']],
  ['Diện tích phòng?', ['Nhỏ', 'Vừa', 'Lớn']],
  ['Ngân sách?', ['Dưới 5 triệu', '5-10 triệu', 'Trên 10 triệu']],
  ['Phong cách yêu thích?', ['Tối giản', 'Gaming', 'Scandinavian', 'Chuyên nghiệp']],
]

export default function AiQuizSection() {
  return (
    <section className="px-4 py-section-gap-mobile sm:px-6 lg:py-section-gap">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-primary p-8 text-center text-on-primary sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,88,190,0.45),transparent_55%)] opacity-30" />
        <div className="relative z-10">
          <h2 className="mb-4 text-[32px] font-semibold leading-10 tracking-[-0.01em] sm:text-5xl sm:leading-[56px]">
            Tìm setup phù hợp trong 60 giây
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-7 text-on-primary-container">
            AI của chúng tôi sẽ tư vấn combo tối ưu dựa trên nhu cầu, diện tích và ngân sách của bạn.
          </p>
        </div>
        <div className="relative z-10 grid gap-4 rounded-2xl bg-white/8 p-4 text-left text-on-primary sm:grid-cols-2">
          {quizGroups.map(([question, answers]) => (
            <div key={question}>
              <p className="mb-2 font-mono text-sm font-semibold text-on-primary">{question}</p>
              <div className="flex flex-wrap gap-2">
                {answers.map((answer) => (
                  <button key={answer} className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-on-primary-container hover:bg-white/20 hover:text-on-primary">
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="rounded-xl bg-white px-5 py-4 font-mono text-sm font-medium text-primary transition hover:scale-[1.02] sm:col-span-2">
            Bắt đầu Quiz ngay
          </button>
        </div>
      </div>
    </section>
  )
}
