import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      setError('')
      const { error } = await signIn({ email: data.email, password: data.password })
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-violet-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Glassmorphism Card */}
      <div className="relative max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-slate-700/50 z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Welcome back
          </h2>
          <p className="mt-3 text-center text-sm text-slate-400">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors drop-shadow-sm">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center backdrop-blur-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email-address">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                disabled={isSubmitting}
                className={`appearance-none block w-full px-4 py-3 bg-slate-950/50 border ${errors.email ? 'border-red-500/50' : 'border-slate-700/50'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all sm:text-sm`}
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                disabled={isSubmitting}
                className={`appearance-none block w-full px-4 py-3 bg-slate-950/50 border ${errors.password ? 'border-red-500/50' : 'border-slate-700/50'} rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all sm:text-sm`}
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? 'Verifying credentials...' : 'Sign in to DevLog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
