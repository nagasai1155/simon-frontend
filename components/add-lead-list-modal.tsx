"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, FileText, Users, Loader2, Plus, UserPlus } from "lucide-react"
import { createLeadList, createManualLead } from "@/app/actions/lead-lists"
import { toast } from "sonner"
import LeadMappingModal from "./lead-mapping-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddLeadListModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddLeadListModal({ isOpen, onClose }: AddLeadListModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [leadListId, setLeadListId] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("csv")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Manual lead form state
  const [manualLead, setManualLead] = useState({
    contact_name: "",
    email: "",
    phone: "",
    company_name: "",
    linkedin: "",
    notes: "",
  })

  if (!isOpen) return null

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleCSVSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      if (!selectedFile) {
        toast.error("Please select a CSV file")
        return
      }

      console.log("Starting lead list creation...")
      const result = await createLeadList(formData)

      if (result.success && result.data) {
        console.log("Lead list created, opening mapping modal...")
        setLeadListId(result.data.leadListId)
        setCsvHeaders(result.data.headers)
        setCsvData(result.data.csvData)
        setShowMappingModal(true)
        toast.success("Lead list created! Now map your CSV columns.")
      } else {
        console.error("Lead list creation failed:", result.error)
        toast.error(result.error || "Failed to create lead list")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Error processing your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const leadListName = formData.get("leadListName") as string

      if (!leadListName.trim()) {
        toast.error("Please enter a lead list name")
        return
      }

      if (!manualLead.contact_name.trim() || !manualLead.email.trim()) {
        toast.error("Contact name and email are required")
        return
      }

      console.log("Creating manual lead...")
      const result = await createManualLead(leadListName, manualLead)

      if (result.success) {
        toast.success("Lead added successfully!")
        handleModalClose()
      } else {
        console.error("Manual lead creation failed:", result.error)
        toast.error(result.error || "Failed to create lead")
      }
    } catch (error) {
      console.error("Manual submit error:", error)
      toast.error("Error processing your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMappingComplete = () => {
    setShowMappingModal(false)
    setSelectedFile(null)
    setLeadListId("")
    setCsvData([])
    setCsvHeaders([])
    onClose()
    toast.success("Lead list and contacts imported successfully!")
  }

  const handleModalClose = () => {
    setShowMappingModal(false)
    setSelectedFile(null)
    setLeadListId("")
    setCsvData([])
    setCsvHeaders([])
    setManualLead({
      contact_name: "",
      email: "",
      phone: "",
      company_name: "",
      linkedin: "",
      notes: "",
    })
    setActiveTab("csv")
    onClose()
  }

  const handleManualLeadChange = (field: string, value: string) => {
    setManualLead((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card backdrop-filter backdrop-blur-xl rounded-2xl w-full max-w-4xl border border-border shadow-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-foreground">Add Leads</h2>
              <p className="text-sm text-muted-foreground">Upload CSV or add leads manually</p>
            </div>
            <button
              onClick={handleModalClose}
              className="text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted rounded-lg p-1">
                <TabsTrigger
                  value="csv"
                  className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>CSV Upload</span>
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Manual Entry</span>
                </TabsTrigger>
              </TabsList>

              {/* CSV Upload Tab */}
              <TabsContent value="csv" className="space-y-6 mt-0">
                <form onSubmit={handleCSVSubmit} className="space-y-6">
                  {/* Lead List Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Lead List Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Enter lead list name"
                        className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-foreground">
                      Description <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Brief description of this lead list"
                      className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">CSV File</label>
                    <div
                      className={`bg-background/50 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-background/70 transition-all ${
                        selectedFile ? "border-green-300 bg-green-50/50" : "border-border"
                      }`}
                      onClick={handleFileUploadClick}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        name="file"
                        className="hidden"
                        accept=".csv"
                        required
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            selectedFile ? "bg-green-100" : "bg-secondary"
                          }`}
                        >
                          <Upload className={`w-6 h-6 ${selectedFile ? "text-green-600" : "text-foreground"}`} />
                        </div>
                        <h4 className="text-sm font-medium mb-1 text-foreground">
                          {selectedFile ? selectedFile.name : "Click to upload CSV"}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Upload your contact list"}
                        </p>
                        <p className="text-xs text-muted-foreground">Supported format: CSV</p>
                      </div>
                    </div>
                  </div>

                  {/* Expected CSV Format */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Expected CSV columns:</p>
                        <p className="text-xs text-muted-foreground">
                          name, email, phone, company, linkedin, notes (or similar column names)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Lead List...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Create Lead List
                      </>
                    )}
                  </button>
                </form>
              </TabsContent>

              {/* Manual Entry Tab */}
              <TabsContent value="manual" className="space-y-6 mt-0">
                <form onSubmit={handleManualSubmit} className="space-y-6">
                  {/* Lead List Name */}
                  <div className="space-y-2">
                    <label htmlFor="leadListName" className="block text-sm font-medium text-foreground">
                      Lead List Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        id="leadListName"
                        name="leadListName"
                        required
                        placeholder="Enter lead list name"
                        className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Manual Lead Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={manualLead.contact_name}
                        onChange={(e) => handleManualLeadChange("contact_name", e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={manualLead.email}
                        onChange={(e) => handleManualLeadChange("email", e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={manualLead.phone}
                        onChange={(e) => handleManualLeadChange("phone", e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Company Name</label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={manualLead.company_name}
                        onChange={(e) => handleManualLeadChange("company_name", e.target.value)}
                        className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={manualLead.linkedin}
                      onChange={(e) => handleManualLeadChange("linkedin", e.target.value)}
                      className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Additional notes about this lead..."
                      value={manualLead.notes}
                      onChange={(e) => handleManualLeadChange("notes", e.target.value)}
                      className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding Lead...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Lead
                      </>
                    )}
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Lead Mapping Modal */}
      <LeadMappingModal
        isOpen={showMappingModal}
        onClose={handleModalClose}
        onComplete={handleMappingComplete}
        csvData={csvData}
        csvHeaders={csvHeaders}
        leadListId={leadListId}
      />
    </>
  )
}
