'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    // role: 'client', // Default role matching your model
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Input হ্যান্ডেলার
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ফর্ম সাবমিট হ্যান্ডেলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ১. পাসওয়ার্ড ম্যাচিং ভ্যালিডেশন (ফ্রন্টএন্ডেই চেক করে নেওয়া ভালো)
    if (formData.password !== formData.confirm_password) {
      setError('পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    setLoading(true);

    try {
      // ২. ব্যাকএন্ড API-তে ডেটা পাঠানো
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number,
        //   role: formData.role,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ব্যাকএন্ড থেকে কোনো এরর মেসেজ আসলে তা দেখানো
        throw new Error(data.message || data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }

      // ৩. সফল হলে মেসেজ দেখানো এবং লগইন পেজে রিডাইরেক্ট করা
      setSuccess('রেজিস্ট্রেশন সফল হয়েছে! লগইন পেজে রিডাইরেক্ট করা হচ্ছে...');
      
      setTimeout(() => {
        router.push('/auth/login'); // আপনার লগইন পেজের রাউট
      }, 2000); // ২ সেকেন্ড পর রিডাইরেক্ট হবে

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
        
        {/* এরর এবং সাকসেস মেসেজ অ্যালার্ট */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div>

          {/* Full Name */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div> */}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div>

       

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black" />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <button><Link href={'/auth/login'}>Already have an account?</Link></button>
      </div>
    </div>
  );
}