import Sidebar from "@/components/sidebar"
import { getPhoneNumbers } from "@/app/actions/phone-numbers"
import PhoneNumbersClient from "@/components/phone-numbers-client"

/**
 * Server Component
 * Fetches phone numbers once on the server, then hands them
 * to the interactive client-side UI.
 */
export default async function PhoneNumbersPage() {
  const { success, data: phoneNumbers, error } = await getPhoneNumbers()

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar (client component is fine to import here) */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <PhoneNumbersClient phoneNumbers={success ? phoneNumbers : []} error={error} />
        </div>
      </main>
    </div>
  )
}
