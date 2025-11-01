"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Loader2, Download, Upload, Mail, Server, Lock, Key, Globe, Info, HelpCircle, User } from "lucide-react"
import { createEmailAccount } from "@/app/actions/email-accounts"
import { toast } from "sonner"
import CSVFieldMappingModal from "./csv-field-mapping-modal"

interface AddEmailAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddEmailAccountModal({ isOpen, onClose }: AddEmailAccountModalProps) {
  const [activeTab, setActiveTab] = useState("smtp")
  const [smtpPort, setSmtpPort] = useState("465")
  const [imapPort, setImapPort] = useState("993")
  const [emailQuality, setEmailQuality] = useState<"average" | "good" | "great">("average")
  const [showQualityTooltip, setShowQualityTooltip] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [showMappingModal, setShowMappingModal] = useState(false)

  if (!isOpen) return null

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const getQualityTooltipText = () => {
    return (
      <div className="p-3 text-xs">
        <p className="font-medium mb-1">Email Quality Levels:</p>
        <div className="mb-2">
          <span className="font-medium">Average:</span> New email or not warmed up yet.
        </div>
        <div className="mb-2">
          <span className="font-medium">Good:</span> Email under three months old or in the process of warming up.
        </div>
        <div>
          <span className="font-medium">Great:</span> Email older than three months and fully warmed up, ready for
          outreach.
        </div>
      </div>
    )
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("email_quality", emailQuality)

      const result = await createEmailAccount(formData)

      if (result.success) {
        toast.success("Email account connected successfully!")
        onClose()
      } else {
        toast.error(result.error || "Failed to connect email account")
      }
    } catch (error) {
      toast.error("Error connecting email account")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string
        const lines = csv.split("\n").filter((line) => line.trim())

        if (lines.length < 2) {
          toast.error("CSV file must have at least a header row and one data row")
          return
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ""
          })
          return row
        })

        setCsvHeaders(headers)
        setCsvData(data)
        setShowMappingModal(true)
      } catch (error) {
        toast.error("Error parsing CSV file")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card backdrop-filter backdrop-blur-xl rounded-2xl w-full max-w-[550px] border border-border shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header with glassmorphism effect */}
        <div className="flex justify-between items-center p-3 border-b border-border bg-card">
          <h2 className="text-lg font-bold text-foreground">Add Email Account</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs with glassmorphism effect */}
        <div className="flex border-b border-border bg-card">
          {["smtp", "bulk"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-2 text-center text-sm transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "smtp"
                ? "SMTP/IMAP"
                : tab === "bulk"
                  ? "Bulk Upload"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-3">
          {activeTab === "smtp" && (
            <form className="space-y-4" onSubmit={handleSubmitForm}>
              {/* Account Information */}
              <div className="bg-background/50 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm">
                <div className="mb-3 flex items-center">
                  <User className="w-4 h-4 text-foreground mr-2" />
                  <h3 className="text-base font-semibold text-foreground">Account Information</h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="first-name" className="block text-xs font-medium text-foreground">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="first-name"
                          name="first_name"
                          placeholder="First name"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="last-name" className="block text-xs font-medium text-foreground">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="last-name"
                          name="last_name"
                          placeholder="Last name"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMTP Configuration */}
              <div className="bg-background/50 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm">
                <div className="mb-3 flex items-center">
                  <Mail className="w-4 h-4 text-foreground mr-2" />
                  <h3 className="text-base font-semibold text-foreground">SMTP Configuration</h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="smtp-email" className="block text-xs font-medium text-foreground">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="email"
                          id="smtp-email"
                          name="email_address"
                          placeholder="email@example.com"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="smtp-username" className="block text-xs font-medium text-foreground">
                        Username <span className="text-muted-foreground text-xs">(if different)</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="smtp-username"
                          name="smtp_username"
                          placeholder="SMTP username"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="smtp-password" className="block text-xs font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                      <input
                        type="password"
                        id="smtp-password"
                        name="smtp_password"
                        placeholder="••••••••"
                        className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="smtp-server" className="block text-xs font-medium text-foreground">
                        SMTP Server
                      </label>
                      <div className="relative">
                        <Server className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="smtp-server"
                          name="smtp_host"
                          placeholder="smtp.example.com"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="smtp-port" className="block text-xs font-medium text-foreground">
                        SMTP Port
                      </label>
                      <select
                        id="smtp-port"
                        name="smtp_port"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all appearance-none"
                      >
                        <option value="465">465 (SSL)</option>
                        <option value="587">587 (TLS)</option>
                        <option value="25">25 (Non-encrypted)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAP Configuration */}
              <div className="bg-background/50 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm">
                <div className="mb-3 flex items-center">
                  <Globe className="w-4 h-4 text-foreground mr-2" />
                  <h3 className="text-base font-semibold text-foreground">IMAP Configuration</h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="imap-user" className="block text-xs font-medium text-foreground">
                        User
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="imap-user"
                          name="imap_username"
                          placeholder="username@example.com"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="imap-password" className="block text-xs font-medium text-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="password"
                          id="imap-password"
                          name="imap_password"
                          placeholder="••••••••"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="imap-host" className="block text-xs font-medium text-foreground">
                        Host
                      </label>
                      <div className="relative">
                        <Server className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <input
                          type="text"
                          id="imap-host"
                          name="imap_host"
                          placeholder="imap.example.com"
                          className="w-full bg-background border border-input rounded-lg py-1.5 pl-8 pr-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="imap-port" className="block text-xs font-medium text-foreground">
                        Port
                      </label>
                      <select
                        id="imap-port"
                        name="imap_port"
                        value={imapPort}
                        onChange={(e) => setImapPort(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all appearance-none"
                      >
                        <option value="993">993 (SSL)</option>
                        <option value="143">143 (Non-SSL)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Quality Section */}
              <div className="bg-background/50 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm">
                <div className="mb-3 flex items-center">
                  <Mail className="w-4 h-4 text-foreground mr-2" />
                  <h3 className="text-base font-semibold text-foreground">Email Quality</h3>
                  <div className="relative ml-1">
                    <HelpCircle
                      className="w-4 h-4 text-muted-foreground cursor-help"
                      onMouseEnter={() => setShowQualityTooltip(true)}
                      onMouseLeave={() => setShowQualityTooltip(false)}
                    />
                    {showQualityTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-popover text-popover-foreground rounded-md shadow-md z-50">
                        {getQualityTooltipText()}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-popover"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setEmailQuality("average")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      emailQuality === "average"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-background/80"
                    } transition-all`}
                  >
                    <span className="text-sm font-medium">Average</span>
                    <span className="text-xs text-muted-foreground mt-1">New email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailQuality("good")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      emailQuality === "good"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-background/80"
                    } transition-all`}
                  >
                    <span className="text-sm font-medium">Good</span>
                    <span className="text-xs text-muted-foreground mt-1">Warming up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailQuality("great")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      emailQuality === "great"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-background/80"
                    } transition-all`}
                  >
                    <span className="text-sm font-medium">Great</span>
                    <span className="text-xs text-muted-foreground mt-1">Fully warmed</span>
                  </button>
                </div>
              </div>

              {/* Help Text */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground px-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p>
                  Need help? Check our{" "}
                  <a href="#" className="text-foreground hover:underline">
                    documentation
                  </a>{" "}
                  for common email providers.
                </p>
              </div>

              {/* Connect Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg text-sm font-medium transition-all shadow-sm mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Connect Account"
                )}
              </button>
            </form>
          )}

          {activeTab === "bulk" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-foreground">Upload CSV File</h3>
                <button className="flex items-center gap-1.5 text-xs bg-secondary hover:bg-secondary/80 text-foreground py-1.5 px-3 rounded-lg transition-all backdrop-blur-sm">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              <div
                className="bg-background/50 backdrop-blur-md border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-background/70 transition-all"
                onClick={handleFileUploadClick}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-foreground" />
                  </div>
                  <h4 className="text-sm font-medium mb-1 text-foreground">Click to upload or drag and drop</h4>
                  <p className="text-xs text-muted-foreground mb-1">CSV file with email account details</p>
                  <p className="text-xs text-muted-foreground">Supported formats: CSV, XLSX</p>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg text-sm font-medium transition-all shadow-sm">
                Connect Account
              </button>
            </div>
          )}
        </div>
        <CSVFieldMappingModal
          isOpen={showMappingModal}
          onClose={() => setShowMappingModal(false)}
          csvData={csvData}
          csvHeaders={csvHeaders}
        />
      </div>
    </div>
  )
}
