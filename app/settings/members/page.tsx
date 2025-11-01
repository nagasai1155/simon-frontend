"use client"

import { useState } from "react"
import { UserPlus, Mail, Shield, MoreHorizontal, User, Search, Filter, ChevronDown } from "lucide-react"
import InviteMemberModal from "@/components/invite-member-modal"

// Sample data
const sampleMembers = [
  { id: "1", name: "John Doe", email: "john@blackvolution.com", role: "Admin", status: "Active", subAccount: null },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@blackvolution.com",
    role: "User",
    status: "Active",
    subAccount: "Marketing Team",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@blackvolution.com",
    role: "User",
    status: "Pending",
    subAccount: "Sales Team",
  },
]

const sampleSubAccounts = [
  { id: "sa1", name: "Marketing Team" },
  { id: "sa2", name: "Sales Team" },
  { id: "sa3", name: "Development Team" },
  { id: "sa4", name: "Customer Support" },
]

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showRoleFilter, setShowRoleFilter] = useState(false)
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter members based on search and filters
  const filteredMembers = sampleMembers.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = !filterRole || member.role === filterRole
    const matchesStatus = !filterStatus || member.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Team Members</h1>
              <p className="text-sm text-muted-foreground">Manage your team and their permissions</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg text-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              {/* Role Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRoleFilter(!showRoleFilter)
                    setShowStatusFilter(false)
                  }}
                  className="flex items-center gap-2 bg-background hover:bg-secondary/50 border border-input rounded-lg py-2.5 px-4 text-foreground transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>{filterRole || "Role"}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showRoleFilter && (
                  <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-10 animate-fadeIn">
                    <button
                      onClick={() => {
                        setFilterRole(null)
                        setShowRoleFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      All Roles
                    </button>
                    <button
                      onClick={() => {
                        setFilterRole("Admin")
                        setShowRoleFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => {
                        setFilterRole("User")
                        setShowRoleFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      User
                    </button>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStatusFilter(!showStatusFilter)
                    setShowRoleFilter(false)
                  }}
                  className="flex items-center gap-2 bg-background hover:bg-secondary/50 border border-input rounded-lg py-2.5 px-4 text-foreground transition-colors"
                >
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
                        setFilterStatus("Pending")
                        setShowStatusFilter(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground"
                    >
                      Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="theme-card overflow-hidden mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/50">
              <div className="col-span-5 text-sm font-medium text-muted-foreground">Member</div>
              <div className="col-span-3 text-sm font-medium text-muted-foreground">Role</div>
              <div className="col-span-3 text-sm font-medium text-muted-foreground">Status</div>
              <div className="col-span-1 text-sm font-medium text-muted-foreground text-right">Actions</div>
            </div>

            {/* Table Body */}
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="w-3 h-3 mr-1" />
                      <span>{member.email}</span>
                    </div>
                    {member.subAccount && (
                      <div className="text-xs text-muted-foreground mt-0.5">{member.subAccount}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-3 flex items-center">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                      member.role === "Admin" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {member.role === "Admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span className="text-xs">{member.role}</span>
                  </div>
                </div>

                <div className="col-span-3 flex items-center">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                      member.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="text-xs">{member.status}</span>
                  </div>
                </div>

                <div className="col-span-1 flex items-center justify-end">
                  <button className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Invitations Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
            <div className="theme-card p-5">
              <div className="p-4 border border-dashed border-border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">No pending invitations</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Member Modal */}
      <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subAccounts={sampleSubAccounts} />
    </div>
  )
}
