import { Star } from 'lucide-react'

export default function Rating() {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={15} fill="currentColor" />
      ))}
    </div>
  )
}
