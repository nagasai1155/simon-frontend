"use client"

import { useState } from "react"
import { Zap, Mail, Phone, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface CreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TopUpPlan {
  price: number
  credits: number
  bestValue?: boolean
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  const [activeTab, setActiveTab] = useState<string>("email")
  const [selectedEmailPlan, setSelectedEmailPlan] = useState<number | null>(null)
  const [selectedPhonePlan, setSelectedPhonePlan] = useState<number | null>(null)
  const { toast } = useToast()

  const emailPlans: TopUpPlan[] = [
    { price: 20, credits: 70 },
    { price: 50, credits: 180 },
    { price: 100, credits: 360, bestValue: true },
    { price: 200, credits: 770 },
    { price: 500, credits: 2000 },
  ]

  const phonePlans: TopUpPlan[] = [
    { price: 20, credits: 2000 },
    { price: 50, credits: 5000 },
    { price: 100, credits: 10000, bestValue: true },
    { price: 200, credits: 20000 },
    { price: 500, credits: 50000 },
  ]

  const handlePurchase = () => {
    const selectedPlan = activeTab === "email" ? selectedEmailPlan : selectedPhonePlan
    const plans = activeTab === "email" ? emailPlans : phonePlans

    if (selectedPlan !== null) {
      const plan = plans[selectedPlan]
      toast({
        title: "Credits purchased",
        description: `You've successfully purchased ${plan.credits.toLocaleString()} ${activeTab === "email" ? "email prospects" : "phone credits"} for ${plan.price}.`,
        duration: 5000,
      })
      onClose()
    }
  }

  const getSelectedPlan = () => {
    return activeTab === "email" ? selectedEmailPlan : selectedPhonePlan
  }

  const renderPlanCards = (
    plans: TopUpPlan[],
    selectedPlan: number | null,
    setSelectedPlan: (index: number) => void,
  ) => {
    return plans.map((plan, index) => (
      <div
        key={index}
        className={`relative bg-card p-6 border-2 transition-all cursor-pointer rounded-xl ${
          selectedPlan === index
            ? "border-primary shadow-lg ring-1 ring-primary/20"
            : "border-border hover:border-primary/40 hover:shadow-md"
        }`}
        onClick={() => setSelectedPlan(index)}
      >
        {plan.bestValue && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full shadow-sm">
            Best Value
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className="mb-5 text-center">
            <div className="text-3xl font-bold">${plan.price}</div>
            <div className="text-sm text-muted-foreground mt-1">One-time purchase</div>
          </div>

          <div className="text-center py-4 border-y border-border mb-5">
            <div className="text-2xl font-semibold">{plan.credits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {activeTab === "email" ? "Email Prospects" : "Phone Credits"}
            </div>
          </div>

          <button
            className={`w-full mt-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedPlan === index
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {selectedPlan === index && <Check className="w-4 h-4" />}
            <span>{selectedPlan === index ? "Selected" : "Select Pack"}</span>
          </button>
        </div>
      </div>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Top Up Credits</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Purchase additional credits to power your outreach campaigns. You can only purchase one pack at a time.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2">
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-muted rounded-lg p-1.5 shadow-sm">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-md transition-all ${
                    activeTab === "email"
                      ? "bg-white text-primary shadow-sm dark:bg-secondary dark:text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Email Prospects</span>
                </button>
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-md transition-all ${
                    activeTab === "phone"
                      ? "bg-white text-primary shadow-sm dark:bg-secondary dark:text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">Phone Credits</span>
                </button>
              </div>
            </div>

            <TabsContent value="email" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {renderPlanCards(emailPlans, selectedEmailPlan, (index) => setSelectedEmailPlan(index))}
              </div>
            </TabsContent>

            <TabsContent value="phone" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {renderPlanCards(phonePlans, selectedPhonePlan, (index) => setSelectedPhonePlan(index))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-medium">Important Note</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You can only purchase one of these packs at a time. Credits will be added to your account immediately
              after purchase.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={handlePurchase}
              disabled={getSelectedPlan() === null}
              className="py-2.5 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Purchase Credits
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
