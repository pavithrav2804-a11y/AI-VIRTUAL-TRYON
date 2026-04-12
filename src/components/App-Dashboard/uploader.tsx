import { useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Uploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-bg.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0F172A]/80 to-purple-900/60"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-xl">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Upload Your Outfit
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Upload an image and let AI analyze your style, skin tone & suggest outfits
          </p>

          {/* DROP AREA */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition">

            <UploadCloud className="text-purple-400 w-10 h-10 mb-3" />

            <p className="text-gray-300 text-sm">
              Drag & drop or click to upload
            </p>

            <input
              type="file"
              className="hidden"
              onChange={handleFile}
              accept="image/*"
            />
          </label>

          {/* PREVIEW */}
          {preview && (
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-2">Preview:</p>
              <img
                src={preview}
                className="rounded-xl w-full max-h-64 object-cover"
              />
            </div>
          )}

          {/* ACTION */}
          <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            Start AI Analysis
          </Button>

        </div>

      </div>
    </div>
  )
}
