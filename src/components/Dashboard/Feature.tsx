import { Card, CardAction, CardContent, CardDescription, CardHeader } from "../ui/card";

export default function Feature() {
    return (<>
        <div className=" pt-16">
            <div className="grid justify-center  mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center  text-white">Feature of <span className="text-purple-500">Fashion</span></h1>
                <div className="text-center mt-8">
                    <p className=" text-white min-w-full text-2xl"> Our advanced neural networks analyze fabric drape, lighting, and your unique body structure for photorealistic try-ons.</p>
                </div>
            </div>
            <div className="flex bg-slate-900/50 backdrop-blur-xl p-5 flex-col md:flex-row gap-8 mt-12 sm:px-6 lg:px-8">
                <Card className="text-white p-4 " >
                    <CardHeader className="text-xl font-bold text-white mb-3">
                        Photorealistic Rendering
                    </CardHeader>
                    
                    <CardDescription className="text-slate-400 leading-relaxed">
                        Our advanced neural networks analyze fabric drape, lighting, and your unique body structure for photorealistic try-ons.
                    </CardDescription>
                </Card>
                <Card  className="text-white p-4">
                    <CardHeader className="text-xl font-bold text-white mb-3">
                        Smart Accessory Matching
                    </CardHeader>
                    <CardDescription className="text-slate-400 leading-relaxed">
                        Our advanced neural networks analyze fabric drape, lighting, and your unique body structure for photorealistic try-ons.
                    </CardDescription>
                </Card>
                <Card  className="text-white p-4">
                    <CardHeader className="text-xl font-bold text-white mb-3">
                        AI-Powered Style Recommendations
                    </CardHeader>
                    <CardDescription className="text-slate-400 leading-relaxed">
                        Our advanced neural networks analyze fabric drape, lighting, and your unique body structure for photorealistic try-ons.
                    </CardDescription>
                </Card>
            </div>
        </div>
    </>)
}