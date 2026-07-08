import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export default function SearchableSelectField({ label, value, onChange, options, disabled = false, placeholder = 'Chọn...', name, className = '', required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset search term when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen])

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`block ${className}`} ref={containerRef}>
      <span className="mb-2 block font-mono text-sm font-medium text-on-surface">{label}</span>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-12 w-full items-center justify-between rounded-lg border border-border-subtle bg-white px-4 text-left text-base text-on-surface outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 ${disabled ? 'opacity-70 bg-surface-container cursor-not-allowed' : ''}`}
        >
          <span className={`truncate ${value ? 'text-on-surface' : 'text-on-surface-variant'}`}>
            {value || placeholder}
          </span>
          <ChevronDown size={16} className={`shrink-0 text-on-surface-variant transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border-subtle bg-white shadow-lg">
            <div className="sticky top-0 bg-white p-2 border-b border-border-subtle">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="h-8 w-full rounded-md border border-border-subtle pl-8 pr-3 text-sm outline-none focus:border-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-on-surface-variant text-center">Không tìm thấy kết quả</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-surface ${value === opt ? 'bg-blue-50 text-secondary font-medium' : 'text-on-surface'}`}
                    onClick={() => {
                      onChange({ target: { name, value: opt } })
                      setIsOpen(false)
                    }}
                  >
                    <span className="truncate pr-4">{opt}</span>
                    {value === opt && <Check size={16} className="shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {/* Hidden input to pass value in native forms like Checkout */}
      {name && <input type="hidden" name={name} value={value} required={required} />}
    </div>
  )
}
