import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { Users } from 'lucide-react'

export default function PatientsPage() {
  return (
    <div>
      <PageHeader title="Patients" subtitle="Patient records and history" />
      <Card className="p-12 text-center">
        <Users size={40} className="text-brand-teal/30 mx-auto mb-3" />
        <p className="text-brand-slate text-sm">Full patient records coming in a future milestone.</p>
      </Card>
    </div>
  )
}
