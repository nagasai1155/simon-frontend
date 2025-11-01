"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  BarChart3, 
  TrendingUp, 
  MessageCircle, 
  Bot, 
  Users, 
  Mail, 
  Phone, 
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Shield
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/favicon.png"
                  alt="Connected Sensors Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h1 className="text-5xl font-bold text-foreground">Connected Sensors</h1>
            </div>
            <p className="text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Get everything ready in just 15 minutes
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              A comprehensive sales and marketing automation platform designed to streamline your outreach, 
              manage your pipeline, and drive conversions with AI-powered insights.
            </p>
            <Link href="/dashboard" className="inline-block">
              <Button size="lg" className="text-lg px-8 py-6 cursor-pointer">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Dashboard & Analytics"
              description="Real-time analytics and performance metrics to track your sales pipeline, conversion rates, and campaign effectiveness."
              link="/dashboard"
              linkText="View Dashboard"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Sales Pipeline"
              description="Manage and track your leads through every stage of the sales funnel with visual kanban boards and detailed insights."
              link="/sales-pipeline"
              linkText="View Pipeline"
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Conversations"
              description="Centralized hub for all customer interactions across email, phone calls, and SMS with intelligent conversation tracking."
              link="/conversations"
              linkText="View Conversations"
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8" />}
              title="AI Agents"
              description="Powerful AI-powered agents that automate lead research, personalize outreach, and engage prospects intelligently."
              link="/ai-agents"
              linkText="Explore AI Agents"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Lead Management"
              description="Import, organize, and manage your contacts with advanced filtering, segmentation, and lead research capabilities."
              link="/contacts"
              linkText="Manage Leads"
            />
            <FeatureCard
              icon={<Mail className="w-8 h-8" />}
              title="Email Campaigns"
              description="Create and manage multi-channel campaigns with automated email sequences, scheduling, and performance tracking."
              link="/campaigns"
              linkText="Create Campaign"
            />
          </div>

          {/* Key Benefits */}
          <div className="mt-19 pt-12">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Connected Sensors?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Zap className="w-6 h-6" />}
                title="Fast Setup"
                description="Get up and running in just 15 minutes. No complex configurations needed."
              />
              <BenefitCard
                icon={<Sparkles className="w-6 h-6" />}
                title="AI-Powered"
                description="Leverage advanced AI for lead research, personalization, and automated conversations."
              />
              <BenefitCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure & Reliable"
                description="Enterprise-grade security with reliable infrastructure to keep your data safe."
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-19 pt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="inline-block">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  <BarChart3 className="mr-2 w-5 h-5" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/sales-pipeline" className="inline-block">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Manage Pipeline
                </Button>
              </Link>
              <Link href="/conversations" className="inline-block">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Check Conversations
                </Button>
              </Link>
              <Link href="/campaigns/new" className="inline-block">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  <Target className="mr-2 w-5 h-5" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  linkText: string
}

function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
  return (
    <Link href={link} className="block h-full">
      <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer group">
        <CardHeader>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-base mt-5">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" className="w-full justify-start pointer-events-none">
            {linkText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
