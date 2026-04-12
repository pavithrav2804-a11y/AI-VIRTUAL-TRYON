import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Smartphone } from "lucide-react"

export default function Settings() {
  return (
    <div className="p-6 space-y-8 bg-[#020617] min-h-screen text-white max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400">
             <User size={18} />
             <h2 className="uppercase text-xs font-bold tracking-widest">Profile</h2>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
                    JD
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">John Doe</h3>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                    <Button variant="link" className="text-purple-400 p-0 h-auto">Update Avatar</Button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                 <div className="space-y-2">
                   <label className="text-xs text-gray-400">Full Name</label>
                   <Input placeholder="John Doe" className="bg-black/20 border-white/5" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs text-gray-400">Email</label>
                   <Input placeholder="john.doe@example.com" className="bg-black/20 border-white/5" />
                 </div>
               </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400">
             <Smartphone size={18} />
             <h2 className="uppercase text-xs font-bold tracking-widest">App Preferences</h2>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                 <SettingItem 
                    icon={<Bell size={18} className="text-blue-400" />}
                    title="Push Notifications"
                    description="Get notified about daily outfit suggestions."
                    action={<Switch defaultChecked />}
                 />
                 <SettingItem 
                    icon={<Palette size={18} className="text-purple-400" />}
                    title="High Contrast Mode"
                    description="Better visibility for colors and patterns."
                    action={<Switch />}
                 />
                 <SettingItem 
                    icon={<Shield size={18} className="text-green-400" />}
                    title="Anonymous Data"
                    description="Share anonymous usage data to improve AI accuracy."
                    action={<Switch defaultChecked />}
                 />
               </div>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: React.ReactNode }) {
  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon}</div>
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
