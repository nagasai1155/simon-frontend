"use client"

import { useState } from "react"
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { createBulkEmailAccounts } from "@/app/actions/email-accounts"
import { toast } from "sonner"

interface CSVFieldMappingModalProps {
  isOpen: boolean
  onClose: () => void
  csvData: any[]
  csvHeaders: string[]
}

const REQUIRED_FIELDS = [
  { key: "email_address", label: "Email Address", required: true },
  { key: "password", label: "Password", required: true },
  { key: "first_name", label: "First Name", required: true },
  { key: "last_name", label: "Last Name", required: true },
  { key: "smtp_host", label: "SMTP Host", required: true },
  { key: "smtp_port", label: "SMTP Port", required: true },
  { key: "imap_host", label: "IMAP Host", required: true },
  { key: "imap_port", label: "IMAP Port", required: true },
  { key: "smtp_username", label: "SMTP Username", required: false },
  { key: "imap_username", label: "IMAP Username", required: false },
  { key: "health", label: "Email Quality", required: false },
  { key: "daily_limit", label: "Daily Limit", required: false },
  { key: "linkedin", label: "LinkedIn Profile", required: false },
]

export default function CSVFieldMappingModal({ isOpen, onClose, csvData, csvHeaders }: CSVFieldMappingModalProps) {
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleFieldMapping = (dbField: string, csvColumn: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [dbField]: csvColumn,
    }))
  }

  const validateMapping = () => {
    const requiredFields = REQUIRED_FIELDS.filter((field) => field.required)
    const mappedRequiredFields = requiredFields.filter((field) => fieldMapping[field.key])
    return mappedRequiredFields.length === requiredFields.length
  }

  const handleImport = async () => {
    if (!validateMapping()) {
      toast.error("Please map all required fields")
      return
    }

    setIsProcessing(true)
    try {
      const mappedData = csvData.map((row) => {
        const mappedRow: any = {}

        Object.entries(fieldMapping).forEach(([dbField, csvColumn]) => {
          if (csvColumn && row[csvColumn] !== undefined) {
            let value = row[csvColumn]

            // Handle special field transformations
            if (dbField === "smtp_port" || dbField === "imap_port") {
              value = Number.parseInt(value) || (dbField === "smtp_port" ? 587 : 993)
            } else if (dbField === "daily_limit") {
              value = Number.parseInt(value) || 50
            } else if (dbField === "health") {
              value = value || "average"
            }

            mappedRow[dbField] = value
          }
        })

        // Set defaults for unmapped optional fields
        if (!mappedRow.daily_limit) mappedRow.daily_limit = 50
        if (!mappedRow.health) mappedRow.health = "average"
        if (!mappedRow.smtp_username) mappedRow.smtp_username = mappedRow.email_address
        if (!mappedRow.imap_username) mappedRow.imap_username = mappedRow.email_address

        return mappedRow
      })

      const result = await createBulkEmailAccounts(mappedData)

      if (result.success) {
        toast.success(`Successfully imported ${mappedData.length} email accounts`)
        onClose()
      } else {
        toast.error(result.error || "Failed to import email accounts")
      }
    } catch (error) {
      toast.error("Error processing CSV data")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card backdrop-filter backdrop-blur-xl rounded-2xl w-full max-w-4xl border border-border shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Map CSV Fields</h2>
            <p className="text-sm text-muted-foreground">Map your CSV columns to database fields</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Found {csvData.length} rows in your CSV. Map the columns below to import your email accounts.
            </p>
          </div>

          {/* Field Mapping */}
          <div className="space-y-3 mb-6">
            {REQUIRED_FIELDS.map((field) => (
              <div
                key={field.key}
                className="flex items-center gap-4 p-3 bg-background/50 rounded-lg border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    {field.required && <span className="text-xs text-red-500">*</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">Database field: {field.key}</p>
                </div>
                <div className="flex-1">
                  <select
                    value={fieldMapping[field.key] || ""}
                    onChange={(e) => handleFieldMapping(field.key, e.target.value)}
                    className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select CSV column...</option>
                    {csvHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-8 flex justify-center">
                  {field.required && fieldMapping[field.key] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : field.required ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : fieldMapping[field.key] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          {csvData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Preview (First 3 rows)</h3>
              <div className="bg-background/50 rounded-lg border border-border p-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {csvHeaders.map((header) => (
                        <th key={header} className="text-left p-2 text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 3).map((row, index) => (
                      <tr key={index} className="border-b border-border/50">
                        {csvHeaders.map((header) => (
                          <td key={header} className="p-2 text-foreground">
                            {row[header] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!validateMapping() || isProcessing}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import {csvData.length} Accounts</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
