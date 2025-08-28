import React, { useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    category: '',
    rating: 5,
    message: '',
    suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    'General Experience',
    'User Interface',
    'Performance',
    'Features',
    'Bug Report',
    'Feature Request',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // You can replace this with your actual API endpoint
      const response = await axiosInstance.post('/feedback', feedback);
      console.log('Feedback submitted:', response.data);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFeedback({
          name: '',
          email: '',
          category: '',
          rating: 5,
          message: '',
          suggestions: ''
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700">
            Your feedback has been submitted successfully. We appreciate your input in helping us improve the Himadri Boys Hostel platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Feedback</h2>
        <p className="text-gray-600 leading-relaxed">
          Your feedback is invaluable to us! As a platform built by students for students, we continuously strive to improve the Himadri Boys Hostel experience. Whether you've discovered a bug, have ideas for new features, or simply want to share your thoughts about the platform, we'd love to hear from you. Your input helps us make hostel life simpler, smarter, and more connected for everyone.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={feedback.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={feedback.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Feedback Category
          </label>
          <select
            id="category"
            name="category"
            value={feedback.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={feedback.rating}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 min-w-fit">
              {feedback.rating}/5 ⭐
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="message"
            name="message"
            value={feedback.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts, experiences, or report any issues you've encountered..."
          />
        </div>

        <div>
          <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 mb-2">
            Suggestions for Improvement (Optional)
          </label>
          <textarea
            id="suggestions"
            name="suggestions"
            value={feedback.suggestions}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any ideas or suggestions to make the platform better?"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Your feedback helps us improve the platform for all hostel residents. 
          We review every submission and use your input to prioritize updates and new features. 
          Thank you for being part of our continuous improvement journey!
        </p>
      </div>
    </div>
  );
}
