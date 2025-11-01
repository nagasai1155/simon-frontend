"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, Globe, Linkedin, Calendar, User, Building, MapPin, Briefcase, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface LeadDetailModalProps {
  isOpen: boolean
  onClose: () => void
  lead: any // Full lead data from Supabase
}

export default function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toast } = useToast()

  if (!isOpen || !lead) return null

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast({
        title: "Copied to clipboard",
        description: `${fieldName} copied successfully`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "Not provided"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (typeof value === "object") return JSON.stringify(value, null, 2)
    return String(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      case "contacted":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "appointment booked":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "replied":
        return <CheckCircle className="w-4 h-4 text-amber-500" />
      case "booked":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-800"
      case "contacted":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
      case "appointment booked":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
      case "replied":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800"
      case "booked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-5xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{lead.contact_name || "Unknown Contact"}</h2>
              <p className="text-muted-foreground">{lead.company_name || "Unknown Company"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Using overflow-y-auto instead of ScrollArea */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.contact_name)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.contact_name || "", "Full Name")}
                      >
                        {copiedField === "Full Name" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.email)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.email || "", "Email")}
                      >
                        {copiedField === "Email" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Work Number</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.work_number)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.work_number || "", "Work Number")}
                      >
                        {copiedField === "Work Number" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Personal Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.personal_phone_number)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.personal_phone_number || "", "Personal Phone")}
                      >
                        {copiedField === "Personal Phone" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.job_title)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.job_title || "", "Job Title")}
                      >
                        {copiedField === "Job Title" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.company_name)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.company_name || "", "Company Name")}
                      >
                        {copiedField === "Company Name" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.industry)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.industry || "", "Industry")}
                      >
                        {copiedField === "Industry" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.location)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.location || "", "Location")}
                      >
                        {copiedField === "Location" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {lead.website ? (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          {formatValue(lead.website)} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm">{formatValue(lead.website)}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.website || "", "Website")}
                      >
                        {copiedField === "Website" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      {lead.linkedin ? (
                        <a
                          href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          {formatValue(lead.linkedin)} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm">{formatValue(lead.linkedin)}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.linkedin || "", "LinkedIn")}
                      >
                        {copiedField === "LinkedIn" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company Description</label>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatValue(lead.company_short_description)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.company_short_description || "", "Company Description")}
                      >
                        {copiedField === "Company Description" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Status & Campaign */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Lead Status & Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lead.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(lead.status)}
                      >
                        {lead.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Type of Lead</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead["type of lead"])}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead["type of lead"] || "", "Type of Lead")}
                      >
                        {copiedField === "Type of Lead" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">ICP Type</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.icp_type)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.icp_type || "", "ICP Type")}
                      >
                        {copiedField === "ICP Type" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Called or Not</label>
                    <div className="flex items-center gap-2">
                      {lead.called_or_not ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{lead.called_or_not ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Sequence Started</label>
                    <div className="flex items-center gap-2">
                      {lead.email_sequence_started ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{lead.email_sequence_started ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Opened Count</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.email_opened_count)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.reoon_email_verification)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.reoon_email_verification || "", "Email Verification")}
                      >
                        {copiedField === "Email Verification" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communication Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communication Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Messages Sent</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.sms_messages_sent)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last SMS Sent</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_sms_sent)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.last_sms_sent || "", "Last SMS")}
                      >
                        {copiedField === "Last SMS" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last SMS Sent</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_sms_sent_number)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Opened</label>
                    <div className="flex items-center gap-2">
                      {lead.email_opened ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{lead.email_opened ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Sent</label>
                    <div className="flex items-center gap-2">
                      {lead.email_sent ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{lead.email_sent ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last Email Opened Step</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_email_opened_step)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.last_email_opened_step || "", "Last Email Opened Step")}
                      >
                        {copiedField === "Last Email Opened Step" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last Email Opened Variant</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_email_opened_variant)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.last_email_opened_variant || "", "Last Email Opened Variant")}
                      >
                        {copiedField === "Last Email Opened Variant" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last Email Sent Step</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_email_sent_step)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.last_email_sent_step || "", "Last Email Sent Step")}
                      >
                        {copiedField === "Last Email Sent Step" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Last Email Sent Variant</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{formatValue(lead.last_email_sent_variant)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.last_email_sent_variant || "", "Last Email Sent Variant")}
                      >
                        {copiedField === "Last Email Sent Variant" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Content */}
            {(lead.last_email_sent_subject || lead.last_email_sent_body) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Last Sent Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lead.last_email_sent_subject && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Subject</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{formatValue(lead.last_email_sent_subject)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(lead.last_email_sent_subject || "", "Email Subject")}
                        >
                          {copiedField === "Email Subject" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  )}
                  {lead.last_email_sent_body && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Body</label>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{formatValue(lead.last_email_sent_body)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(lead.last_email_sent_body || "", "Email Body")}
                      >
                        {copiedField === "Email Body" ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                        Copy Email Body
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Call Summary */}
            {lead.call_summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Call Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{formatValue(lead.call_summary)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => copyToClipboard(lead.call_summary || "", "Call Summary")}
                  >
                    {copiedField === "Call Summary" ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                    Copy Call Summary
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timestamps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {lead.updated_at ? format(new Date(lead.updated_at), "PPP 'at' p") : "Not provided"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(lead.updated_at || "", "Updated At")}
                      >
                        {copiedField === "Updated At" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}