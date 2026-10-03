import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import AuthBackground3D from "../components/scene/AuthBackground3D";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  FileText,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AuthPage({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading: authLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");

  // If already authenticated, redirect to /dashboard (or returnTo destination)
  useEffect(() => {
    if (!authLoading && user) {
      if (returnTo === "download") {
        navigate("/app?action=download", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, authLoading, navigate, returnTo]);

  useEffect(() => {
    setIsLogin(initialMode !== "signup");
  }, [initialMode, location.pathname]);

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const triggerSuccess = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!email || !password) {
      triggerError("Please fill in all fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      triggerError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      triggerError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) {
          triggerError(error.message || "Failed to sign in. Check your credentials.");
        } else {
          triggerSuccess();
        }
      } else {
        const { data, error } = await signUp(email, password, { full_name: name });
        if (error) {
          triggerError(error.message || "Sign up failed.");
        } else if (data?.user && !data?.session) {
          setInfoMsg("Verification link sent! Please check your email to activate your account.");
        } else {
          triggerSuccess();
        }
      }
    } catch (err) {
      triggerError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setGoogleError("");
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setGoogleError(error.message || "Failed to sign in with Google.");
        setGoogleLoading(false);
      }
      // If successful, Supabase navigates to the OAuth provider URL
    } catch (err) {
      setGoogleError(err.message || "Google OAuth failed.");
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg("Please enter your email to receive password reset link.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await resetPassword(forgotEmail);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg("Password reset email sent! Check your inbox.");
        setForgotModal(false);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-x-hidden">
      {/* Background layer */}
      <AuthBackground3D />

      {/* Main Content Area: 2-column layout matching Image 1 */}
      <div
        className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 my-auto py-8 sm:py-12"
        style={{ zIndex: 10 }}
      >
        {/* Left Column: Hero Content & Feature Highlights matching Image 1 */}
        <div className="flex-1 w-full max-w-lg text-left select-none">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles size={13} />
            <span>Next-Gen Resume Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-8">
            Build a resume that gets <br className="hidden sm:inline" />
            <span className="text-white">you hired</span>
          </h1>

          {/* Feature Highlights */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  ATS-Optimized Formatting
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Clean layouts structured to pass applicant tracking systems with top scores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Live Real-Time Preview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Instant typography and color rendering with pixel-perfect accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Executive Vector PDF Export
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Generate high-resolution printable PDFs matching top industry standards.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof / Trust Footer */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-300">
              Trusted by modern professionals
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Engineering, product, design, and management resumes
            </p>
          </div>
        </div>

        {/* Right Column: Sign In Box matching user's dark card photo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: 0,
            x: isShaking ? [-8, 8, -6, 6, -3, 3, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[480px] rounded-2xl flex flex-col p-8 sm:p-10 text-left box-border mx-auto lg:mx-0 border border-white/12 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(99,102,241,0.06)] h-auto min-h-fit shrink-0"
          style={{
            zIndex: 10,
            backgroundColor: "rgba(10, 11, 26, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* 1 & 2: Heading & Subtitle */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2.5">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Create an account to start building resumes"}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {infoMsg && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle size={15} className="shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: "48px" }}
                    className="w-full h-12 rounded-xl bg-[#121324] border border-white/12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm pr-4 placeholder:text-slate-500 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3 & 4: Email Address label & input */}
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: "48px" }}
                  className="w-full h-12 rounded-xl bg-[#121324] border border-white/12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm pr-4 placeholder:text-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* 5, 6 & 7: Password label, input & Forgot Password */}
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: "48px", paddingRight: "48px" }}
                  className="w-full h-12 rounded-xl bg-[#121324] border border-white/12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm placeholder:text-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* 7: Forgot password link */}
              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: "48px", paddingRight: "48px" }}
                    className="w-full h-12 rounded-xl bg-[#121324] border border-white/12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-sm placeholder:text-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* 8: Sign In / Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-1"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* 9: Minimal OR Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-4 bg-[#0a0b1a] text-xs uppercase font-mono text-slate-400">
                OR
              </span>
            </div>

            {/* 10: Continue with Google Button */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/25 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-white" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Small inline error message under button (no layout shift) */}
              {googleError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 mt-2 text-center">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{googleError}</span>
                </div>
              )}
            </div>

            {/* 11: Switch Mode ("Don't have an account? Sign up") */}
            <div className="text-center text-xs text-slate-400 pt-1">
              {isLogin ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setErrorMsg("");
                    }}
                    className="text-indigo-400 font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrorMsg("");
                    }}
                    className="text-indigo-400 font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

            {/* 12: Small Continue as guest text link */}
            <div className="text-center pt-1">
              <Link
                to="/app"
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Continue as guest (login needed to download)
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            style={{
              backgroundColor: "rgba(10, 10, 25, 0.98)",
              backdropFilter: "blur(20px)",
            }}
            className="p-6 sm:p-7 rounded-2xl max-w-sm w-full border border-white/15 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your account email and we'll send you a password recovery link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                  className="w-full h-11 rounded-xl bg-[#121324] border border-white/15 text-white text-xs pr-3 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setForgotModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
