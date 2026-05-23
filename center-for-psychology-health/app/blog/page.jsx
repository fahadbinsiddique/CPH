import { cookies } from 'next/headers';
import React from 'react';
import { User, Mail, ShieldAlert, GraduationCap, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

// ১. স্টুডেন্ট ডেটা আনার ফাংশন
async function getStudents() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  console.log("=== NEXT.JS COOKIE DEBUG ===");
  console.log("Fetched Token from Cookie:", token ? "Token Found! ✅" : "Token is UNDEFINED ❌");
  console.log("=============================");

  if (!token) {
    return null; 
  }

  try {
    // লোকালহোস্ট কুকি ইরর এড়াতে 127.0.0.1 এর বদলে localhost ব্যবহার করা হলো
    const res = await fetch('http://localhost:8000/api/student/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.error("Django rejected the token. 401 Unauthorized.");
        return "invalid_token";
      }
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

// 🔴 ২. সার্ভার অ্যাকশন লগআউট ফাংশন (Server Action)
async function handleLogout() {
  'use server'; // এটি নেক্সট জেএসকে বলে যে এই ফাংশনটি সার্ভারেই রান হবে
  
  try {
    await fetch('http://localhost:8000/api/auth/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' //বানান ঠিক করা হলো
    });
  } catch (error) {
    console.error('Backend logout failed', error);
  }

  // ৩. সফল হোক বা না হোক, নেক্সট জেএস সার্ভার থেকে কুকি ডিলিট করে লগইনে পাঠিয়ে দেব
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  redirect('auth//login'); // লগইন পেজে রিডাইরেক্ট
}

const BlogPage = async () => {
  const datas = await getStudents();

  // কন্ডিশনাল চেকিং: টোকেন একদমই না থাকলে বা টোকেন ইনভ্যালিড হলে
  if (datas === null || datas === "invalid_token") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md p-6 bg-red-50/60 backdrop-blur-md border border-red-200 rounded-2xl text-center shadow-xl shadow-red-900/5">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-900">
            {datas === "invalid_token" ? "Session Expired" : "Access Denied"}
          </h3>
          <p className="text-sm text-red-700/80 mt-1">
            {datas === "invalid_token" 
              ? "Your token is invalid or expired. Please login again." 
              : "No active access_token found in your browser cookies."}
          </p>
          <a href="/login" className="inline-flex items-center justify-center mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition-all">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (datas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-md">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No student records discovered in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-teal-600" />
            Student Directory
          </h2>
          
          {/* 🔴 ৪. লগআউট ফর্ম (সার্ভার সাইড বাটন) */}
          <form action={handleLogout}>
            <button 
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
        
        {/* স্টুডেন্ট কার্ড গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {datas.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-800 truncate">{item.name}</h3>
                  {item.email && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <p className="text-xs truncate font-medium">{item.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;