import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import TranslateText from '../ui/TranslateText';
import LanguageSelector from '../ui/LanguageSelector';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate and create account here
    // For now, we'll just redirect to dashboard
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 transform transition-all duration-300 hover:shadow-indigo-500/20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-900 mb-2 drop-shadow-sm">
            <TranslateText>Create Your Account</TranslateText>
          </h2>
          <p className="text-indigo-600 font-medium">
            <TranslateText>Join our healthcare community today</TranslateText>
          </p>
        </div>
        
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-indigo-200/70 placeholder-indigo-400 text-indigo-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-indigo-200/70 placeholder-indigo-400 text-indigo-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-indigo-200/70 placeholder-indigo-400 text-indigo-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-indigo-200/70 placeholder-indigo-400 text-indigo-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded transition-colors"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-indigo-700 font-medium">
              <TranslateText>I agree to the</TranslateText>{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                <TranslateText>Terms and Conditions</TranslateText>
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-indigo-500/30"
            >
              <TranslateText>Create Account</TranslateText>
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-indigo-600 font-medium">
            <TranslateText>Already have an account?</TranslateText>{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              <TranslateText>Sign in</TranslateText>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 