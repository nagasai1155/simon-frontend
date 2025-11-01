import { HelpCircle, MessageSquare, FileText, ExternalLink, Mail } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Support</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="theme-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg font-medium">Contact Support</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Our support team is available 24/7 to help you with any questions or issues.
          </p>

          <button className="w-full py-2 px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors">
            Start a Conversation
          </button>
        </div>

        <div className="theme-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-green-400" />
            <h2 className="text-lg font-medium">Documentation</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Browse our comprehensive documentation to learn more about Connected Sensors features.
          </p>

          <button className="w-full py-2 px-3 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <span>View Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="theme-card p-5 mb-6">
        <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">How do I add more credits to my account?</h3>
            <p className="text-sm text-muted-foreground">
              You can purchase additional credits from the Billing page. Navigate to Settings {">"} Billing and click on
              "Buy Credits" button.
            </p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">How do I connect my email account?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Email Accounts page and click on "Add Email Account". Follow the instructions to connect your
              email provider.
            </p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Can I export my data from Connected Sensors?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can export your data from the respective pages. For example, to export contacts, go to the
              Contacts page and click on "Export".
            </p>
          </div>
        </div>
      </div>

      <div className="theme-card p-5 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-medium">Email Support</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          If you prefer email, you can reach our support team at the address below:
        </p>

        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <a href="mailto:support@connectedsensors.com" className="text-blue-400 hover:underline">
            support@connectedsensors.com
          </a>
        </div>
      </div>
    </div>
  )
}
