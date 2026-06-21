import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { CalendarDays } from 'lucide-react'

export default function AppointmentsPage() {
  return (
    <div>
      <PageHeader title="Appointments" subtitle="Manage your clinic schedule" />
      <Card className="p-12 text-center">
        <CalendarDays size={40} className="text-brand-teal/30 mx-auto mb-3" />
        <p className="text-brand-slate text-sm">Full appointment management coming in the next milestone.</p>
      </Card>
    </div>
  )
}
