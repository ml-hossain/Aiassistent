import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const JsonInput: React.FC = () => {
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText.trim()) {
      toast.error('Please enter some JSON data');
      return;
    }

    try {
      setLoading(true);
      const parsedData = JSON.parse(jsonText);
      
      if (Array.isArray(parsedData)) {
        // Handle array of objects - save each as a separate document
        if (parsedData.length === 0) {
          toast.error('Array is empty');
          return;
        }

        const collectionRef = collection(db, 'jsonRecords');
        
        // Save each document individually
        const savePromises = parsedData.map(item => 
          addDoc(collectionRef, {
            data: item,
            userId: user?.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        );

        await Promise.all(savePromises);
        toast.success(`Successfully saved ${parsedData.length} records to Firestore!`);
      } else {
        // Handle single object
        await addDoc(collection(db, 'jsonRecords'), {
          data: parsedData,
          userId: user?.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success('JSON data saved successfully!');
      }

      setJsonText('');
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format. Please check your syntax.');
      } else {
        console.error('Error saving data:', error);
        toast.error('Error saving data: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      toast.success('JSON formatted successfully!');
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  const loadSampleData = () => {
    const sampleData = [
      {
        name: "Computer Science",
        level: "Bachelor",
        duration: "4 years",
        credits: 120,
        department: "Engineering",
        isActive: true
      },
      {
        name: "Business Administration", 
        level: "Master",
        duration: "2 years",
        credits: 60,
        department: "Business",
        isActive: true
      },
      {
        name: "Data Science",
        level: "Bachelor", 
        duration: "4 years",
        credits: 128,
        department: "Engineering",
        isActive: false
      }
    ];
    setJsonText(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Add JSON Data</h2>
        </div>
        <button
          type="button"
          onClick={loadSampleData}
          className="btn-secondary text-sm"
        >
          Load Sample Array
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
            JSON Data (supports single objects or arrays)
          </label>
          <textarea
            id="jsonInput"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="input-field font-mono text-sm"
            rows={12}
            placeholder="Enter your JSON data here... (single object or array of objects)"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || !jsonText.trim()}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save to Database'}</span>
          </button>
          
          <button
            type="button"
            onClick={formatJson}
            disabled={!jsonText.trim()}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Format JSON
          </button>
        </div>
      </form>
    </div>
  );
};
