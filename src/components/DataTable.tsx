import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { JsonRecord } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  TrashIcon, 
  EyeIcon,
  TableCellsIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

export const DataTable: React.FC = () => {
  const [records, setRecords] = useState<JsonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<JsonRecord | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'jsonRecords'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recordsData: JsonRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recordsData.push({
          id: doc.id,
          data: data.data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          userId: data.userId,
        });
      });
      setRecords(recordsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteDoc(doc(db, 'jsonRecords', id));
      toast.success('Record deleted successfully');
    } catch (error: any) {
      toast.error('Error deleting record: ' + error.message);
    }
  };

  const filteredRecords = records.filter((record) => {
    const jsonString = JSON.stringify(record.data).toLowerCase();
    return jsonString.includes(searchTerm.toLowerCase());
  });

  const renderJsonPreview = (data: any) => {
    const preview = JSON.stringify(data, null, 2);
    return preview.length > 100 ? preview.substring(0, 100) + '...' : preview;
  };

  if (loading) {
    return (
      <div className="card animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TableCellsIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Stored Data</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredRecords.length} records
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search in JSON data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Records */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search term.' : 'Start by adding some JSON data above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {format(record.createdAt, 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded font-mono overflow-x-auto">
                    {renderJsonPreview(record.data)}
                  </pre>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View full data"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing full JSON */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">JSON Data Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Created: {format(selectedRecord.createdAt, 'MMM dd, yyyy HH:mm:ss')}
                </p>
              </div>
              <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono">
                {JSON.stringify(selectedRecord.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
