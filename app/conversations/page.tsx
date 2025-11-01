"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Bot, Phone, MoreVertical, Trash2, RefreshCw, MessageCircle, Mail, User, MessageSquare, Loader2 } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { getConversations, deleteConversation, type ConversationData } from "@/app/actions/conversations"
import { ConfirmActionModal } from "@/components/confirm-action-modal"

// Client-side contact extraction function
function getContactFromLead(leadData: any) {
  console.log("🔍 Client-side processing lead data:", leadData)

  if (!leadData || typeof leadData !== "object") {
    return {
      name: "Unknown Contact",
      email: "unknown@example.com",
      company: "Unknown Company",
      initials: "UC",
    }
  }

  // Handle different lead data structures
  let lead = leadData

  // If it's a string that looks like JSON, parse it
  if (typeof leadData === "string" && (leadData.startsWith("{") || leadData.startsWith("["))) {
    try {
      lead = JSON.parse(leadData)
      console.log("✅ Parsed lead JSON:", lead)
    } catch (e) {
      console.log("❌ Failed to parse lead JSON:", e)
      lead = {}
    }
  }

  // If it's just an ID string, create fallback data
  if (typeof leadData === "string" && !leadData.startsWith("{")) {
    console.log("🔍 Lead appears to be an ID:", leadData)
    return {
      name: `Contact ${leadData.substring(0, 8)}`,
      email: "contact@example.com",
      company: "Unknown Company",
      initials: "UC",
    }
  }

  // Extract contact information from the lead object
  const name = lead?.contact_name || lead?.name || "Unknown Contact"
  const email = lead?.email || "unknown@example.com"
  const company = lead?.company_name || lead?.company || "Unknown Company"
  const initials =
    name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "UC"

  console.log("✅ Client-side extracted contact info:", { name, email, company, initials })
  return { name, email, company, initials }
}

