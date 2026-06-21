import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAvailability } from '../../hooks/useAvailability'
import { formatTime } from '../../utils/dateUtils'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function isoDate(year, month, day) {
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

export default function DateTimePicker({ provider, durationMinutes, selectedDate, selectedSlot, onSelect }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const slots = useAvailability(provider, selectedDate, durationMinutes)

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11) }
    else setViewMonth(m => m-1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0) }
    else setViewMonth(m => m+1)
  }

  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }

  function selectDay(day) {
    onSelect({ date: isoDate(viewYear, viewMonth, day), slot: null })
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-brand-navy">
          <button onClick={prevMonth} className="text-white/70 hover:text-white p-1">
            <ChevronLeft size={18} />
          </button>
          <p className="text-white font-medium text-sm">{MONTHS[viewMonth]} {viewYear}</p>
          <button onClick={nextMonth} className="text-white/70 hover:text-white p-1">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="py-2 text-xs font-semibold text-brand-slate/50">{d}</div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={`e${i}`} />
            const past = isPast(day)
            const dateStr = isoDate(viewYear, viewMonth, day)
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={day}
                disabled={past}
                onClick={() => selectDay(day)}
                className={`py-2 text-sm transition-colors ${
                  past ? 'text-stone-300 cursor-not-allowed' :
                  isSelected ? 'bg-brand-teal text-white font-semibold' :
                  'text-brand-navy hover:bg-brand-teal/10 hover:text-brand-teal'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
            Available Times
          </p>
          {slots.length === 0 ? (
            <p className="text-sm text-brand-slate/70 text-center py-4 bg-white rounded-lg border border-stone-200">
              No available slots on this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map(slot => {
                const isSelected = selectedSlot?.start === slot.start
                return (
                  <button
                    key={slot.start}
                    onClick={() => onSelect({ date: selectedDate, slot })}
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      isSelected
                        ? 'border-brand-teal bg-brand-teal text-white font-medium'
                        : 'border-stone-200 bg-white text-brand-navy hover:border-brand-teal/50 hover:bg-brand-teal/5'
                    }`}
                  >
                    {formatTime(slot.start)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
