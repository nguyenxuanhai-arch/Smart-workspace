import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Grid, DragControls } from '@react-three/drei'
import { MessageCircle, Camera, RefreshCw } from 'lucide-react'

// --- 3D PRIMITIVES ---

function Desk({ color = '#8b5a2b' }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.75, 0.375, 0]} castShadow>
        <boxGeometry args={[0.1, 0.75, 0.7]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.75, 0.375, 0]} castShadow>
        <boxGeometry args={[0.1, 0.75, 0.7]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

function Chair({ color = '#1e1e1e' }) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.75, 0.225]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.225, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

function MonitorScreen() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.3, 0.02]} castShadow>
        <boxGeometry args={[0.6, 0.35, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.3, 0.031]}>
        <boxGeometry args={[0.58, 0.33, 0.001]} />
        <meshStandardMaterial color="#0058be" emissive="#0058be" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function LightBar() {
  return (
    <group>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 0.6, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.58, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.28]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function MonitorStand() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.02, 0.25]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.38, 0.02, 0]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.38, 0.02, 0]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

function LaptopStand() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.25, 0.02, 0.2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      {/* Arm */}
      <mesh position={[0, 0.06, 0.05]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.15, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      
      {/* Tray Group */}
      <group position={[0, 0.12, -0.01]} rotation={[Math.PI / 6, 0, 0]}>
        {/* Tray Surface */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.01, 0.22]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* Stopper */}
        <mesh position={[0, 0.01, 0.11]} castShadow>
          <boxGeometry args={[0.28, 0.02, 0.01]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>
    </group>
  )
}

function PhoneStand() {
  return (
    <group scale={0.5}>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
      <mesh position={[0, 0.08, -0.02]} rotation={[-Math.PI / 5, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.02]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
    </group>
  )
}

function Footrest() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 12, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

function DeskMat() {
  return (
    <mesh position={[0, 0.001, 0]} receiveShadow>
      <boxGeometry args={[0.8, 0.002, 0.4]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  )
}

function PomodoroClock() {
  return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.04, 0.041]}>
        <boxGeometry args={[0.06, 0.06, 0.001]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  )
}

function Laptop() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.35, 0.02, 0.25]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Keyboard area */}
      <mesh position={[0, 0.021, 0.02]}>
        <boxGeometry args={[0.3, 0.001, 0.12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Screen Hinge Group */}
      <group position={[0, 0.02, -0.12]} rotation={[-Math.PI / 6, 0, 0]}>
        {/* Screen Back */}
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.35, 0.22, 0.015]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Display */}
        <mesh position={[0, 0.11, 0.008]}>
          <boxGeometry args={[0.33, 0.20, 0.001]} />
          <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Keyboard() {
  return (
    <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 100, 0, 0]} castShadow>
      <boxGeometry args={[0.4, 0.015, 0.12]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  )
}

function Mouse() {
  return (
    <mesh position={[0, 0.01, 0]} castShadow>
      <boxGeometry args={[0.06, 0.025, 0.1]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  )
}

function Plant() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <dodecahedronGeometry args={[0.09]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  )
}

function Mug() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.04, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.025, 0.008, 8, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  )
}


