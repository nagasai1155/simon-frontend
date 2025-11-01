"use client"

import { useState, useEffect } from "react"
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { createLeadsFromCSV } from "@/app/actions/lead-lists"
import { toast } from "sonner"

interface LeadMappingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  csvData: any[]
  csvHeaders: string[]
  leadListId: string
}

/* -------------------------------------------------------------------------- */
/* ➊ Add LinkedIn support here – it is NOT required, just optional            */
/* -------------------------------------------------------------------------- */
const REQUIRED_FIELDS = [
  {
    key: "contact_name",
    label: "Contact Name",
    required: true,
    suggestions: ["name", "contact_name", "full_name", "contact", "first_name", "last_name"],
  },
  {
    key: "email",
    label: "Email Address",
    required: true,
    suggestions: ["email", "email_address", "mail", "e_mail", "Email", "Email Address"],
  },
  {
    key: "phone",
    label: "Phone Number",
    required: false,
    suggestions: ["phone", "phone_number", "mobile", "cell", "telephone", "Phone"],
  },
  {
    key: "company_name",
    label: "Company Name",
    required: false,
    suggestions: ["company", "company_name", "organization", "business"],
  },
  {
    key: "linkedin",
    label: "LinkedIn Profile",
    required: false,
    suggestions: ["linkedin", "linkedin_profile", "linkedin_url", "LinkedIn", "LinkedIn Profile"],
  },
  {
    key: "notes",
    label: "Notes",
    required: false,
    suggestions: ["notes", "comments", "description", "remarks"],
  },
]

export default function LeadMappingModal({
  isOpen,
  onClose,
  onComplete,
  csvData,
  csvHeaders,
  leadListId,
}: LeadMappingModalProps) {
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  /* ------------------------------------------------------------ */
  /* Auto-map fields (now includes LinkedIn)                      */
  /* ------------------------------------------------------------ */
  const autoMapFields = () => {
    const mapping: Record<string, string> = {}

    REQUIRED_FIELDS.forEach((field) => {
      const matchedHeader = csvHeaders.find((header) =>
        field.suggestions.some((suggestion) => header.toLowerCase().includes(suggestion.toLowerCase())),
      )
      if (matchedHeader) mapping[field.key] = matchedHeader
    })

    setFieldMapping(mapping)
  }

  useEffect(() => {
    if (isOpen && csvHeaders.length) autoMapFields()
  }, [isOpen, csvHeaders])

  if (!isOpen) return null

  /* ------------------------------------------------------------ */
  /* Helpers                                                      */
  /* ------------------------------------------------------------ */
  const handleFieldMapping = (dbField: string, csvColumn: string) => {
    setFieldMapping((prev) => ({ ...prev, [dbField]: csvColumn }))
  }

  const validateMapping = () => REQUIRED_FIELDS.filter((f) => f.required).every((f) => fieldMapping[f.key])

  /* ------------------------------------------------------------ */
  /* Import                                                       */
  /* ------------------------------------------------------------ */
  const handleImport = async () => {
    if (!validateMapping()) {
      toast.error("Please map all required fields (Contact Name and Email)")
      return
    }

    setIsProcessing(true)
    try {
      const mappedData = csvData
        .map((row, idx) => {
          const out: any = {}

          Object.entries(fieldMapping).forEach(([dbField, csvCol]) => {
            if (csvCol) out[dbField] = String(row[csvCol] ?? "").trim()
          })

          // fallback values
          if (!out.contact_name) out.contact_name = `Contact ${idx + 1}`
          if (!out.email) out.email = ""

          return out
        })
        .filter((r) => r.contact_name && r.email)

      if (!mappedData.length) {
        toast.error("No valid contacts found")
        return
      }

      const res = await createLeadsFromCSV(leadListId, mappedData)
      if (res.success) {
        toast.success(`Imported ${mappedData.length} contacts`)
        onComplete()
      } else toast.error(res.error ?? "Failed to import leads")
    } catch (e) {
      toast.error("Unexpected error importing leads")
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  /* ------------------------------------------------------------ */
  /* UI                                                           */
  /* ------------------------------------------------------------ */
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-5xl border shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Map CSV Fields</h2>
            <p className="text-sm text-muted-foreground">Match your CSV columns to lead fields</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Mapping rows */}
          <div className="space-y-4 mb-6">
            {REQUIRED_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{field.key}</p>
                </div>

                <select
                  value={fieldMapping[field.key] ?? ""}
                  onChange={(e) => handleFieldMapping(field.key, e.target.value)}
                  className="flex-1 bg-background border rounded px-3 py-2 text-sm"
                >
                  <option value="">Select CSV column…</option>
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <div className="w-5 flex justify-center">
                  {field.required ? (
                    fieldMapping[field.key] ? (
                      <CheckCircle className="text-green-500 w-4 h-4" />
                    ) : (
                      <AlertCircle className="text-red-500 w-4 h-4" />
                    )
                  ) : fieldMapping[field.key] ? (
                    <CheckCircle className="text-green-500 w-4 h-4" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 bg-secondary py-3 rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isProcessing || !validateMapping()}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Importing…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Import Contacts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
