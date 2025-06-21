import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">JSON Firestore Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <UserCircleIcon className="h-5 w-5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