// Client-side message parsing function
function parseConversationMessages(conversation: ConversationData) {
  console.log("🔍 Parsing messages for conversation:", conversation.id)

  const messages: any[] = []

  // Handle call transcripts (always in User: ... Agent: ... format)
  if (conversation.call_transcript) {
    console.log("🔍 Processing call transcript")

    const transcript = conversation.call_transcript
    const lines = transcript.split('\n').filter(line => line.trim())
    let messageId = 1
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('User:') || trimmedLine.startsWith('Agent:')) {
        const [speaker, ...contentParts] = trimmedLine.split(':')
        const content = contentParts.join(':').trim()
        
        if (content) {
          messages.push({
            id: `transcript-${messageId}`,
            sender: speaker.toLowerCase() === 'user' ? 'user' : 'ai',
            content: content,
            timestamp: conversation.created_at,
          })
          messageId++
        }
      }
    }
  }
  // Handle SMS conversations with WhatsApp-like parsing
  if (conversation.all_messages_content) {
    console.log("🔍 Processing SMS messages content")
    
    const smsContent = conversation.all_messages_content
    const lines = smsContent.split('\n')
    
    let currentMessage: any = null
    let messageId = 1
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Check for message headers (First Message, Second Message, Third Message, Voicenote, Reply)
      if (trimmedLine.match(/^(First Message|Second Message|Third Message|Voicenote|Reply):\s*$/i)) {
        // Save previous message if exists
        if (currentMessage) {
          messages.push(currentMessage)
        }
        
        // Determine sender based on header
        const isReply = trimmedLine.toLowerCase().startsWith('reply:')
        const isVoicenote = trimmedLine.toLowerCase().startsWith('voicenote:')
        
        currentMessage = {
          id: `sms-${messageId}`,
          sender: isReply ? 'user' : 'ai',
          type: isVoicenote ? 'voicenote' : 'sms',
          content: "",
          timestamp: conversation.created_at,
        }
        messageId++
      }
      // Content for current message
      else if (currentMessage && trimmedLine) {
        currentMessage.content += (currentMessage.content ? '\n' : '') + trimmedLine
      }
    }
    
    // Save the last message if exists
    if (currentMessage) {
      messages.push(currentMessage)
    }
  }
  
  // Handle email conversations with detailed parsing
  else if (conversation.email_content) {
    console.log("🔍 Processing email content")
    
    const emailContent = conversation.email_content
    const lines = emailContent.split('\n')
    
    let currentEmail: any = null
    let emailId = 1
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Start of a new email
      if (trimmedLine.startsWith('email_') && trimmedLine.includes('Subject:')) {
        // Save previous email if exists
        if (currentEmail) {
          messages.push(currentEmail)
        }
        
        // Extract subject
        const subjectMatch = trimmedLine.match(/Subject:\s*(.+)/)
        const subject = subjectMatch ? subjectMatch[1].trim() : ''
        
        currentEmail = {
          id: `email-${emailId}`,
          sender: "ai",
          type: "email",
          subject: subject,
          body: "",
          timestamp: conversation.created_at,
        }
        emailId++
      }
      // Email body content
      else if (currentEmail && trimmedLine && !trimmedLine.startsWith('email_')) {
        if (trimmedLine === 'Body:' || trimmedLine === 'Subject:') {
          continue
        }
        currentEmail.body += (currentEmail.body ? '\n' : '') + trimmedLine
      }
      // Prospect reply
      else if (trimmedLine === 'Prospect:') {
        // Save previous email if exists
        if (currentEmail) {
          messages.push(currentEmail)
          currentEmail = null
        }
        
        messages.push({
          id: `prospect-${Date.now()}`,
          sender: "user",
          type: "prospect_reply",
          content: "",
          timestamp: conversation.created_at,
        })
      }
      // AI reply
      else if (trimmedLine === 'AI:') {
        // Save previous prospect reply if exists
        if (messages.length > 0 && messages[messages.length - 1].type === 'prospect_reply') {
          const lastMessage = messages[messages.length - 1]
          if (lastMessage.content.trim()) {
            messages.push({
              id: `ai-reply-${Date.now()}`,
              sender: "ai",
              type: "ai_reply",
              content: "",
              timestamp: conversation.created_at,
            })
          }
        }
      }
      // Content for prospect reply or AI reply
      else if (messages.length > 0 && (messages[messages.length - 1].type === 'prospect_reply' || messages[messages.length - 1].type === 'ai_reply')) {
        const lastMessage = messages[messages.length - 1]
        lastMessage.content += (lastMessage.content ? '\n' : '') + trimmedLine
      }
    }
    
    // Save the last email if exists
    if (currentEmail) {
      messages.push(currentEmail)
    }
  }

  // Add channel headers to organize messages by type
  const organizedMessages: any[] = []
  
  // Add SMS header if we have SMS messages
  const smsMessages = messages.filter(msg => msg.type === 'sms' || msg.type === 'voicenote')
  if (smsMessages.length > 0) {
    organizedMessages.push({
      id: 'sms-header',
      type: 'channel_header',
      channel: 'SMS Conversations',
      icon: 'MessageSquare'
    })
    organizedMessages.push(...smsMessages)
  }
  
  // Add call header if we have call messages
  const callMessages = messages.filter(msg => msg.type === 'transcript')
  if (callMessages.length > 0) {
    organizedMessages.push({
      id: 'call-header',
      type: 'channel_header',
      channel: 'Call Transcript',
      icon: 'Phone'
    })
    organizedMessages.push(...callMessages)
  }
  
  // Add email header if we have email messages
  const emailMessages = messages.filter(msg => msg.type === 'email' || msg.type === 'prospect_reply' || msg.type === 'ai_reply')
  if (emailMessages.length > 0) {
    organizedMessages.push({
      id: 'email-header',
      type: 'channel_header',
      channel: 'Email Conversations',
      icon: 'Mail'
    })
    organizedMessages.push(...emailMessages)
  }

  console.log("✅ Parsed messages:", organizedMessages)
  return organizedMessages
}

