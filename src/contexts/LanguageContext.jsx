import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

// Sarvam API key
const SARVAM_API_KEY = "2c730dc2-6768-4e79-8cd4-503db6440333";

// Available languages (matching Sarvam API languages)
export const languages = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)' },
  { code: 'mr-IN', name: 'मराठी (Marathi)' },
  { code: 'od-IN', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' }
];

// Fallback translations for common phrases when API rate limit is hit
const fallbackTranslations = {
  "hi-IN": {
    "Dr. Vaidhya": "डॉ. वैद्य",
    "Home": "होम",
    "Experience": "अनुभव",
    "Contact Us": "संपर्क करें",
    "Compassionate Care,": "करुणामय देखभाल,",
    "Healthier Future Together": "स्वस्थ भविष्य एक साथ",
    "Talk with Dr. Vaidhya": "डॉ. वैद्य से बात करें",
    "Poor network connection? Call us directly.": "खराब नेटवर्क कनेक्शन? हमें सीधे कॉल करें।",
    "Share Your Experience": "अपना अनुभव साझा करें",
    "Upload your medical records": "अपने मेडिकल रिकॉर्ड अपलोड करें",
    "Click to upload image or PDF": "छवि या पीडीएफ अपलोड करने के लिए क्लिक करें",
    "Submit Experience": "अनुभव जमा करें",
    "Processing...": "प्रोसेसिंग...",
    "Send Message": "संदेश भेजें",
    "Thank You!": "धन्यवाद!",
    "Close": "बंद करें"
  },
  "bn-IN": {
    "Dr. Vaidhya": "ডা. বৈদ্য",
    "Home": "হোম",
    "Experience": "অভিজ্ঞতা",
    "Contact Us": "যোগাযোগ করুন",
    "Compassionate Care,": "সহানুভূতিশীল যত্ন,",
    "Healthier Future Together": "স্বাস্থ্যকর ভবিষ্যৎ একসাথে",
    "Talk with Dr. Vaidhya": "ডা. বৈদ্যের সাথে কথা বলুন",
    "Poor network connection? Call us directly.": "দুর্বল নেটওয়ার্ক সংযোগ? সরাসরি আমাদের কল করুন।",
    "Share Your Experience": "আপনার অভিজ্ঞতা শেয়ার করুন",
    "Upload your medical records": "আপনার মেডিকেল রেকর্ড আপলোড করুন",
    "Click to upload image or PDF": "ছবি বা পিডিএফ আপলোড করতে ক্লিক করুন",
    "Submit Experience": "অভিজ্ঞতা জমা দিন",
    "Processing...": "প্রক্রিয়াজাতকরণ...",
    "Send Message": "বার্তা পাঠান",
    "Thank You!": "ধন্যবাদ!",
    "Close": "বন্ধ করুন"
  },
  "gu-IN": {
    "Dr. Vaidhya": "ડૉ. વૈદ્ય",
    "Home": "હોમ",
    "Experience": "અનુભવ",
    "Contact Us": "સંપર્ક કરો",
    "Compassionate Care,": "કરુણામય સંભાળ,",
    "Healthier Future Together": "સાથે મળીને સ્વસ્થ ભવિષ્ય",
    "Talk with Dr. Vaidhya": "ડૉ. વૈદ્ય સાથે વાત કરો",
    "Poor network connection? Call us directly.": "નબળું નેટવર્ક કનેક્શન? અમને સીધા કૉલ કરો.",
    "Share Your Experience": "તમારો અનુભવ શેર કરો",
    "Upload your medical records": "તમારા મેડિકલ રેકોર્ડ અપલોડ કરો",
    "Click to upload image or PDF": "છબી અથવા PDF અપલોડ કરવા માટે ક્લિક કરો",
    "Submit Experience": "અનુભવ સબમિટ કરો",
    "Processing...": "પ્રક્રિયા કરી રહ્યું છે...",
    "Send Message": "સંદેશ મોકલો",
    "Thank You!": "આભાર!",
    "Close": "બંધ કરો"
  },
  "kn-IN": {
    "Dr. Vaidhya": "ಡಾ. ವೈದ್ಯ",
    "Home": "ಮುಖಪುಟ",
    "Experience": "ಅನುಭವ",
    "Contact Us": "ನಮ್ಮನ್ನು ಸಂಪೃಕ್ಕಿಸಿ",
    "Compassionate Care,": "ಕರುಣಾಮಯಿ ಆರೈಕೆ,",
    "Healthier Future Together": "ಒಟ್ಟಿಗೆ ಆರೋಗ್ಯಕರ ಭವಿಷ್ಯ",
    "Talk with Dr. Vaidhya": "ಡಾ. ವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಿ",
    "Poor network connection? Call us directly.": "ಕಳಪೆ ನೆಟ್‌ವರ್ಕ್ ಸಂಪೃಕ್ಕ? ನಮ್ಮನ್ನು ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ.",
    "Share Your Experience": "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
    "Upload your medical records": "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    "Click to upload image or PDF": "ಚಿತ್ರ ಅಥವಾ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    "Submit Experience": "ಅನುಭವವನ್ನು ಸಲ್ಲಿಸಿ",
    "Processing...": "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...",
    "Send Message": "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    "Thank You!": "ಧನ್ಯವಾದಗಳು!",
    "Close": "ಮುಚ್ಚಿ"
  },
  "ml-IN": {
    "Dr. Vaidhya": "ഡോ. വൈദ്യ",
    "Home": "ഹോം",
    "Experience": "അനുഭവം",
    "Contact Us": "ഞങ്ങളെ സമ്പർക്കിക്കുക",
    "Compassionate Care,": "കരുതലുള്ള പരിചരണം,",
    "Healthier Future Together": "ഒരുമിച്ച് ആരോഗ്യകരമായ ഭാവി",
    "Talk with Dr. Vaidhya": "ഡോ. വൈദ്യയുമായി സംസാരിക്കുക",
    "Poor network connection? Call us directly.": "മോശം നെറ്റ്‌വർക്ക് കണക്ഷൻ? നേരിട്ട് വിളിക്കുക.",
    "Share Your Experience": "നിങ്ങളുടെ അനുഭവം പങ്കിടുക",
    "Upload your medical records": "നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
    "Click to upload image or PDF": "ചിത്രം അല്ലെങ്കിൽ PDF അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക",
    "Submit Experience": "അനുഭവം സമർപ്പിക്കുക",
    "Processing...": "പ്രോസസ്സ് ചെയ്യുന്നു...",
    "Send Message": "സന്ദേശം അയയ്ക്കുക",
    "Thank You!": "നന്ദി!",
    "Close": "അടയ്‌ക്കുക"
  },
  "mr-IN": {
    "Dr. Vaidhya": "डॉ. वैद्य",
    "Home": "होम",
    "Experience": "अनुभव",
    "Contact Us": "संपर्क करा",
    "Compassionate Care,": "करुणामय काळजी,",
    "Healthier Future Together": "एकत्र निरोगी भविष्य",
    "Talk with Dr. Vaidhya": "डॉ. वैद्य यांच्याशी बोला",
    "Poor network connection? Call us directly.": "खराब नेटवर्क कनेक्शन? आम्हाला थेट कॉल करा.",
    "Share Your Experience": "तुमचा अनुभव शेअर करा",
    "Upload your medical records": "तुमचे वैद्यकीय रेकॉर्ड अपलोड करा",
    "Click to upload image or PDF": "प्रतिमा किंवा PDF अपलोड करण्यासाठी क्लिक करा",
    "Submit Experience": "अनुभव सबमिट करा",
    "Processing...": "प्रक्रिया करत आहे...",
    "Send Message": "संदेश पाठवा",
    "Thank You!": "धन्यवाद!",
    "Close": "बंद करा"
  },
  "od-IN": {
    "Dr. Vaidhya": "ଡା. ବୈଦ୍ୟ",
    "Home": "ହୋମ୍",
    "Experience": "ଅନୁଭୂତି",
    "Contact Us": "ଯୋଗାଯୋଗ କରନ୍ତୁ",
    "Compassionate Care,": "ସହାନୁଭୂତିପୂର୍ଣ୍ଣ ଯତ୍ନ,",
    "Healthier Future Together": "ଏକାଠି ସ୍ୱାସ୍ଥ୍ୟକର ଭବିଷ୍ୟତ",
    "Talk with Dr. Vaidhya": "ଡା. ବୈଦ୍ୟଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
    "Poor network connection? Call us directly.": "ଦୁର୍ବଳ ନେଟ୍‌ୱର୍କ ସଂଯୋଗ? ସିଧାସଳଖ ଆମକୁ କଲ୍ କରନ୍ତୁ।",
    "Share Your Experience": "ଆପଣଙ୍କର ଅନୁଭୂତି ଅଂଶୀଦାର କରନ୍ତୁ",
    "Upload your medical records": "ଆପଣଙ୍କର ମେଡିକାଲ୍ ରେକର୍ଡ ଅପଲୋଡ୍ କରନ୍ତୁ",
    "Click to upload image or PDF": "ଛବି କିମ୍ବା PDF ଅପଲୋଡ୍ କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ",
    "Submit Experience": "ଅନୁଭୂତି ଦାଖଲ କରନ୍ତୁ",
    "Processing...": "ପ୍ରକ୍ରିୟାକରଣ...",
    "Send Message": "ମେସେଜ୍ ପଠାନ୍ତୁ",
    "Thank You!": "ଧନ୍ୟବାଦ!",
    "Close": "ବନ୍ଦ କରନ୍ତୁ"
  },
  "pa-IN": {
    "Dr. Vaidhya": "ਡਾ. ਵੈਦਯ",
    "Home": "ਹੋਮ",
    "Experience": "ਅਨੁਭਵ",
    "Contact Us": "ਸੰਪਰਕ ਕਰੋ",
    "Compassionate Care,": "ਦਿਆਲੂ ਦੇਖਭਾਲ,",
    "Healthier Future Together": "ਇਕੱਠੇ ਸਿਹਤਮੰਦ ਭਵਿੱਖ",
    "Talk with Dr. Vaidhya": "ਡਾ. ਵੈਦਯ ਨਾਲ ਗੱਲ ਕਰੋ",
    "Poor network connection? Call us directly.": "ਮਾੜਾ ਨੈੱਟਵਰਕ ਕਨੈਕਸ਼ਨ? ਸਿੱਧਾ ਸਾਨੂੰ ਕਾਲ ਕਰੋ।",
    "Share Your Experience": "ਆਪਣਾ ਅਨੁਭਵ ਸਾਂਝਾ ਕਰੋ",
    "Upload your medical records": "ਆਪਣੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਅਪਲੋਡ ਕਰੋ",
    "Click to upload image or PDF": "ਚਿੱਤਰ ਜਾਂ PDF ਅਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
    "Submit Experience": "ਅਨੁਭਵ ਜਮ੍ਹਾਂ ਕਰੋ",
    "Processing...": "ਪ੍ਰੋਸੈਸਿੰਗ...",
    "Send Message": "ਸੰਦੇਸ਼ ਭੇਜੋ",
    "Thank You!": "ਧੰਨਵਾਦ!",
    "Close": "ਬੰਦ ਕਰੋ"
  },
  "ta-IN": {
    "Dr. Vaidhya": "டாக்டர் வைத்யா",
    "Home": "முகப்பு",
    "Experience": "அனுபவம்",
    "Contact Us": "தொடர்பு கொள்ளவும்",
    "Compassionate Care,": "அன்புள்ள பராமரிப்பு,",
    "Healthier Future Together": "ஒன்றாக ஆரோக்கியமான எதிர்காலம்",
    "Talk with Dr. Vaidhya": "டாக்டர் வைத்யாவுடன் பேசுங்கள்",
    "Poor network connection? Call us directly.": "மோசமான இணைப்பா? நேரடியாக அழைக்கவும்.",
    "Share Your Experience": "உங்கள் அனுபவத்தை பகிரவும்",
    "Upload your medical records": "உங்கள் மருத்துவ பதிவுகளை பதிவேற்றவும்",
    "Click to upload image or PDF": "படம் அல்லது PDF ஐ பதிவேற்ற கிளிக் செய்யவும்",
    "Submit Experience": "அனுபவத்தை சமர்ப்பிக்கவும்",
    "Processing...": "செயலாக்குகிறது...",
    "Send Message": "செய்தி அனுப்பு",
    "Thank You!": "நன்றி!",
    "Close": "மூடு"
  },
  "te-IN": {
    "Dr. Vaidhya": "డాక్టర్ వైద్య",
    "Home": "హోమ్",
    "Experience": "అనుభవం",
    "Contact Us": "మమ్మల్ని సంప్రదించండి",
    "Compassionate Care,": "కరుణాపూరిత సంరక్షణ,",
    "Healthier Future Together": "కలిసి ఆరోగ్యకరమైన భవిష్యత్తు",
    "Talk with Dr. Vaidhya": "డాక్టర్ వైద్యతో మాట్లాడండి",
    "Poor network connection? Call us directly.": "బలహీనమైన నెట్‌వర్క్ కనెక్షన్? నేరుగా కాల్ చేయండి.",
    "Share Your Experience": "మీ అనుభవాన్ని పంచుకోండి",
    "Upload your medical records": "మీ వైద్య రికార్డులను అప్‌లోడ్ చేయండి",
    "Click to upload image or PDF": "చిత్రాన్ని లేదా PDF ని అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి",
    "Submit Experience": "అనుభవాన్ని సమర్పించండి",
    "Processing...": "ప్రాసెస్ చేస్తోంది...",
    "Send Message": "సందేశం పంపండి",
    "Thank You!": "ధన్యవాదాలు!",
    "Close": "మూసివేయండి"
  }
};

