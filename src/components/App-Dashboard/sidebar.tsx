import { NavLink } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Upload,
  Settings,
  LogOut,
  TrendingUp,
  HomeIcon
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="hidden lg:flex h-screen fixed w-64 bg-[#0F172A] border-r border-white/10 flex-col justify-between p-4">

      {/* TOP */}
      <div>
        {/* LOGO / PROJECT NAME */}
        <h1 className="text-xl font-bold text-white mb-6">
          👗 AI Wardrobe
        </h1>

        <Separator className="bg-white/10 mb-4" />

        {/* NAV ITEMS */}
        <nav className="flex flex-col gap-2">

          <NavItem to="/app/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/app/wardrobe" icon={<Shirt size={18} />} label="Wardrobe" />
          <NavItem to="/app/accessories" icon={<Sparkles size={18} />} label="Accessories" />
          <NavItem to="/app/trends" icon={<TrendingUp size={18} />} label="AI Trends" />
          <NavItem to="/app/upload" icon={<Upload size={18} />} label="Upload" />
          <NavItem to="/home" icon={<HomeIcon size={18} />} label="Home" />


        </nav>

        <Separator className="bg-white/10 my-4" />

        {/* SETTINGS */}
        <nav>
          <NavItem to="/app/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>

      {/* BOTTOM */}
      <div>
        <Separator className="bg-white/10 mb-4" />

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

/* NAV ITEM COMPONENT */
function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
