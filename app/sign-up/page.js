'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setUserPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError) {
      return; // Don't submit if there are password errors
    }
    console.log('User Email:', userEmail);
    console.log('User Password:', userPassword);
    console.log('User Name:', userName);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Sign Up</h1>
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-green-800 shadow-sm focus:border-green-800 focus:ring-green-800"
                required
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-green-800 shadow-sm focus:border-green-800 focus:ring-green-800"
                required
              />
            </div>

            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="userPassword"
                value={userPassword}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full rounded-md border-2 ${
                  passwordError ? 'border-red-500' : 'border-green-800'
                } shadow-sm focus:border-green-800 focus:ring-green-800`}
                required
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?&quot;:{}|<>])[A-Za-z\d!@#$%^&*(),.?&quot;:{}|<>]{8,}$"
                title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Password must contain:
                <ul className="list-disc list-inside">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)</li>
                </ul>
              </p>
            </div>

            <button
              type="submit"
              disabled={!!passwordError}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                passwordError 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              Submit
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/log-in" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
