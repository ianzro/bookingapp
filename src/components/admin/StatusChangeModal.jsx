import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { StatusBadge } from '../ui/Badge'

const TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['arrived', 'cancelled', 'no_show'],
  arrived:   ['completed'],
  completed: [],
  cancelled: [],
  no_show:   [],
}

const REASON_REQUIRED = ['cancelled', 'no_show']

const LABELS = {
  confirmed: 'Confirm',
  arrived:   'Mark Arrived',
  completed: 'Mark Completed',
  cancelled: 'Cancel Appointment',
  no_show:   'Mark No-Show',
}

export default function StatusChangeModal({ open, onClose, booking, onSave }) {
  const [next, setNext] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const transitions = booking ? TRANSITIONS[booking.status] || [] : []

  function handleOpen() {
    setNext('')
    setReason('')
    setError('')
  }

  function handleSave() {
    if (!next) { setError('Select a new status.'); return }
    if (REASON_REQUIRED.includes(next) && !reason.trim()) {
      setError('A reason is required for this status change.')
      return
    }
    onSave({ status: next, cancelReason: REASON_REQUIRED.includes(next) ? reason.trim() : null })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Change Appointment Status" size="sm">
      {booking && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-brand-slate">
            Current status: <StatusBadge status={booking.status} />
          </div>

          {transitions.length === 0 ? (
            <p className="text-sm text-brand-slate/70">No further status changes are available.</p>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-slate mb-3">
                  Change to
                </p>
                <div className="space-y-2">
                  {transitions.map(t => (
                    <button
                      key={t}
                      onClick={() => { setNext(t); setError('') }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        next === t
                          ? 'border-brand-teal bg-brand-teal/5 text-brand-teal font-medium'
                          : 'border-gray-200 text-brand-slate hover:border-brand-teal/40'
                      }`}
                    >
                      {LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              {next && REASON_REQUIRED.includes(next) && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
                    Reason *
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={e => { setReason(e.target.value); setError('') }}
                    placeholder={next === 'cancelled' ? 'Reason for cancellation…' : 'Reason for no-show…'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-navy
                      placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-3 pt-1">
                <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                <Button
                  variant={next === 'cancelled' || next === 'no_show' ? 'danger' : 'primary'}
                  onClick={handleSave}
                  className="flex-1"
                  disabled={!next}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
