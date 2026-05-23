"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Phone, User, AlertCircle } from 'lucide-react'
import { useState } from "react"
import { useRouter } from "next/router"

const RegisterForm = () => {
  // const router = useRouter()
  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  })

  // স্টেট ম্যানেজমেন্ট
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // ইউজার টাইপ করা শুরু করলে আগের এরর রিমুভ করে দেওয়া
    if (error) setError('')
  }

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // পাসওয়ার্ড ম্যাচিং চেক (আপনার সিরিয়ালাইজারের লজিক অনুযায়ী)
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // এখানে আপনার API কল হবে
      console.log("Submitting to Django backend:", formData)
      
      // API Call Example:
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      // if (response.ok)
      //   router.push('/auth/login')
      
      
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xl shadow-teal-900/5 rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Start your journey to mental wellness today
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* পাসওয়ার্ড না মিললে Shadcn Alert দেখাবে */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 py-3 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-slate-700 font-medium text-sm">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <Label htmlFor="phone_number" className="text-slate-700 font-medium text-sm">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="017XXXXXXXX"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-10 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-slate-700 font-medium text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium h-10 rounded-xl transition-all shadow-md shadow-teal-600/10 mt-2"
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-slate-100 py-4">
          <p className="text-xs text-slate-500">
            Already have an account?
            <a href="/auth/login" className="text-teal-600 font-semibold hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterForm