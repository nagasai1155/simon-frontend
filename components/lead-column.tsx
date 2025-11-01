import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Lead } from "@/app/actions/sales-pipeline"

export interface LeadColumnProps {
  title: string
  leads: Lead[]
  className?: string
}

/**
 * Simple column used by the Kanban board.
 * It doesn’t handle drag-and-drop itself (the board does);
 * it only renders the list of leads it receives.
 */
function LeadColumn({ title, leads, className }: LeadColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3 min-w-[260px]", className)}>
      <h3 className="text-base font-semibold px-2">{title}</h3>

      {leads.length === 0 && <p className="text-muted-foreground px-2 text-sm">No leads</p>}

      {leads.map((lead) => (
        <Card key={lead.id} className="bg-card/50 border border-border shadow-sm p-3 text-sm">
          <p className="font-medium">{lead.contact_name}</p>
          <p className="text-muted-foreground">{lead.company_name}</p>
        </Card>
      ))}
    </div>
  )
}

export default LeadColumn
export { LeadColumn } // optional named export for flexibility
