import { useMemo, useState } from 'react'
import { Palette, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { chairTypes, deskColors, deskTypes, roomStyles } from '../../data/home.js'
import { formatCurrency } from '../../utils/formatters.js'
import SectionHeading from './SectionHeading.jsx'
import WorkspaceModel from './WorkspaceModel.jsx'

export default function Workspace3DSection() {
  const [activeStyle, setActiveStyle] = useState('Tối giản')
  const [deskType, setDeskType] = useState(deskTypes[0])
  const [chairType, setChairType] = useState(chairTypes[0])
  const [budget, setBudget] = useState(10)
  const [deskColorIndex, setDeskColorIndex] = useState(0)
  const [rotate, setRotate] = useState(0)
  const setupTotal = useMemo(() => budget * 1000000 + 1990000, [budget])

  return (
    <section id="workspace-3d" className="relative overflow-hidden bg-primary-container px-4 py-section-gap-mobile text-on-primary sm:px-6 lg:py-section-gap">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl">
            <WorkspaceModel deskColor={deskColors[deskColorIndex].className} rotate={rotate} activeStyle={activeStyle} />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-8 sm:left-8 sm:gap-4">
              <button onClick={() => setRotate((value) => value + 90)} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10px] font-medium text-on-primary backdrop-blur-md transition hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-2 sm:text-xs">
                <RotateCcw size={14} className="sm:h-4 sm:w-4" /> Xoay 360°
              </button>
              <button onClick={() => setDeskColorIndex((value) => (value + 1) % deskColors.length)} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10px] font-medium text-on-primary backdrop-blur-md transition hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-2 sm:text-xs">
                <Palette size={14} className="sm:h-4 sm:w-4" /> Đổi màu bàn
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-on-primary-container">Experience</span>
          <h2 className="mb-8 mt-3 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-on-primary sm:text-5xl sm:leading-[56px]">
            Workspace 3D Configurator
          </h2>
          <aside>
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-3 font-mono text-sm font-medium text-on-primary-container">Phong cách làm việc</p>
                <div className="grid grid-cols-2 gap-2">
                  {roomStyles.map((style) => (
                    <button key={style} onClick={() => setActiveStyle(style)} className={`rounded-lg border px-4 py-3 font-mono text-xs font-medium transition ${activeStyle === style ? 'border-secondary bg-secondary text-on-primary' : 'border-white/10 bg-white/5 text-on-primary hover:bg-white/10'}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-3 block font-mono text-sm font-medium text-on-primary-container">Loại bàn</span>
                <select value={deskType} onChange={(e) => setDeskType(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-on-primary outline-none focus:ring-2 focus:ring-secondary">
                  {deskTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-3 block font-mono text-sm font-medium text-on-primary-container">Loại ghế</span>
                <select value={chairType} onChange={(e) => setChairType(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-on-primary outline-none focus:ring-2 focus:ring-secondary">
                  {chairTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-3 flex items-center justify-between font-mono text-sm font-medium text-on-primary-container">
                  Ngân sách <strong className="text-on-primary">{budget} triệu</strong>
                </span>
                <input type="range" min="5" max="25" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-secondary" />
              </label>
              <div className="border-t border-white/10 pt-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-base text-on-primary">Tổng giá trị dự kiến:</span>
                  <span className="text-[30px] font-semibold leading-[38px] text-on-primary">{formatCurrency(setupTotal)}</span>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 rounded-lg bg-secondary py-4 font-mono text-sm font-medium text-on-primary transition hover:bg-secondary-container">
                    Thêm toàn bộ vào giỏ
                  </button>
                  <button onClick={() => setActiveStyle(roomStyles[(roomStyles.indexOf(activeStyle) + 1) % roomStyles.length])} className="rounded-lg bg-white/10 p-4 transition hover:bg-white/20">
                    <SlidersHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
