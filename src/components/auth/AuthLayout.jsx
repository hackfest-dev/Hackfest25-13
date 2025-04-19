import React from 'react';
import { Outlet } from 'react-router-dom';
import LanguageSelector from '../ui/LanguageSelector';

const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-photo/accompaniment-abortion-process_23-2149656077.jpg?t=st=1745056277~exp=1745059877~hmac=29b4f6687daf0c20a55ff3f47e23462ee9a62e869dcd93855f423b824e295e53&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 