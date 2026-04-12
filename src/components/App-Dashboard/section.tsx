import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Shirt,
  Image,
  CheckCircle,
  Sparkles,
  Clock
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-[#020617] min-h-screen">

      {/* 🔹 WELCOME CARD */}
      <Card className="bg-gradient-to-r from-[#1E293B] to-[#312E81] border border-white/10 rounded-2xl">
        <CardContent className="flex items-center gap-6 p-6">
          
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-black border border-white/10" />

          {/* Text */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back,
            </h1>

            <p className="text-gray-300 flex items-center gap-2 mt-1">
              <Sparkles className="text-purple-400" size={16} />
              AURA AI Stylist Active
            </p>

            {/* small loader dots */}
            <div className="flex gap-2 mt-2">
              <div className="w-6 h-2 bg-white/20 rounded-full" />
              <div className="w-6 h-2 bg-white/20 rounded-full" />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          icon={<Shirt className="text-purple-400" />}
          value="0"
          label="Saved Items"
        />

        <StatCard
          icon={<Image className="text-green-400" />}
          value="12"
          label="Virtual Try-Ons"
        />

        <StatCard
          icon={<CheckCircle className="text-pink-400" />}
          value="0"
          label="Curated Looks"
        />

        <StatCard
          icon={<Sparkles className="text-blue-400" />}
          value="0"
          label="Accessories"
        />

      </div>

      {/* 🔹 RECENT ACTIVITY */}
      <Card className="bg-gradient-to-r from-[#1E293B] to-[#134E4A] border border-white/10 rounded-2xl">
        <CardContent className="p-6">

          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-purple-400" size={18} />
            <h2 className="text-white font-semibold text-lg">
              Recent Activity
            </h2>
          </div>

          <Separator className="bg-white/10 mb-6" />

          <p className="text-gray-400 text-center py-10">
            No recent activity yet. Upload an outfit to get started!
          </p>

        </CardContent>
      </Card>

    </div>
  )
}

/* 🔹 REUSABLE STAT CARD */

type StatCardProps = {
  icon: React.ReactNode
  value: string
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-2xl hover:border-purple-500/30 transition">
      <CardContent className="p-5 space-y-4">

        {/* ICON */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
          {icon}
        </div>

        {/* VALUE */}
        <div>
          <h3 className="text-2xl font-bold text-white">
            {value}
          </h3>
          <p className="text-gray-400 text-sm">
            {label}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
