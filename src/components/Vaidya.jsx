import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaFileUpload, FaEnvelope, FaHome, FaHistory, FaPhone, FaHeartbeat, FaCheckCircle, FaTimes, FaUser, FaPhoneAlt, FaComments, FaExclamationCircle, FaCheck, FaGift, FaCalendarAlt, FaStore, FaHospital, FaCopy, FaClipboardCheck, FaSpinner, FaClock } from 'react-icons/fa';

export default function GramVaidhyaWebsite() {
  const homeRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);
  const navigate = useNavigate();

  const [fileUpload, setFileUpload] = useState(null);
  const [experienceText, setExperienceText] = useState('');
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    file: false,
    experience: false
  });
  const [popupAnimation, setPopupAnimation] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showCouponPopup || showContactPopup) {
      // Add a small delay to trigger the animation after the popup is rendered
      setTimeout(() => {
        setPopupAnimation(true);
      }, 50);
    } else {
      setPopupAnimation(false);
    }
  }, [showCouponPopup, showContactPopup]);

  // Reset copied state when popup closes
  useEffect(() => {
    if (!showCouponPopup) {
      setCopiedCoupon(null);
    }
  }, [showCouponPopup]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileUpload(e.target.files[0].name);
      setValidationErrors(prev => ({...prev, file: false}));
    }
  };

  const handleExperienceChange = (e) => {
    setExperienceText(e.target.value);
    if (e.target.value.trim().length > 0) {
      setValidationErrors(prev => ({...prev, experience: false}));
    }
  };

  const handleTalkWithDoctor = () => {
    window.location.href = 'http://localhost:5175';
  };

  const handleCopyCoupon = (code) => {
    // Copy to clipboard
    navigator.clipboard.writeText(code)
      .then(() => {
        // Set the copied coupon code
        setCopiedCoupon(code);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopiedCoupon(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleSubmitExperience = () => {
    // Validate form
    const errors = {
      file: !fileUpload,
      experience: !experienceText.trim()
    };
    
    setValidationErrors(errors);
    
    // If there are errors, don't proceed
    if (errors.file || errors.experience) {
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate random coupons
      const pharmacyCoupons = [
        { code: 'HEALTH20', discount: '20% off on all medicines', validUntil: '31 Dec 2025', icon: <FaStore className="text-indigo-500" /> },
        { code: 'WELLNESS15', discount: '15% off on supplements', validUntil: '30 Nov 2025', icon: <FaStore className="text-indigo-500" /> },
        { code: 'CARE25', discount: '25% off on first purchase', validUntil: '31 Jan 2026', icon: <FaStore className="text-indigo-500" /> },
        { code: 'MEDS10', discount: '10% off on prescription medicines', validUntil: '28 Feb 2026', icon: <FaStore className="text-indigo-500" /> },
        { code: 'VITAMIN30', discount: '30% off on vitamins', validUntil: '31 Mar 2026', icon: <FaStore className="text-indigo-500" /> }
      ];
      
      const clinicCoupons = [
        { code: 'CHECKUP50', discount: '50% off on general checkup', validUntil: '31 Dec 2025', icon: <FaHospital className="text-indigo-500" /> },
        { code: 'CONSULT30', discount: '30% off on specialist consultation', validUntil: '30 Nov 2025', icon: <FaHospital className="text-indigo-500" /> },
        { code: 'DIAGNOSTIC40', discount: '40% off on diagnostic tests', validUntil: '31 Jan 2026', icon: <FaHospital className="text-indigo-500" /> },
        { code: 'THERAPY25', discount: '25% off on physiotherapy', validUntil: '28 Feb 2026', icon: <FaHospital className="text-indigo-500" /> },
        { code: 'DENTAL20', discount: '20% off on dental services', validUntil: '31 Mar 2026', icon: <FaHospital className="text-indigo-500" /> }
      ];
      
      // Randomly select 3 coupons
      const allCoupons = [...pharmacyCoupons, ...clinicCoupons];
      const shuffled = allCoupons.sort(() => 0.5 - Math.random());
      const selectedCoupons = shuffled.slice(0, 3);
      
      setCoupons(selectedCoupons);
      setIsLoading(false);
      setShowCouponPopup(true);
    }, 2000); // 2 second delay to simulate processing
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    
    // Show the confirmation popup
    setShowContactPopup(true);
    
    // Reset the form
    setContactForm({
      name: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Floating Colorful Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-full shadow-xl px-6 py-3 m-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <FaHeartbeat className="text-purple-600 text-2xl" />
              </div>
              <span className="text-2xl font-bold text-white">
                Dr. Vaidhya
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection(homeRef)}
                className="flex items-center text-white hover:text-yellow-200 transition-colors font-medium"
              >
                <FaHome className="mr-2" />
                Home
              </button>
              <button
                onClick={() => scrollToSection(experienceRef)}
                className="flex items-center text-white hover:text-yellow-200 transition-colors font-medium"
              >
                <FaHistory className="mr-2" />
                Experience
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="flex items-center text-white hover:text-yellow-200 transition-colors font-medium"
              >
                <FaEnvelope className="mr-2" />
                Contact Us
              </button>
            </div>
            <div className="md:hidden">
              <button className="text-white hover:text-yellow-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Home Section */}
      <section
        ref={homeRef}
        className="relative flex flex-col items-center justify-center py-20 px-4 min-h-screen"
        style={{ 
          backgroundImage: 'url("https://www.tietoevry.com/globalassets/brandportal/web-image-library/doctor-talking-mobile-hospital.jpg?quality=80&width=1920&format=webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Left-aligned message - moved further down */}
        <div className="absolute left-8 top-32 text-left z-10">
          <p className="text-[3.5vw] font-bold text-white leading-none leading-snug drop-shadow-lg">
            Compassionate Care,<br />
            Healthier Future Together
          </p>
        </div>

        <div className="text-center max-w-2xl mx-auto z-10 mt-40">
          <button 
            onClick={handleTalkWithDoctor}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xl font-bold py-6 px-12 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Talk with Dr. Vaidhya
          </button>
          <p className="mt-6 text-white italic drop-shadow-md">Poor network connection? Call us directly.</p>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceRef}
        className="py-20 px-4 min-h-screen relative"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yJTIwcGF0aWVudHxlbnwwfHwwfHx8MA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 to-purple-900/80"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Share Your Experience</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">Upload your medical records and tell us about your symptoms to help us provide better care.</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-indigo-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaFileUpload className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-medium text-indigo-700">Upload your medical records</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-full max-w-md p-6 border-2 ${validationErrors.file ? 'border-red-400 bg-red-50' : 'border-dashed border-indigo-300 hover:bg-indigo-50'} rounded-lg cursor-pointer transition-colors`}>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <FaFileUpload className={`w-12 h-12 ${validationErrors.file ? 'text-red-500' : 'text-indigo-500'} mb-2`} />
                    <span className={`mt-2 text-base ${validationErrors.file ? 'text-red-600' : 'text-indigo-600'}`}>
                      {fileUpload ? fileUpload : "Click to upload image or PDF"}
                    </span>
                  </label>
                </div>
                {validationErrors.file && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    <span>Please upload a file to continue</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <FaComments className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-medium text-indigo-700">Describe Your Experience</h3>
              </div>
              <div className="relative">
                <textarea
                  value={experienceText}
                  onChange={handleExperienceChange}
                  className={`w-full h-40 p-4 border ${validationErrors.experience ? 'border-red-400 bg-red-50' : 'border-indigo-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  placeholder="Describe your experience or symptoms..."
                />
                {validationErrors.experience && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    <span>Please describe your experience to continue</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmitExperience}
                disabled={isLoading}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-full transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  'Submit Experience'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        ref={contactRef}
        className="py-20 px-4 min-h-screen relative"
        style={{ 
          backgroundImage: 'url("https://www.lummi.ai/api/render/image/3a9ea08d-8ead-4f34-acb9-634cb7fa4407?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjNhOWVhMDhkLThlYWQtNGYzNC1hY2I5LTYzNGNiN2ZhNDQwNyIsImRvd25sb2FkU2l6ZSI6Im1lZGl1bSIsInJlbmRlclNwZWNzIjp7ImVmZmVjdHMiOnsicmVmcmFtZSI6e319fSwic2hvdWxkQXV0b0Rvd25sb2FkIjpmYWxzZSwianRpIjoiTmVrMUN0N2ZkYUZRaGxISWlRZVNGIiwiaWF0IjoxNzQ1MDU1NTQyLCJleHAiOjE3NDUwNTU2MDJ9.Tc5GzvEi00y0BhsptXQDnRw_BR4gzR53EO_C7Yg-qvs")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 to-purple-900/80"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">Get in touch with our healthcare professionals for personalized care.</p>
          </div>

          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-indigo-100">
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-indigo-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full pl-10 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhoneAlt className="text-indigo-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="w-full pl-10 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <FaComments className="text-indigo-500" />
                </div>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full pl-10 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <FaUserMd className="text-teal-400 text-2xl mr-2" />
                <span className="text-xl font-bold">Dr. Vaidhya</span>
              </div>
              <p className="text-gray-400 mt-2">Compassionate healthcare at your fingertips</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaPhone className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>© 2025 Dr. Vaidhya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
            <FaSpinner className="text-indigo-500 text-4xl animate-spin mb-4" />
            <p className="text-indigo-700 font-medium">Processing your experience...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we generate your exclusive coupons</p>
          </div>
        </div>
      )}

      {/* Coupon Popup */}
      {showCouponPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all duration-500 ${popupAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <button 
              onClick={() => setShowCouponPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-800">Thank You!</h3>
              <p className="text-gray-600 mt-2">Your experience has been submitted successfully.</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <FaGift className="text-indigo-500 text-xl mr-2" />
                <h4 className="text-lg font-semibold text-indigo-700">Your Exclusive Coupons</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">Use these coupons at our partner pharmacies and clinics:</p>
              
              <div className="space-y-3">
                {coupons.map((coupon, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-white p-2 rounded-full mr-3 mt-1">
                        {coupon.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <p className="font-bold text-indigo-800 text-lg">{coupon.code}</p>
                              <button 
                                onClick={() => handleCopyCoupon(coupon.code)}
                                className="ml-2 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                                title="Copy coupon code"
                              >
                                {copiedCoupon === coupon.code ? (
                                  <FaClipboardCheck className="text-green-500" />
                                ) : (
                                  <FaCopy className="text-indigo-500" />
                                )}
                              </button>
                            </div>
                            <p className="text-indigo-600">{coupon.discount}</p>
                          </div>
                          <div className="text-right flex items-center">
                            <FaCalendarAlt className="text-indigo-400 mr-1" />
                            <p className="text-xs font-medium text-indigo-700">{coupon.validUntil}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowCouponPopup(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Confirmation Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all duration-500 ${popupAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <button 
              onClick={() => setShowContactPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-800">Thank You!</h3>
              <p className="text-gray-600 mt-2">Your message has been sent successfully.</p>
            </div>
            
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-100">
              <div className="flex items-center mb-2">
                <FaClock className="text-indigo-500 mr-2" />
                <p className="text-indigo-700 font-medium">We will get in touch with you shortly.</p>
              </div>
              <p className="text-indigo-600 text-sm">Our healthcare professionals will review your message and contact you within 24 hours.</p>
            </div>
            
            <button
              onClick={() => setShowContactPopup(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
