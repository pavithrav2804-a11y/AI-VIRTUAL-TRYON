import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Watch, 
  Glasses, 
  Briefcase, 
  Gem,
  Plus,
  ArrowUpRight
} from "lucide-react"

const DUMMY_ACCESSORIES = [
  {
    id: 1,
    name: "Classic Chronograph Watch",
    category: "Watches",
    price: "$250",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400",
    icon: <Watch size={20} />,
    color: "Silver",
    trend: "Trending"
  },
  {
    id: 2,
    name: "Modern Wayfarer Sunglasses",
    category: "Eyewear",
    price: "$120",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400",
    icon: <Glasses size={20} />,
    color: "Black",
    trend: "Classic"
  },
  {
    id: 3,
    name: "Leather Messenger Bag",
    category: "Bags",
    price: "$180",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400",
    icon: <Briefcase size={20} />,
    color: "Brown",
    trend: "New"
  },
  {
    id: 4,
    name: "Cuban Link Necklace",
    category: "Jewelry",
    price: "$45",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400",
    icon: <Gem size={20} />,
    color: "Gold",
    trend: "Popular"
  },
  {
    id: 5,
    name: "Minimalist Leather Wallet",
    category: "Small Goods",
    price: "$60",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    icon: <Briefcase size={20} />,
    color: "Black",
    trend: "Static"
  },
  {
    id: 6,
    name: "Smart Fitness Watch",
    category: "Tech",
    price: "$199",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400",
    icon: <Watch size={20} />,
    color: "Grey",
    trend: "High Demand"
  }
]

export default function Accessories() {
  return (
    <div className="p-6 space-y-8 bg-[#020617] min-h-screen text-white">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#312E81] border border-white/10 p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
              AI Powered Styling
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Elevate Your Look with <span className="text-purple-400">AI Stylish</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Our AI analyzes your wardrobe to recommend the perfect accessories. Add them to your collection to complete your signature style.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-xl px-8 py-6 font-bold">
                Get Suggestions
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/5 rounded-xl px-8 py-6">
                Browse All
              </Button>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="w-64 h-64 rounded-full bg-purple-500/20 blur-3xl absolute -top-10 -right-10 animate-pulse" />
            <div className="w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl absolute -bottom-10 -left-10 animate-pulse delay-700" />
            <Sparkles size={120} className="text-purple-400/30 rotate-12" />
          </div>
        </div>
      </div>

      {/* ACCESSORIES GRID */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sparkles className="text-purple-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
          <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-white/5">
            View New Arrivals
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_ACCESSORIES.map((item) => (
            <Card key={item.id} className="bg-[#0F172A] border-white/10 overflow-hidden hover:border-purple-500/40 transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button size="icon" className="rounded-full bg-white text-black hover:scale-110 transition">
                    <Plus size={20} />
                  </Button>
                  <Button size="icon" className="rounded-full bg-purple-600 text-white hover:scale-110 transition">
                    <ArrowUpRight size={20} />
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                   <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-xs py-1">
                     {item.trend}
                   </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                   <div className="text-purple-400 p-1.5 bg-purple-500/10 rounded-md">
                     {item.icon}
                   </div>
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     {item.category}
                   </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-white/90">{item.price}</p>
                    <div className="flex items-center gap-1.5">
                       <span className="text-xs text-gray-400">Color:</span>
                       <div className={`w-3 h-3 rounded-full border border-white/20 ${
                         item.color === 'Black' ? 'bg-black' :
                         item.color === 'Silver' ? 'bg-gray-300' :
                         item.color === 'Brown' ? 'bg-amber-900' :
                         item.color === 'Gold' ? 'bg-yellow-500' : 'bg-gray-500'
                       }`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-t from-purple-900/10 to-transparent rounded-3xl border border-white/5 space-y-6">
        <div className="p-5 bg-white/5 rounded-full border border-white/10 animate-bounce">
           <Plus size={40} className="text-purple-500" />
        </div>
        <div className="text-center space-y-2">
           <h3 className="text-2xl font-bold">Unlock More AI Styles</h3>
           <p className="text-gray-400 max-w-md mx-auto">
             Complete your profile and connect your Pinterest or Instagram for even more hyper-personalized accessory matches.
           </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl px-10 py-6 font-bold">
           Connect Socials
        </Button>
      </div>

    </div>
  )
}