export default function Workspace3D() {
  const [resetKey, setResetKey] = useState(0)
  const [controlsEnabled, setControlsEnabled] = useState(true)

  const [items, setItems] = useState({
    desk: true,
    chair: true,
    // Ergonomic
    deskMat: true,
    laptopStand: false,
    footrest: false,
    // Expansion
    monitor: false,
    monitorStand: false,
    phoneStand: false,
    light: false,
    // Focus
    pomodoro: false,
    // Devices & Decor
    laptop: false,
    keyboard: true,
    mouse: true,
    plant: false,
    mug: false,
  })

  const [deskColor, setDeskColor] = useState('#8b5a2b') // Wood
  const [chairColor, setChairColor] = useState('#1e1e1e') // Black

  const toggleItem = (key) => {
    setItems((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      
      // Auto-enable laptop when laptop stand is enabled
      if (key === 'laptopStand' && next.laptopStand) {
        next.laptop = true
      }
      // Auto-enable monitor when monitor stand is enabled
      if (key === 'monitorStand' && next.monitorStand) {
        next.monitor = true
      }
      return next
    })
  }

  const handleReset = () => {
    setItems({
      desk: true,
      chair: true,
      deskMat: true,
      laptopStand: false,
      footrest: false,
      monitor: false,
      monitorStand: false,
      phoneStand: false,
      light: false,
      pomodoro: false,
      laptop: false,
      keyboard: true,
      mouse: true,
      plant: false,
      mug: false,
    })
    setResetKey(prev => prev + 1)
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-slate-50 pt-16">
      <div className="relative flex-1 bg-gradient-to-b from-slate-100 to-slate-200 min-h-[500px] md:min-h-0">
        <Canvas shadows camera={{ position: [2, 1.5, 2.5], fov: 45 }}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.5} />
          <directionalLight castShadow position={[5, 5, 5]} intensity={1} shadow-mapSize={[1024, 1024]} />
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <group position={[0, -0.5, 0]} key={resetKey}>
              {/* Static Items */}
              {items.desk && <Desk color={deskColor} />}
              
              <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={5} blur={2} far={2} />
              <Grid infiniteGrid fadeDistance={10} fadeStrength={5} sectionColor="#cbd5e1" cellColor="#e2e8f0" position={[0, -0.01, 0]} />

              {/* Movable Items on Floor */}
              {items.chair && (
                <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                  <group position={[0, 0, 0.6]}>
                    <Chair color={chairColor} />
                  </group>
                </DragControls>
              )}

              {items.footrest && (
                <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                  <group position={[0, 0, 0.2]}>
                    <Footrest />
                  </group>
                </DragControls>
              )}

              {/* Movable Items on Desk Surface (Y = 0.775) */}
              {items.desk && (
                <group position={[0, 0.775, 0]}>
                  {items.deskMat && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0, 0, 0.1]}>
                        <DeskMat />
                      </group>
                    </DragControls>
                  )}
                  
                  {/* Monitor Setup Group */}
                  {(items.monitor || items.monitorStand) && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0, 0, -0.2]}>
                        {items.monitorStand && <MonitorStand />}
                        {items.monitor && (
                          <group position={[0, items.monitorStand ? 0.06 : 0, 0]}>
                            <MonitorScreen />
                          </group>
                        )}
                      </group>
                    </DragControls>
                  )}

                  {/* Laptop Setup Group */}
                  {(items.laptop || items.laptopStand) && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[-0.4, 0, 0]}>
                        {items.laptopStand && <LaptopStand />}
                        {items.laptop && (
                          <group 
                            position={[0, items.laptopStand ? 0.12 : 0, items.laptopStand ? -0.01 : 0]}
                            rotation={[items.laptopStand ? Math.PI / 6 : 0, 0, 0]}
                          >
                            <group position={[0, items.laptopStand ? 0.005 : 0, 0]}>
                              <Laptop />
                            </group>
                          </group>
                        )}
                      </group>
                    </DragControls>
                  )}

                  {items.phoneStand && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0.4, 0, 0]}>
                        <PhoneStand />
                      </group>
                    </DragControls>
                  )}

                  {items.light && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[-0.6, 0, -0.2]}>
                        <LightBar />
                      </group>
                    </DragControls>
                  )}

                  {items.pomodoro && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0.3, 0, -0.2]}>
                        <PomodoroClock />
                      </group>
                    </DragControls>
                  )}

                  {items.keyboard && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0, 0, 0.15]}>
                        <Keyboard />
                      </group>
                    </DragControls>
                  )}

                  {items.mouse && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0.3, 0, 0.15]}>
                        <Mouse />
                      </group>
                    </DragControls>
                  )}

                  {items.plant && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0.6, 0, -0.2]}>
                        <Plant />
                      </group>
                    </DragControls>
                  )}

                  {items.mug && (
                    <DragControls axisLock="y" onDragStart={() => setControlsEnabled(false)} onDragEnd={() => setControlsEnabled(true)}>
                      <group position={[0.4, 0, -0.1]}>
                        <Mug />
                      </group>
                    </DragControls>
                  )}
                </group>
              )}
            </group>
          </Suspense>

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={1.5} maxDistance={6} enabled={controlsEnabled} />
        </Canvas>
        
        <div className="absolute top-4 left-4 rounded-lg bg-white/80 p-3 text-sm shadow-sm backdrop-blur pointer-events-none">
          <p className="font-mono text-slate-700 font-medium">💡 Trải nghiệm không gian 3D</p>
          <ul className="font-mono text-slate-500 text-xs mt-1 space-y-1">
            <li>• Kéo thả đồ vật để di chuyển</li>
            <li>• Chuột trái ra ngoài để xoay</li>
            <li>• Cuộn chuột để thu phóng</li>
          </ul>
        </div>
      </div>

      <div className="w-full md:w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Không gian 3D</h2>
        <p className="mb-6 text-sm text-slate-500">Tùy chỉnh góc làm việc lý tưởng của bạn</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Smart Workspace</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.desk} onChange={() => toggleItem('desk')} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="font-medium text-slate-700 text-sm">Bàn nâng hạ Smart Desk</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.chair} onChange={() => toggleItem('chair')} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="font-medium text-slate-700 text-sm">Ghế công thái học Ergo</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Ergonomic Comfort Kit</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.laptopStand} onChange={() => toggleItem('laptopStand')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Giá đỡ Laptop</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.footrest} onChange={() => toggleItem('footrest')} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="font-medium text-slate-700 text-sm">Kê chân (Footrest)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.deskMat} onChange={() => toggleItem('deskMat')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Thảm trải bàn (Desk Mat)</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Desk Expansion Kit</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.monitorStand} onChange={() => toggleItem('monitorStand')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Kệ nâng màn hình</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.monitor} onChange={() => toggleItem('monitor')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Màn hình máy tính</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.phoneStand} onChange={() => toggleItem('phoneStand')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Giá điện thoại</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.light} onChange={() => toggleItem('light')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Đèn màn hình (Light bar)</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Focus Desk Kit</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.pomodoro} onChange={() => toggleItem('pomodoro')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Đồng hồ Pomodoro</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Thiết bị & Đồ trang trí</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.laptop} onChange={() => toggleItem('laptop')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Laptop</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.keyboard} onChange={() => toggleItem('keyboard')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Bàn phím</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.mouse} onChange={() => toggleItem('mouse')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Chuột máy tính</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.plant} onChange={() => toggleItem('plant')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Cây cảnh để bàn</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-3 hover:bg-slate-50 transition">
                <input type="checkbox" checked={items.mug} onChange={() => toggleItem('mug')} disabled={!items.desk} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50" />
                <span className={`font-medium text-sm ${!items.desk ? 'text-slate-400' : 'text-slate-700'}`}>Cốc cafe</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="mb-3 font-semibold text-slate-800">Tùy chỉnh màu sắc</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-600">Màu mặt bàn</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeskColor('#8b5a2b')} className={`h-8 w-8 rounded-full bg-[#8b5a2b] shadow-sm ring-offset-2 transition ${deskColor === '#8b5a2b' ? 'ring-2 ring-primary' : ''}`} title="Gỗ sồi" />
                  <button onClick={() => setDeskColor('#4a3b32')} className={`h-8 w-8 rounded-full bg-[#4a3b32] shadow-sm ring-offset-2 transition ${deskColor === '#4a3b32' ? 'ring-2 ring-primary' : ''}`} title="Gỗ óc chó" />
                  <button onClick={() => setDeskColor('#e2e8f0')} className={`h-8 w-8 rounded-full bg-slate-200 shadow-sm ring-offset-2 transition ${deskColor === '#e2e8f0' ? 'ring-2 ring-primary' : ''}`} title="Trắng" />
                  <button onClick={() => setDeskColor('#1e293b')} className={`h-8 w-8 rounded-full bg-slate-800 shadow-sm ring-offset-2 transition ${deskColor === '#1e293b' ? 'ring-2 ring-primary' : ''}`} title="Đen" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-600">Màu ghế</p>
                <div className="flex gap-2">
                  <button onClick={() => setChairColor('#1e1e1e')} className={`h-8 w-8 rounded-full bg-[#1e1e1e] shadow-sm ring-offset-2 transition ${chairColor === '#1e1e1e' ? 'ring-2 ring-primary' : ''}`} title="Đen tuyền" />
                  <button onClick={() => setChairColor('#94a3b8')} className={`h-8 w-8 rounded-full bg-slate-400 shadow-sm ring-offset-2 transition ${chairColor === '#94a3b8' ? 'ring-2 ring-primary' : ''}`} title="Xám nhạt" />
                  <button onClick={() => setChairColor('#f1f5f9')} className={`h-8 w-8 rounded-full bg-slate-100 shadow-sm ring-offset-2 transition ${chairColor === '#f1f5f9' ? 'ring-2 ring-primary' : ''}`} title="Trắng" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 pb-8">
          <a href="/lien-he" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90">
            <MessageCircle size={18} />
            Liên hệ tư vấn setup
          </a>
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <Camera size={16} />
              Chụp ảnh
            </button>
            <button 
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Làm lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