export const LanguageProvider = ({ children }) => {
  // Get stored language or default to English
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'en-IN'
  );
  
  // Cache for translated text to avoid re-translating
  const [translationCache, setTranslationCache] = useState({});
  
  // Flag to track if API is rate limited
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  // Reset rate limited status when language changes
  useEffect(() => {
    setIsRateLimited(false);
  }, [currentLanguage]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  // Get translation from fallback dictionary
  const getFallbackTranslation = (text, targetLanguage) => {
    if (targetLanguage === 'en-IN') return text;
    
    const languageFallbacks = fallbackTranslations[targetLanguage];
    if (!languageFallbacks) return text;
    
    return languageFallbacks[text] || text;
  };

  // Real API call to Sarvam API translation with fallback
  const translateText = async (text, targetLanguage) => {
    // English is the default language, no need to translate
    if (targetLanguage === 'en-IN') {
      return text;
    }
    
    // Check if translation is in cache
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    // If we're rate limited, use fallback translations
    if (isRateLimited) {
      const fallbackText = getFallbackTranslation(text, targetLanguage);
      
      // Cache the fallback result
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: fallbackText
      }));
      
      return fallbackText;
    }
    
    // Check for common phrases in our fallback dictionary
    const fallbackText = getFallbackTranslation(text, targetLanguage);
    if (fallbackText !== text) {
      // We found a translation in our fallbacks
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: fallbackText
      }));
      
      return fallbackText;
    }
    
    try {
      const response = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: targetLanguage,
          mode: 'formal'
        })
      });
      
      // Handle rate limiting (429 error)
      if (response.status === 429) {
        console.warn('Translation API rate limited. Using fallback translations.');
        setIsRateLimited(true);
        
        // Use fallback translation
        const fallbackText = getFallbackTranslation(text, targetLanguage);
        
        // Cache the fallback result
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: fallbackText
        }));
        
        return fallbackText;
      }
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: data.translated_text
      }));
      
      return data.translated_text;
    } catch (error) {
      console.error('Translation error:', error);
      
      // On error, use fallback translation
      const fallbackText = getFallbackTranslation(text, targetLanguage);
      
      // Cache the fallback result
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: fallbackText
      }));
      
      return fallbackText;
    }
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translateText,
    languages,
    isRateLimited
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 