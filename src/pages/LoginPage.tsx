import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff,
  Sparkles,
  BookOpen,
  Layout,
  Layers
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const login = useStore((state) => state.login);
  const signup = useStore((state) => state.signup);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const slides = [
    {
      icon: Layout,
      title: "1. Visual System Architecture Mapping",
      description: "Map your engineering topology directly on a visual white-board. Construct layers representing Frontends, Backends, and Databases. Draw connection strings to define API pathways and data flow streams, exposing architectural blockages before writing code."
    },
    {
      icon: Layers,
      title: "2. Micro-Task Planning & Progress Tracking",
      description: "Avoid fragmented management systems. Double-click any structural block on the canvas to open its local checklist panel. Breakdown massive deployments into micro-tasks. Node completion indicators update dynamically as checklist items are checked off."
    },
    {
      icon: BookOpen,
      title: "3. Timeline-Based Deadline Schedules",
      description: "Sync project milestones with interactive scheduling. Assign start and due dates to specific modules. The chronological calendar timeline widget automatically anchors node completion schedules, giving stakeholders a real-time progress view."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please fill in all email and password fields.');
        return;
      }
    }
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Authenticate as a guest user with mock email
      await login('guest_explorer@example.com', 'guest-access');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in as guest.');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = slides[activeSlide].icon;

  return (
    <div className="min-h-screen w-screen bg-[#ebdcb9] flex items-center justify-center p-4 md:p-8 font-mono overflow-y-auto selection:bg-[#ff6f3c] selection:text-white">
      {/* Outer Brutalist Frame Container */}
      <div className="w-full max-w-5xl bg-[#ebdcb9] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Column (Vector Illustration Card & Theory) */}
        <div className="w-full md:w-1/2 flex flex-col justify-between border-b-[3px] md:border-b-0 md:border-r-[3px] border-black bg-[#ebdcb9] p-6 gap-6">
          
          {/* Header block with Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff6f3c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-xs tracking-wider uppercase text-black">Litverse Canvas</h1>
              <p className="text-[9px] font-bold text-black/60 uppercase">Canvas-Driven Project Management</p>
            </div>
          </div>

          {/* Illustration Container */}
          <div className="w-full flex-1 flex items-center justify-center p-2 border-[2px] border-black bg-white overflow-hidden max-h-[300px] relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/login_illustration.png" 
              alt="Litverse Illustration" 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Theory / Guide Content Carousel */}
          <div className="border-[2px] border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2 text-[#ff6f3c]">
              <ActiveIcon className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-tight text-black">
                {slides[activeSlide].title}
              </h3>
            </div>
            <p className="text-[10px] text-black/80 leading-relaxed font-bold min-h-[75px]">
              {slides[activeSlide].description}
            </p>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex justify-center items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2.5 h-2.5 rounded-full border-2 border-black transition-colors ${
                  activeSlide === index ? 'bg-black' : 'bg-black/20'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column (Standard Forms & Guest Trial Toggle) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8 bg-[#ebdcb9]">
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Form Title */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold font-mono tracking-tight uppercase text-black">
                {isSignUp ? 'Create a workspace account' : 'Access Your Whiteboards'}
              </h2>
              <p className="text-[10px] text-black/75 mt-1 font-bold">
                Visually plan, map, and orchestrate systems with ease.
              </p>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="bg-red-100 border-[2px] border-red-500 text-red-700 px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#ef4444]">
                {error}
              </div>
            )}

            {/* Form Input Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-black tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    placeholder="John Doe"
                    className="w-full border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black placeholder-black/40 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-black tracking-wider block">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="developer@example.com"
                  className="w-full border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black placeholder-black/40 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-[9px] uppercase font-bold text-black tracking-wider block">Password {isSignUp && <span className="text-black/50 lowercase">(min 6 chars)</span>}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full border-2 border-black bg-white pl-3 pr-10 py-2 text-xs font-bold text-black placeholder-black/40 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#ff6f3c] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1 relative">
                  <label className="text-[9px] uppercase font-bold text-black tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full border-2 border-black bg-white pl-3 pr-10 py-2 text-xs font-bold text-black placeholder-black/40 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#ff6f3c] transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Password recovery link */}
              {!isSignUp && (
                <div className="text-right">
                  <a 
                    href="#recovery"
                    onClick={(e) => { e.preventDefault(); alert('Please sign in as Guest to preview, or use guest_explorer@example.com.'); }} 
                    className="text-[9px] text-black hover:text-[#ff6f3c] font-bold underline decoration-dotted decoration-1"
                  >
                    Recovery Password
                  </a>
                </div>
              )}

              {/* Continue/Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6f3c] hover:bg-[#ff6f3c]/90 text-white font-bold py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-mono uppercase text-xs tracking-wider disabled:opacity-50 mt-2"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Continue')}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="flex-grow border-t border-black/40"></div>
              <span className="px-3 text-[9px] text-black/60 uppercase font-bold">
                Or quick test
              </span>
              <div className="flex-grow border-t border-black/40"></div>
            </div>

            {/* Guest Sandbox Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-100 text-black font-black py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-mono uppercase text-xs tracking-wider disabled:opacity-50 text-center block"
            >
              Explore as Guest (No Sign In)
            </button>

            {/* Form Mode Toggle */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-black hover:text-[#ff6f3c] underline decoration-solid"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
