// // context/LanguageContext.js
// import React, { createContext, useState, useContext } from 'react';
// import i18n from '../utils/i18n';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState(i18n.language);

//   const toggleLanguage = () => {
//     const newLang = i18n.language === 'fr' ? 'en' : 'fr';
//     i18n.changeLanguage(newLang);
//     setLanguage(newLang); // force re-render
//   };

//   return (
//     <LanguageContext.Provider value={{ language, toggleLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);
