import { organizeLeadsByStatus } from "@/lib/utils"
import { getAllLeads } from "@/actions/lead"
import LeadColumn from "@/components/lead-column"

export default async function BoardPage() {
  const leads = await getAllLeads()
  const columns = await organizeLeadsByStatus(leads)

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <LeadColumn key={column.id} title={column.title} leads={column.leads} />
      ))}
    </div>
  )
}
