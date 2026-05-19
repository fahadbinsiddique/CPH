'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Cookies from 'js-cookie'
import { User, MapPin, Building2, Phone, Image as ImageIcon, Trash2, Edit3, PlusCircle } from 'lucide-react'

export default function StudentsPage() {
  const API_URL = 'http://127.0.0.1:8000/api/student/'

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    adress: '',
    department: '',
    phone: '',
  })
  const [photoFile, setPhotoFile] = useState(null)

  // ==========================================
  // ১. হেডার কনফিগারেশন (JWT টোকেনসহ)
  // ==========================================
  const getAuthHeaders = (isFormData = false) => {
    const token = Cookies.get('auth_token') // আপনার কুকির নাম অনুযায়ী টোকেন রিড হবে
    const headers = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    return headers
  }

  // ==========================================
  // ২. GET ALL STUDENTS (READ)
  // ==========================================
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders(false),
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized! দয়া করে আবার লগইন করুন।')
        throw new Error('সার্ভার থেকে ডাটা লোড করা যায়নি।')
      }

      const data = await res.json()
      
      // Django পেজিনেশন হ্যান্ডেল করার সেফটি চেক
      if (Array.isArray(data)) {
        setStudents(data)
      } else if (data.results && Array.isArray(data.results)) {
        setStudents(data.results)
      } else {
        setStudents([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchStudents()
    }
    loadData()
  }, [])

  // INPUT HANDLER
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ==========================================
  // ৩. CREATE OR UPDATE (POST / PUT)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // ইমেজ ফাইলসহ ডাটা পাঠানোর জন্য FormData ব্যবহার করতে হবে
    const sendData = new FormData()
    sendData.append('name', formData.name)
    sendData.append('adress', formData.adress)
    sendData.append('department', formData.department)
    sendData.append('phone', formData.phone)

    // ব্যাকএন্ডে সিরিয়ালাইজারে ফাইলের ফিল্ড যদি 'photos' বা 'photo' হয় সে অনুযায়ী দিবেন
    if (photoFile) {
      sendData.append('photos', photoFile) 
    }

    try {
      let url = API_URL
      let method = 'POST'

      if (editingId) {
        url = `${API_URL}${editingId}/`
        method = 'PUT'
      }

      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(true), // true দেওয়ার ফলে Content-Type ব্রাউজার নিজে সেট করবে
        body: sendData,
      })

      if (!res.ok) throw new Error('ডাটা সেভ করা যায়নি। দয়া করে ইনপুট চেক করুন।')

      // ফর্ম রিসেট
      setFormData({ name: '', adress: '', department: '', phone: '' })
      setPhotoFile(null)
      setEditingId(null)
      
      // লিস্ট রিফ্রেশ
      await fetchStudents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // ৪. DELETE STUDENT
  // ==========================================
  const handleDelete = async (id) => {
    if (!confirm('আপনি কি নিশ্চিতভাবেই এই রেকর্ডটি ডিলিট করতে চান?')) return

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      })

      if (!res.ok) throw new Error('ডিলিট করা সম্ভব হয়নি।')
      await fetchStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  // ==========================================
  // ৫. EDIT MODE (ফর্ম ফিলআপ)
  // ==========================================
  const handleEdit = (student) => {
    setEditingId(student.id)
    setFormData({
      name: student.name || '',
      adress: student.adress || '',
      department: student.department || '',
      phone: student.phone || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 text-slate-800 dark:text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Dashboard</h1>
          <p className="text-sm text-slate-500">JWT Authenticated Secured CRUD Operations</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm font-medium">
            ⚠️ এরর: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ফর্ম কার্ড */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <PlusCircle className="w-5 h-5 text-indigo-500" />
              {editingId ? 'Update Student Record' : 'Add New Student'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="text" name="name" required placeholder="John Doe" value={formData.name} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="text" name="adress" required placeholder="Dhaka, Bangladesh" value={formData.adress} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="text" name="department" required placeholder="Psychology / CSE" value={formData.department} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="text" name="phone" required placeholder="+88017XXXXXXXX" value={formData.phone} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Profile Photo</label>
                <div className="mt-1 flex items-center justify-center px-4 pt-4 pb-4 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-lg hover:border-indigo-500 transition cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-7 w-7 text-slate-400" />
                    <div className="flex text-xs text-slate-600">
                      <label className="relative font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        <span>Upload photo file</span>
                        <input type="file" className="sr-only" onChange={(e) => setPhotoFile(e.target.files[0])} />
                      </label>
                    </div>
                    {photoFile && <p className="text-xs text-emerald-500 font-medium">{photoFile.name}</p>}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-sm shadow-sm transition text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-300">
                {loading ? 'Processing...' : editingId ? 'Update Student' : 'Save Student'}
              </button>
            </form>
          </div>

          {/* লিস্ট কার্ডস */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Students ({students.length})</h2>

            {loading && students.length === 0 ? (
              <div className="p-10 text-center text-slate-400 font-medium">নিরাপদে ডাটা লোড হচ্ছে...</div>
            ) : students.length === 0 ? (
              <div className="p-10 text-center text-slate-400 border rounded-2xl border-dashed dark:border-slate-800">কোনো স্টুডেন্ট রেকর্ড খুঁজে পাওয়া যায়নি।</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.map((student) => (
                  <div key={student.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                    
                    <div className="flex gap-4 items-start">
                      {/* ক্লাউডিনারি ইমেজ রেন্ডার */}
                      <div className="relative h-16 w-16 min-w-[64px] rounded-xl overflow-hidden border bg-slate-100 dark:border-slate-800">
                        <Image 
                          src={student.photo } 
                          alt={student.name } 
                          fill 
                          className="object-cover" 
                          unoptimized // ক্লাউডিনারি ফুল ইউআরএল ডাইরেক্ট ইম্পোর্টের জন্য সেফ সাইড
                        />
                      </div>
                      
                      {/* তথ্যাদি */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">{student.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> {student.department}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {student.adress}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {student.phone}</p>
                      </div>
                    </div>

                    {/* অ্যাকশন বাটনসমূহ */}
                    <div className="flex justify-end gap-2 border-t dark:border-slate-800 pt-3">
                      <button onClick={() => handleEdit(student)} className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 bg-slate-50 dark:bg-slate-800 rounded-lg transition">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-600 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-800 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}