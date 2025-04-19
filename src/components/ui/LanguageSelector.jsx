import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaGlobe, FaChevronDown, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages, isRateLimited } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showRateLimitNotice, setShowRateLimitNotice] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get current language name
  const currentLanguageName = languages.find(lang => lang.code === currentLanguage)?.name || 'English';
  
  // Show rate limit notice when isRateLimited changes to true
  useEffect(() => {
    if (isRateLimited) {
      setShowRateLimitNotice(true);
      const timer = setTimeout(() => {
        setShowRateLimitNotice(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRateLimited]);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle language selection
  const handleSelectLanguage = (languageCode) => {
    if (languageCode === currentLanguage) {
      setIsOpen(false);
      return;
    }
    
    setIsChanging(true);
    changeLanguage(languageCode);
    setIsOpen(false);
    
    // Reset changing state after a delay to allow translations to load
    setTimeout(() => {
      setIsChanging(false);
    }, 1500);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white hover:text-yellow-200 transition-colors font-medium px-2 py-1 rounded-md"
        aria-expanded={isOpen}
        disabled={isChanging}
      >
        {isChanging ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : isRateLimited ? (
          <FaExclamationTriangle className="text-yellow-300 mr-2" />
        ) : (
          <FaGlobe className="mr-2" />
        )}
        <span className="max-w-[80px] truncate">{currentLanguageName.split(' ')[0]}</span>
        <FaChevronDown className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-56 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
            {languages.map(language => (
              <button
                key={language.code}
                onClick={() => handleSelectLanguage(language.code)}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === language.code 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={isChanging}
              >
                <span className="flex-1">{language.name}</span>
                {currentLanguage === language.code && (
                  <FaCheck className="text-indigo-600 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isChanging && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <FaSpinner className="text-indigo-600 text-4xl animate-spin mb-2" />
            <p className="text-sm font-medium text-gray-700">Changing language...</p>
          </div>
        </div>
      )}
      
      {showRateLimitNotice && (
        <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-amber-50 rounded-lg shadow-lg p-3 border border-amber-200">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">API Rate Limit Reached</p>
              <p className="text-xs text-amber-700 mt-1">
                Using built-in translations for common phrases. Some text may still be in English.
              </p>
            </div>
          </div>
          <button 
            className="absolute top-1 right-1 text-amber-400 hover:text-amber-600"
            onClick={() => setShowRateLimitNotice(false)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 