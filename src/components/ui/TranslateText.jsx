import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// Component to handle text translation
const TranslateText = ({ children, translationKey }) => {
  const { currentLanguage, translateText } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Original text content to translate
  const originalText = typeof children === 'string' ? children : translationKey || '';
  
  useEffect(() => {
    let isMounted = true;
    
    const performTranslation = async () => {
      // Skip translation if text is empty
      if (!originalText.trim()) {
        setIsLoading(false);
        setTranslatedText('');
        return;
      }
      
      setIsLoading(true);
      setError(false);
      
      try {
        const translated = await translateText(originalText, currentLanguage);
        if (isMounted) {
          setTranslatedText(translated);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedText(originalText);
          setError(true);
          setIsLoading(false);
        }
      }
    };
    
    performTranslation();
    
    return () => {
      isMounted = false;
    };
  }, [originalText, currentLanguage, translateText]);
  
  // Show loading state or translated text
  if (isLoading) {
    return <span className="opacity-70">{originalText}</span>;
  }
  
  if (error) {
    return <span>{originalText}</span>;
  }
  
  return <>{translatedText || originalText}</>;
};

export default TranslateText; 