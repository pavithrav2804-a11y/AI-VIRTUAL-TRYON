import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame, Star, Zap } from "lucide-react"

const DUMMY_TRENDS = [
  {
    id: 1,
    title: "Eco-Futurism",
    description: "Sustainability meets techwear with recycled fabrics and ergonomic designs.",
    popularity: 98,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500",
    tags: ["Sustainable", "Techwear", "Modern"]
  },
  {
    id: 2,
    title: "Quiet Luxury",
    description: "Minimalist silhouettes, neutral tones, and premium quality without visible logos.",
    popularity: 92,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500",
    tags: ["Minimalist", "Elite", "Timeless"]
  },
  {
    id: 3,
    title: "Retro Revival",
    description: "Bold 70s colors and 90s oversized fits are making a massive comeback.",
    popularity: 85,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=500",
    tags: ["Vintage", "Colorful", "Streetstyle"]
  }
]

export default function Trends() {
  return (
    <div className="p-6 space-y-8 bg-[#020617] min-h-screen text-white">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-500/20 rounded-2xl">
          <TrendingUp className="text-red-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Trends Forecast</h1>
          <p className="text-gray-400">Personalized fashion insights based on global data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {DUMMY_TRENDS.map((trend) => (
          <Card key={trend.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-red-500/40 transition">
            <div className="h-64 relative">
              <img src={trend.image} className="w-full h-full object-cover" alt={trend.title} />
              <div className="absolute top-4 left-4 flex gap-2">
                {trend.tags.map(tag => (
                   <Badge key={tag} className="bg-black/60 backdrop-blur-md border-white/10 uppercase text-[10px]">
                     {tag}
                   </Badge>
                ))}
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{trend.title}</h2>
                <div className="flex items-center gap-1 text-red-400">
                  <Flame size={16} fill="currentColor" />
                  <span className="font-bold">{trend.popularity}%</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{trend.description}</p>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">Match Score: 85%</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-xs font-bold">AI Recommended</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