export default function Conversations() {
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "email" | "phone" | "sms">("all")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)

  // Load conversations on component mount
  useEffect(() => {
    console.log("🚀 Component mounted, loading conversations...")
    loadConversations()
  }, [])

  // Removed problematic timeout that was causing premature loading state termination

  // Auto-select first conversation when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      console.log("🔧 Auto-selecting first conversation from useEffect:", conversations[0].id)
      setSelectedConversation(conversations[0].id)
    }
  }, [conversations, selectedConversation])

  // Force select first conversation if conversations exist but none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation && !loading) {
      console.log("🔧 FORCE selecting first conversation:", conversations[0].id)
      setSelectedConversation(conversations[0].id)
    }
  }, [conversations, selectedConversation, loading])

  const loadConversations = async (silent = false) => {
    console.log("🔄 loadConversations called, silent:", silent)

    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      console.log("📞 Calling getConversations...")
      const data = await getConversations()
      console.log("📊 Received data:", data)
      console.log("📊 Data length:", data.length)
      console.log("📊 First item:", data[0])
      console.log("🔧 Setting conversations state with:", data)

      // Ensure we have valid data before updating state
      if (Array.isArray(data)) {
        setConversations(data)
        console.log("🔧 State should now be:", data.length, "conversations")
        console.log("✅ State updated with conversations")

        if (data.length > 0 && !silent) {
          toast({
            title: "Success",
            description: `Loaded ${data.length} conversations`,
          })
        }
      } else {
        console.error("❌ Invalid data received:", data)
        setConversations([])
        if (!silent) {
          toast({
            title: "Error",
            description: "Invalid data received from server",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("💥 Error in loadConversations:", error)
      setConversations([])

      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to load conversations. Check console for details.",
          variant: "destructive",
        })
      }
    } finally {
      console.log("🏁 Finally block - stopping loading states")
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered")
    loadConversations()
  }

  const handleDeleteConversation = async (conversationId: string) => {
    setConversationToDelete(conversationId)
    setDeleteModalOpen(true)
  }

  const confirmDeleteConversation = async () => {
    if (!conversationToDelete) return

    try {
      const result = await deleteConversation(conversationToDelete)

      if (result.success) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete))

        if (selectedConversation === conversationToDelete) {
          setSelectedConversation(null)
        }

        toast({
          title: "Success",
          description: "Conversation deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete conversation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 Error deleting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    } finally {
      setDeleteModalOpen(false)
      setConversationToDelete(null)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredConversations = conversations.filter((conversation) => {
    const contact = getContactFromLead(conversation.lead)
    
    // Search filter
    const matchesSearch = (
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Type filter
    const conversationType = conversation.conversation_type?.toLowerCase() || ""
    const matchesType = filterType === "all" || 
      (filterType === "email" && conversationType === "email") ||
      (filterType === "phone" && (conversationType === "phone" || conversationType === "call")) ||
      (filterType === "sms" && conversationType === "sms")
    
    return matchesSearch && matchesType
  })

  const selectedConv = conversations.find((c) => c.id === selectedConversation)
  const contact = selectedConv ? getContactFromLead(selectedConv.lead) : null
  const messages = selectedConv ? parseConversationMessages(selectedConv) : []

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col page-fade-in">
        {/* Header */}
        <div className="pt-12 px-6 pb-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Conversations</h1>
              <p className="text-muted-foreground">Manage and view all your customer conversations</p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden pt-8">
          {/* Conversations List */}
          <div className="w-96 border-r border-border flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full min-w-[355px]"
                />
              </div>
              
              {/* Filter Button */}
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className="flex-1 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filterType === "email" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("email")}
                  className="flex-1 text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button
                  variant={filterType === "phone" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("phone")}
                  className="flex-1 text-xs"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Phone
                </Button>
                <Button
                  variant={filterType === "sms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("sms")}
                  className="flex-1 text-xs"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  SMS
                </Button>
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1 relative">
              <div className="p-2">
                {loading && conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Loading conversations...</p>
                  </div>
                ) : loading && conversations.length > 0 ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-muted rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  (() => {
                    console.log("🔧 RENDERING conversations list with:", filteredConversations.length, "items")
                    return (
                      <div className="space-y-1">
                        {filteredConversations.map((conversation, index) => {
                          console.log(`🔧 RENDERING conversation ${index}:`, conversation)
                          const contact = getContactFromLead(conversation.lead)
                          const conversationMessages = parseConversationMessages(conversation)
                          const lastMessage =
                            conversationMessages.length > 0
                              ? conversationMessages[conversationMessages.length - 1].content
                              : conversation.conversation_type === "phone" || conversation.conversation_type === "call"
                                ? "Phone conversation completed"
                                : conversation.conversation_type === "sms"
                                  ? "SMS sent"
                                  : "Email sent"

                          return (
                            <div
                              key={conversation.id}
                              onClick={() => setSelectedConversation(conversation.id)}
                              className={`px-4 py-4 pr-6 cursor-pointer hover:bg-muted/50 transition-colors ${
                                selectedConversation === conversation.id ? "bg-muted" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <Avatar className="w-12 h-12">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                      {contact.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  {conversation.status === "active" && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-green-500">
                                      •
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(conversation.updated_at)}
                                    </span>
                                  </div>

                                  <p className="text-xs text-muted-foreground mb-1">{contact.company}</p>

                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{lastMessage}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-w-0 max-w-4xl flex flex-col">
            {selectedConv && contact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{contact.name}</h2>
                        <p className="text-sm text-muted-foreground">{contact.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        {selectedConv.agent_name || "AI Agent"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDeleteConversation(selectedConv.id)
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <p>No messages in this conversation yet.</p>
                      </div>
                    ) : (
                      messages.map((message: any, index: number) => {
                        const showDate =
                          index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

                        return (
                          <div key={message.id || `msg-${index}`}>
                            {message.type === 'channel_header' ? (
                              // Channel header styling
                              <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-border"></div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                                  {message.icon === 'MessageSquare' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                                  {message.icon === 'Phone' && <Phone className="w-4 h-4 text-green-500" />}
                                  {message.icon === 'Mail' && <Mail className="w-4 h-4 text-purple-500" />}
                                  <span className="text-sm font-medium text-foreground">{message.channel}</span>
                                </div>
                                <div className="flex-1 h-px bg-border"></div>
                              </div>
                            ) : (
                              <>
                                {showDate && (
                                  <div className="text-center my-4">
                                    <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
                                      {formatDate(message.timestamp)}
                                    </span>
                                  </div>
                                )}

                                <div className={`flex ${message.sender === "ai" ? "justify-start" : "justify-end"}`}>
                              <div className={`max-w-[70%] ${message.sender === "ai" ? "order-2" : "order-1"}`}>
                                {message.type === "email" ? (
                                  // Email message styling
                                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Sent</span>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{message.subject}</p>
                                    </div>
                                    <div className="px-4 py-3">
                                      <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                          {message.body}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : message.type === "prospect_reply" ? (
                                  // Prospect reply styling
                                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 bg-blue-100 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800">
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Prospect Reply</span>
                                      </div>
                                    </div>
                                    <div className="px-4 py-3">
                                      <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                      </p>
                                    </div>
                                  </div>
                                ) : message.type === "sms" || message.type === "voicenote" ? (
                                  // SMS/WhatsApp-like styling
                                  <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                                    message.sender === "ai" 
                                      ? "bg-blue-500 text-white ml-auto" 
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-auto"
                                  }`}>
                                    {message.type === "voicenote" && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                                          <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <span className="text-xs opacity-80">Voice Note</span>
                                      </div>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                      {message.content}
                                    </p>
                                  </div>
                                ) : message.type === "ai_reply" ? (
                                  // AI reply styling
                                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 bg-green-100 dark:bg-green-900/50 border-b border-green-200 dark:border-green-800">
                                      <div className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-900 dark:text-green-100">AI Response</span>
                                      </div>
                                    </div>
                                    <div className="px-4 py-3">
                                      <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  // Regular message styling
                                  <div
                                    className={`px-4 py-2 rounded-2xl ${
                                      message.sender === "ai" ? "bg-muted text-foreground" : "bg-blue-500 text-white"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                )}
                                <p
                                  className={`text-xs text-muted-foreground mt-5 ${
                                    message.sender === "ai" ? "text-left" : "text-right"
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>

                              {message.sender === "ai" && (
                                <div className="order-1 mr-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      <Bot className="w-4 h-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}
                            </div>
                              </>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>

                {/* Call Recording Section */}
                {selectedConv?.audio_file_url && (
                  <div className="p-4 border-t border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground">Call Recording</span>
                          <p className="text-xs text-muted-foreground">Listen to the full conversation</p>
                        </div>
                      </div>
                      <audio 
                        controls 
                        className="flex-1 h-10 max-w-none"
                        preload="metadata"
                        style={{
                          '--plyr-color-main': 'hsl(var(--primary))',
                          '--plyr-audio-controls-background': 'hsl(var(--card))',
                          '--plyr-audio-control-color': 'hsl(var(--muted-foreground))',
                          '--plyr-audio-control-color-hover': 'hsl(var(--foreground))',
                          '--plyr-audio-progress-buffered-background': 'hsl(var(--muted))',
                          '--plyr-audio-progress-played-background': 'hsl(var(--primary))',
                          '--plyr-audio-range-track-background': 'hsl(var(--muted))',
                          '--plyr-audio-range-fill-background': 'hsl(var(--primary))',
                        } as React.CSSProperties}
                      >
                          <source src={selectedConv.audio_file_url} type="audio/mpeg" />
                          <source src={selectedConv.audio_file_url} type="audio/wav" />
                          <source src={selectedConv.audio_file_url} type="audio/mp3" />
                          <source src={selectedConv.audio_file_url} type="audio/ogg" />
                          Your browser does not support the audio element.
                        </audio>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State - No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Conversation Selected</h3>
                  <p>Choose a conversation from the list to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setConversationToDelete(null)
        }}
        onConfirm={confirmDeleteConversation}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
