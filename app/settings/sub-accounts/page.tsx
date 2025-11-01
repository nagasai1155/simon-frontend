"use client"

import { useState } from "react"
import {
  Users,
  Search,
  PlusCircle,
  MoreHorizontal,
  ArrowLeftRight,
  PauseCircle,
  PlayCircle,
  Trash2,
  AlertCircle,
  ChevronDown,
  Filter,
} from "lucide-react"
import { CreateSubAccountModal } from "@/components/create-sub-account-modal"
import { TransferCreditsModal } from "@/components/transfer-credits-modal"

// Sample data for sub-accounts
const sampleSubAccounts = [
  {
    id: "sa1",
    name: "Marketing Team",
    status: "Active",
    credits: 5000,
    members: 4,
    lastActivity: "2025-04-18T10:30:00Z",
  },
  {
    id: "sa2",
    name: "Sales Team",
    status: "Active",
    credits: 3200,
    members: 6,
    lastActivity: "2025-04-19T14:45:00Z",
  },
  {
    id: "sa3",
    name: "Development Team",
    status: "Paused",
    credits: 1500,
    members: 3,
    lastActivity: "2025-04-15T09:20:00Z",
  },
  {
    id: "sa4",
    name: "Customer Support",
    status: "Active",
    credits: 2800,
    members: 5,
    lastActivity: "2025-04-20T08:15:00Z",
  },
]

export default function SubAccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "pause" | "activate" | "delete"
    accountId: string
    accountName: string
  } | null>(null)

  // Filter sub-accounts based on search and filters
  const filteredSubAccounts = sampleSubAccounts.filter((account) => {
    const matchesSearch = !searchQuery || account.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !filterStatus || account.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle account status toggle
  const toggleAccountStatus = (accountId: string, currentStatus: string) => {
    // In a real app, this would make an API call to update the status
    console.log(
      `Toggling account ${accountId} from ${currentStatus} to ${currentStatus === "Active" ? "Paused" : "Active"}`,
    )

    // Close confirmation dialog
    setConfirmAction(null)
  }

  // Handle account deletion
  const deleteAccount = (accountId: string) => {
    // In a real app, this would make an API call to delete the account
    console.log(`Deleting account ${accountId}`)

    // Close confirmation dialog
    setConfirmAction(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Sub-Accounts</h1>
              <p className="text-sm text-muted-foreground">
                Manage your sub-accounts, transfer credits, and control account status
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg text-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Sub-Account</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search sub-accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className="flex items-center gap-2 bg-background hover:bg-secondary/50 border border-input rounded-lg py-2.5 px-4 text-foreground transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>{filterStatus || "Status"}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showStatusFilter && (
                  <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-10 animate-fadeIn">
                    <button
                      onClick={() => {
                        setFilterStatus(null)
                        setShowStatusFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      All Statuses
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("Active")
                        setShowStatusFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("Paused")
                        setShowStatusFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      Paused
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-Accounts Table */}
          <div className="theme-card overflow-hidden mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/50">
              <div className="col-span-3 text-sm font-medium text-muted-foreground">Sub-Account</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Status</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Credits</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground">Members</div>
              <div className="col-span-3 text-sm font-medium text-muted-foreground">Last Activity</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground text-right">Actions</div>
            </div>

            {/* Table Body */}
            {filteredSubAccounts.length > 0 ? (
              filteredSubAccounts.map((account) => (
                <div
                  key={account.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {account.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{account.name}</div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        account.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span className="text-xs">{account.status}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div className="text-sm">{account.credits.toLocaleString()} credits</div>
                  </div>

                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm">{account.members}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <div className="text-sm text-muted-foreground">{formatDate(account.lastActivity)}</div>
                  </div>

                  <div className="col-span-1 flex items-center justify-end">
                    <div className="relative group">
                      <button className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 hidden group-hover:block animate-fadeIn">
                        <button
                          onClick={() => {
                            setSelectedAccount(account.id)
                            setIsTransferModalOpen(true)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground flex items-center gap-2"
                        >
                          <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                          <span>Transfer Credits</span>
                        </button>

                        {account.status === "Active" ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: "pause",
                                accountId: account.id,
                                accountName: account.name,
                              })
                            }
                            className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground flex items-center gap-2"
                          >
                            <PauseCircle className="w-4 h-4 text-yellow-400" />
                            <span>Pause Account</span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: "activate",
                                accountId: account.id,
                                accountName: account.name,
                              })
                            }
                            className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground flex items-center gap-2"
                          >
                            <PlayCircle className="w-4 h-4 text-green-400" />
                            <span>Activate Account</span>
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: "delete",
                              accountId: account.id,
                              accountName: account.name,
                            })
                          }
                          className="w-full text-left px-4 py-2 hover:bg-secondary text-red-500 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No sub-accounts found</p>
              </div>
            )}
          </div>

          {/* Credit Usage Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Credit Distribution</h2>
            <div className="theme-card p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-border rounded-lg bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Main Account Credits</div>
                  <div className="text-2xl font-semibold">12,500</div>
                </div>
                <div className="p-4 border border-border rounded-lg bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Sub-Account Credits</div>
                  <div className="text-2xl font-semibold">
                    {sampleSubAccounts.reduce((sum, account) => sum + account.credits, 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Credits</div>
                  <div className="text-2xl font-semibold">
                    {(12500 + sampleSubAccounts.reduce((sum, account) => sum + account.credits, 0)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Sub-Account Modal */}
      <CreateSubAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        availableCredits={12500}
        onCreateSubAccount={(name, credits) => {
          // In a real app, this would make an API call to create the sub-account
          console.log(`Creating sub-account ${name} with ${credits} credits`)
          setIsCreateModalOpen(false)
        }}
      />

      {/* Transfer Credits Modal */}
      <TransferCreditsModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false)
          setSelectedAccount(null)
        }}
        selectedAccountId={selectedAccount}
        accounts={sampleSubAccounts}
      />

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl w-full max-w-[450px] shadow-lg overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                {confirmAction.type === "delete" ? (
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                ) : confirmAction.type === "pause" ? (
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <PauseCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">
                    {confirmAction.type === "delete"
                      ? "Delete Sub-Account"
                      : confirmAction.type === "pause"
                        ? "Pause Sub-Account"
                        : "Activate Sub-Account"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {confirmAction.type === "delete"
                      ? `Are you sure you want to delete "${confirmAction.accountName}"? This action cannot be undone.`
                      : confirmAction.type === "pause"
                        ? `Are you sure you want to pause "${confirmAction.accountName}"? Users won't be able to use this account until it's activated again.`
                        : `Are you sure you want to activate "${confirmAction.accountName}"?`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-border bg-card">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-secondary text-foreground hover:bg-secondary/80"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (confirmAction.type === "delete") {
                    deleteAccount(confirmAction.accountId)
                  } else {
                    toggleAccountStatus(confirmAction.accountId, confirmAction.type === "pause" ? "Active" : "Paused")
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  confirmAction.type === "delete"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : confirmAction.type === "pause"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {confirmAction.type === "delete" ? "Delete" : confirmAction.type === "pause" ? "Pause" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
