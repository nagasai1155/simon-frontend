"use client"

import { Search, Plus, Mail, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import EditEmailLimitModal from "@/components/edit-email-limit-modal"
import AddEmailAccountModal from "@/components/add-email-account-modal"
import { getEmailAccounts, deleteEmailAccount, updateEmailLimit } from "@/app/actions/email-accounts"
import { toast } from "sonner"

interface EmailAccount {
  id: string
  email_address: string
  first_name: string
  last_name: string
  provider_type: string
  health: "average" | "good" | "great"
  daily_limit: number
  daily_used: number
  status: string
  created_at: string
}

export default function EmailAccounts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeAccount, setActiveAccount] = useState<EmailAccount | null>(null)
  const [optionsOpen, setOptionsOpen] = useState<string | null>(null)
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch email accounts on component mount
  useEffect(() => {
    fetchEmailAccounts()
  }, [])

  const fetchEmailAccounts = async () => {
    setLoading(true)
    try {
      const result = await getEmailAccounts()
      if (result.success) {
        setEmailAccounts(result.data)
      } else {
        toast.error("Failed to fetch email accounts")
      }
    } catch (error) {
      toast.error("Error loading email accounts")
    } finally {
      setLoading(false)
    }
  }

  const toggleOptions = (id: string) => {
    if (optionsOpen === id) {
      setOptionsOpen(null)
    } else {
      setOptionsOpen(id)
    }
  }

  const handleEditAccount = (account: EmailAccount) => {
    setActiveAccount(account)
    setIsEditModalOpen(true)
    setOptionsOpen(null)
  }

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this email account?")) {
      try {
        const result = await deleteEmailAccount(id)
        if (result.success) {
          toast.success("Email account deleted successfully")
          fetchEmailAccounts() // Refresh the list
        } else {
          toast.error("Failed to delete email account")
        }
      } catch (error) {
        toast.error("Error deleting email account")
      }
    }
    setOptionsOpen(null)
  }

  const handleUpdateLimit = async (id: string, newLimit: number) => {
    try {
      const result = await updateEmailLimit(id, newLimit)
      if (result.success) {
        toast.success("Daily limit updated successfully")
        fetchEmailAccounts() // Refresh the list
      } else {
        toast.error("Failed to update daily limit")
      }
    } catch (error) {
      toast.error("Error updating daily limit")
    }
    setIsEditModalOpen(false)
  }

  // Get provider icon - now using simple email icon for all
  const getProviderIcon = (provider: string) => {
    return (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-700">
        <Mail className="w-5 h-5 text-gray-400 dark:text-gray-400" />
      </div>
    )
  }

  // Update the getQualityBadge function to have lighter colors in light mode
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "great":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600 border border-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
            Great
          </span>
        )
      case "good":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
            Good
          </span>
        )
      case "average":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
            Average
          </span>
        )
      default:
        return null
    }
  }

  // Filter accounts based on search term
  const filteredAccounts = emailAccounts.filter(
    (account) =>
      account.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${account.first_name} ${account.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddModalClose = () => {
    setIsAddModalOpen(false)
    fetchEmailAccounts() // Refresh the list when modal closes
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Email Accounts</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 px-4 rounded text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Email Account</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search Email Accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "No email accounts found" : "No email accounts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first email account"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Add Email Account
                </button>
              )}
            </div>
          )}

          {/* Email Accounts List */}
          {!loading && filteredAccounts.length > 0 && (
            <div className="space-y-3">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="bg-card border border-border rounded-xl p-4 relative">
                  <div className="flex items-start">
                    {/* Account Icon */}
                    <div className="mr-3">{getProviderIcon(account.provider_type)}</div>

                    {/* Account Details */}
                    <div className="flex-1">
                      <div className="flex items-center mb-0.5">
                        <h3 className="font-medium text-foreground text-base">{account.email_address}</h3>
                        <div className="ml-2">{getQualityBadge(account.health)}</div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {account.first_name} {account.last_name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          Daily: {account.daily_used}/{account.daily_limit}
                        </span>
                        <span>Status: {account.status}</span>
                        <span>Added: {new Date(account.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Options Menu */}
                    <div className="relative">
                      <button
                        onClick={() => toggleOptions(account.id)}
                        className="p-1 hover:bg-secondary rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {optionsOpen === account.id && (
                        <div className="absolute right-0 top-6 w-44 bg-popover border border-border rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditAccount(account)}
                              className="flex items-center w-full px-3 py-1.5 text-xs text-foreground hover:bg-secondary transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                              Edit sending limits
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="flex items-center w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete account
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Email Limit Modal */}
      {activeAccount && (
        <EditEmailLimitModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={activeAccount}
          onUpdate={handleUpdateLimit}
        />
      )}

      {/* Add Email Account Modal */}
      <AddEmailAccountModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </div>
  )
}
