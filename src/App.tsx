import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Fingerprint, 
  Building2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Check,
  Chrome,
  Shield,
  Smartphone,
  Link,
  Users,
  Github
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type AuthMethod = 'password' | 'google' | 'github' | 'biometric' | 'otp' | 'magic' | 'sso';

interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  company: string;
  firstName: string;
  lastName: string;
}

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    firstName: '',
    lastName: ''
  });

  const [backgroundShapes, setBackgroundShapes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate floating background shapes with darker colors for black background
    const shapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      color: ['bg-purple-500/10', 'bg-blue-500/10', 'bg-emerald-500/10', 'bg-orange-500/10'][Math.floor(Math.random() * 4)],
      duration: Math.random() * 20 + 10
    }));
    setBackgroundShapes(shapes);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleBiometricAuth = () => {
    setBiometricStatus('scanning');
    setTimeout(() => {
      setBiometricStatus('success');
      setTimeout(() => {
        setBiometricStatus('idle');
        // Simulate successful authentication
        alert('Biometric authentication successful!');
      }, 1500);
    }, 2000);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} authentication initiated!`);
    }, 1500);
  };

  const handleMagicLink = () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Magic link sent to your email!');
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otpStep === 'phone') {
      if (!formData.phone) {
        alert('Please enter your phone number');
        return;
      }
      setOtpStep('verify');
    } else {
      const otpCode = otp.join('');
      if (otpCode.length === 6) {
        alert('OTP verified successfully!');
        setOtpStep('phone');
        setOtp(['', '', '', '', '', '']);
      } else {
        alert('Please enter complete OTP');
      }
    }
  };

  const renderAuthMethod = () => {
    switch (authMethod) {
      case 'password':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {authMode === 'signup' && (
              <>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
              </>
            )}

            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        );

      case 'google':
        return (
          <div className="space-y-4">
            <button
              onClick={() => handleSocialAuth('Google')}
              disabled={isLoading}
              className="w-full py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-semibold hover:bg-gray-700/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Chrome className="w-6 h-6" />
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            
            {authMode === 'signup' && (
              <div className="text-sm text-gray-400 text-center">
                By continuing with Google, you agree to link your Google account to your profile
              </div>
            )}
          </div>
        );

      case 'github':
        return (
          <div className="space-y-4">
            <button
              onClick={() => handleSocialAuth('GitHub')}
              disabled={isLoading}
              className="w-full py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-semibold hover:bg-gray-700/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Github className="w-6 h-6" />
              <span>{isLoading ? 'Connecting...' : 'Continue with GitHub'}</span>
            </button>
            
            {authMode === 'signup' && (
              <div className="text-sm text-gray-400 text-center">
                By continuing with GitHub, you agree to link your GitHub account to your profile
              </div>
            )}
            
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-1">Developer-friendly authentication</p>
                  <p className="text-gray-400">Access your repositories and developer profile seamlessly</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'biometric':
        return (
          <div className="space-y-6 text-center">
            <div className="relative">
              <div 
                className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-500 ${
                  biometricStatus === 'idle' ? 'border-purple-400 bg-purple-400/20' :
                  biometricStatus === 'scanning' ? 'border-orange-400 bg-orange-400/20 animate-pulse' :
                  biometricStatus === 'success' ? 'border-green-400 bg-green-400/20' :
                  'border-red-400 bg-red-400/20'
                }`}
                onClick={handleBiometricAuth}
              >
                {biometricStatus === 'success' ? (
                  <Check className="w-16 h-16 text-green-400" />
                ) : (
                  <Fingerprint className={`w-16 h-16 transition-colors duration-300 ${
                    biometricStatus === 'idle' ? 'text-purple-400' :
                    biometricStatus === 'scanning' ? 'text-orange-400' :
                    'text-red-400'
                  }`} />
                )}
              </div>
              
              {biometricStatus === 'scanning' && (
                <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping"></div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {biometricStatus === 'idle' ? 'Touch sensor to authenticate' :
                 biometricStatus === 'scanning' ? 'Scanning...' :
                 biometricStatus === 'success' ? 'Authentication successful!' :
                 'Authentication failed'}
              </h3>
              <p className="text-gray-400">
                {biometricStatus === 'idle' ? 'Place your finger on the sensor' :
                 biometricStatus === 'scanning' ? 'Please hold still' :
                 biometricStatus === 'success' ? 'Welcome back!' :
                 'Please try again'}
              </p>
            </div>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-4">
            {otpStep === 'phone' ? (
              <>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleOtpSubmit}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-300"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Enter verification code</h3>
                  <p className="text-gray-400">We sent a 6-digit code to {formData.phone}</p>
                </div>
                
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                      maxLength={1}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setOtpStep('phone')}
                    className="flex-1 py-3 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOtpSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Verify
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'magic':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
            
            <button
              onClick={handleMagicLink}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Link className="w-5 h-5" />
              <span>{isLoading ? 'Sending...' : 'Send Magic Link'}</span>
            </button>
            
            <div className="text-sm text-gray-400 text-center">
              We'll send you a secure link to sign in without a password
            </div>
          </div>
        );

      case 'sso':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Company domain or email"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialAuth('Azure AD')}
                className="py-3 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Azure</span>
              </button>
              <button
                onClick={() => handleSocialAuth('Okta')}
                className="py-3 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700/50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Okta</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-400 text-center">
              Connect with your work account for seamless access
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const authMethodButtons = [
    { key: 'password', icon: Lock, label: 'Password', color: 'from-purple-500 to-blue-500' },
    { key: 'google', icon: Chrome, label: 'Google', color: 'from-red-500 to-orange-500' },
    { key: 'github', icon: Github, label: 'GitHub', color: 'from-gray-700 to-gray-900' },
    { key: 'biometric', icon: Fingerprint, label: 'Biometric', color: 'from-emerald-500 to-teal-500' },
    { key: 'otp', icon: Smartphone, label: 'SMS OTP', color: 'from-blue-500 to-indigo-500' },
    { key: 'magic', icon: Link, label: 'Magic Link', color: 'from-purple-500 to-pink-500' },
    { key: 'sso', icon: Building2, label: 'SSO', color: 'from-orange-500 to-yellow-500' },
  ] as const;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {backgroundShapes.map((shape) => (
          <div
            key={shape.id}
            className={`absolute rounded-full ${shape.color} animate-float`}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.id * 2}s`
            }}
          />
        ))}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-900/20"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {authMode === 'login' ? 'Sign in to your account' : 'Join us today'}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Mode Toggle */}
            <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  authMode === 'login'
                    ? 'bg-gray-700/70 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  authMode === 'signup'
                    ? 'bg-gray-700/70 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Method Selection */}
            {authMethod === 'password' && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-4">Choose your preferred sign-in method:</p>
                <div className="grid grid-cols-3 gap-2">
                  {authMethodButtons.slice(1).map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.key}
                        onClick={() => setAuthMethod(method.key as AuthMethod)}
                        className={`p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300 flex flex-col items-center space-y-1 group`}
                      >
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Auth Method Header */}
            {authMethod !== 'password' && (
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setAuthMethod('password')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-white ml-2">
                  {authMethodButtons.find(m => m.key === authMethod)?.label} Authentication
                </h2>
              </div>
            )}

            {/* Auth Method Content */}
            {renderAuthMethod()}

            {/* Footer */}
            {authMethod === 'password' && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-xs">
              Protected by enterprise-grade security • Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(15px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;