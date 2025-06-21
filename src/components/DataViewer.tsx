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
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const DataViewer: React.FC = () => {
  const [records, setRecords] = useState<JsonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<JsonRecord | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('Setting up Firestore listener for user:', user.uid);

    try {
      const q = query(
        collection(db, 'jsonRecords'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log('Firestore snapshot received:', querySnapshot.size, 'documents');
          const recordsData: JsonRecord[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Document data:', data);
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
        },
        (error) => {
          console.error('Firestore error:', error);
          toast.error('Error loading data: ' + error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error: any) {
      console.error('Error setting up Firestore listener:', error);
      toast.error('Error setting up data listener: ' + error.message);
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteDoc(doc(db, 'jsonRecords', id));
      toast.success('Record deleted successfully');
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting record: ' + error.message);
    }
  };

  const filteredRecords = records.filter((record) => {
    const jsonString = JSON.stringify(record.data).toLowerCase();
    return jsonString.includes(searchTerm.toLowerCase());
  });

  const getFieldsFromRecord = (data: any): string[] => {
    if (typeof data !== 'object' || data === null) return [];
    return Object.keys(data);
  };

  const getAllFields = (): string[] => {
    const fieldsSet = new Set<string>();
    filteredRecords.forEach(record => {
      getFieldsFromRecord(record.data).forEach(field => fieldsSet.add(field));
    });
    return Array.from(fieldsSet);
  };

  const getFieldValue = (record: JsonRecord, field: string): string => {
    const value = record.data[field];
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Loading data...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view data</h2>
          <Link to="/" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const allFields = getAllFields();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <TableCellsIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Data Viewer</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredRecords.length} records found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in JSON data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Data Table */}
        {filteredRecords.length === 0 ? (
          <div className="card text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search term.' : 'Start by adding some JSON data from the dashboard.'}
            </p>
            <div className="mt-6">
              <Link to="/dashboard" className="btn-primary">
                Add JSON Data
              </Link>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {allFields.map(field => (
                      <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {field}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{format(record.createdAt, 'MMM dd, HH:mm')}</span>
                        </div>
                      </td>
                      {allFields.map(field => (
                        <td key={field} className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">
                            {getFieldValue(record, field)}
                          </div>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono border">
                  {JSON.stringify(selectedRecord.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
