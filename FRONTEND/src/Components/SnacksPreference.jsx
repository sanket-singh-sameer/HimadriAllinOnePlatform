import React, { useState, useEffect } from 'react';
import { API_PATHS } from '../../Utils/apiPaths';
import axiosInstance from '../../Utils/axiosInstance';
import { toast } from 'react-toastify';

const SnacksPreference = () => {
  const [optedForSnacks, setOptedForSnacks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchSnacksPreference = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.GET_MY_SNACKS_PREFERENCE);
      setOptedForSnacks(response.data.optedForSnacks);
    } catch (error) {
      console.error('Error fetching snacks preference:', error);
      toast.error('Failed to load your snacks preference');
    } finally {
      setLoading(false);
    }
  };

  const updateSnacksPreference = async (newPreference) => {
    try {
      setUpdating(true);
      const response = await axiosInstance.put(API_PATHS.UPDATE_MY_SNACKS_PREFERENCE, {
        optedForSnacks: newPreference
      });
      
      setOptedForSnacks(response.data.optedForSnacks);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating snacks preference:', error);
      toast.error('Failed to update your snacks preference');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSnacksPreference();
  }, []);

  const handleToggle = () => {
    const newPreference = !optedForSnacks;
    updateSnacksPreference(newPreference);
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Snacks Preference</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggle}
            disabled={updating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              optedForSnacks ? 'bg-blue-600' : 'bg-gray-200'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`${
                optedForSnacks ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          
          <div>
            <p className="font-medium text-gray-900">
              {optedForSnacks ? 'Opted for Snacks' : 'Not Opted for Snacks'}
            </p>
            <p className="text-sm text-gray-500">
              {optedForSnacks 
                ? 'You will receive snacks during snack time' 
                : 'You will not receive snacks during snack time'
              }
            </p>
          </div>
        </div>

        {updating && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Updating...</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> You can change your snacks preference anytime. Changes will be reflected immediately.
        </p>
      </div>
    </div>
  );
};

export default SnacksPreference;
