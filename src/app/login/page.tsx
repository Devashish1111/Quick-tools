import { Zap, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--qt-bg)' }}>
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-75 transition-opacity" style={{ color: 'var(--qt-text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="p-8 rounded-2xl shadow-2xl" style={{ background: 'var(--qt-bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--qt-accent)' }}>
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--qt-text)' }}>Welcome back</h1>
            <p className="text-sm mt-2" style={{ color: 'var(--qt-text-secondary)' }}>Sign in to unlock Pro features</p>
          </div>

          <form className="space-y-4 flex flex-col">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--qt-text-secondary)' }}>Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm transition-colors"
                style={{ background: 'var(--qt-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--qt-text)' }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--qt-text-secondary)' }}>Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm transition-colors"
                style={{ background: 'var(--qt-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--qt-text)' }}
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className="p-3 rounded-lg text-sm flex items-start gap-2" style={{ background: 'rgba(255, 77, 106, 0.1)', color: 'var(--qt-error)' }}>
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{message}</p>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <button
                formAction={login}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
                style={{ background: 'var(--qt-accent)', color: 'black' }}
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--qt-text)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-xs mt-6" style={{ color: 'var(--qt-text-muted)' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
