import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Heart,
  Shirt,
  ShoppingBag,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const DUMMY_WARDROBE = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "Tops",
    color: "White",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300",
    brand: "Uniqlo",
    favorite: true,
  },
  {
    id: 2,
    name: "Navy Slim Chinos",
    category: "Bottoms",
    color: "Navy",
    image: "https://images.unsplash.com/photo-1473966968600-fa804b86962d?auto=format&fit=crop&q=80&w=300",
    brand: "Levi's",
    favorite: false,
  },
  {
    id: 3,
    name: "Black Canvas Sneakers",
    category: "Shoes",
    color: "Black",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=300",
    brand: "Vans",
    favorite: true,
  },
  {
    id: 4,
    name: "Oversized Denim Jacket",
    category: "Outerwear",
    color: "Blue",
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=300",
    brand: "Zara",
    favorite: false,
  },
  {
    id: 5,
    name: "Cream Wool Sweater",
    category: "Tops",
    color: "Cream",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300",
    brand: "H&M",
    favorite: false,
  },
  {
    id: 6,
    name: "Olive Cargo Pants",
    category: "Bottoms",
    color: "Olive",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=300",
    brand: "Carhartt",
    favorite: false,
  },
]

const COLORS = [
  { name: "White", class: "bg-white" },
  { name: "Black", class: "bg-black" },
  { name: "Navy", class: "bg-blue-900" },
  { name: "Blue", class: "bg-blue-500" },
  { name: "Olive", class: "bg-olive-600" },
  { name: "Cream", class: "bg-orange-50" },
]

export default function Wardrobe() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Tops", "Bottoms", "Shoes", "Outerwear"]

  const filteredItems = DUMMY_WARDROBE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-6 bg-[#020617] min-h-screen text-white">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            My Wardrobe
          </h1>
          <p className="text-gray-400 mt-1">Manage and organize your digital closet</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 flex items-center gap-2">
          <Plus size={18} />
          Add Item
        </Button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search your wardrobe..." 
            className="pl-10 bg-white/5 border-white/10 rounded-xl focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 ${
                selectedCategory === cat 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "border-white/10 hover:bg-white/5"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="md:col-span-3 flex justify-end gap-2">
           {COLORS.map(color => (
             <button
               key={color.name}
               title={color.name}
               className={`w-8 h-8 rounded-full border border-white/20 transition-transform hover:scale-110 ${color.class}`}
             />
           ))}
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* COLLECTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden bg-white/5 border-white/10 hover:border-purple-500/50 transition-all duration-300 rounded-2xl relative">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <button className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-red-500 transition">
                <Heart size={18} fill={item.favorite ? "currentColor" : "none"} />
              </button>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                 <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-lg hover:bg-white/20">
                   View Details
                 </Button>
                 <button className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500/40 transition">
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>

            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.brand}</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/20 text-gray-300">
                  {item.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full border border-white/20 ${
                  item.color === 'White' ? 'bg-white' : 
                  item.color === 'Navy' ? 'bg-blue-900' :
                  item.color === 'Black' ? 'bg-black' :
                  item.color === 'Blue' ? 'bg-blue-500' :
                  item.color === 'Olive' ? 'bg-olive-600' : 'bg-orange-50'
                }`} />
                <span className="text-xs text-gray-500">{item.color}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* EMPTY STATE */}
        {filteredItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <div className="p-6 bg-white/5 rounded-full">
              <Shirt size={48} className="text-gray-600" />
            </div>
            <p className="text-xl">No items found matching your filters</p>
            <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedCategory("All")}} className="text-purple-400">
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <QuickActionCard 
          icon={<Zap className="text-yellow-400" />}
          title="AI Suggestions"
          description="Get outfits generated from your wardrobe items."
        />
        <QuickActionCard 
          icon={<ShoppingBag className="text-blue-400" />}
          title="Wishlist"
          description="Items you're planning to add to your collection."
        />
        <QuickActionCard 
          icon={<Filter className="text-emerald-400" />}
          title="Categories"
          description="Manage your custom garment categories."
        />
      </div>

    </div>
  )
}

function QuickActionCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 hover:border-purple-500/30 transition cursor-pointer group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
