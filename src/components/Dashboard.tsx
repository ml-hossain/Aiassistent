import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { JsonInput } from './JsonInput';
import { TableCellsIcon, PlusIcon } from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              JSON Data Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Easily store, search, and manage your JSON data in Firestore. 
              Add new records and view them in a beautiful, searchable table.
            </p>
            
            {/* Navigation Cards */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <PlusIcon className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Add JSON Data</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Input and validate JSON data to store in Firestore</p>
              </div>
              
              <Link to="/data" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow block">
                <div className="flex items-center space-x-3 mb-3">
                  <TableCellsIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">View Data Table</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Browse and search your stored JSON data in table format</p>
                <div className="text-blue-600 font-medium">View Data →</div>
              </Link>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <JsonInput />
          </div>
        </div>
      </main>
    </div>
  );
};
