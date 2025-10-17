"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getMaterials } from '@/lib/firebase/firestore';

export function FirebaseTest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('Testing...');

  useEffect(() => {
    const testFirebase = async () => {
      if (!user) {
        setTestResult('No user authenticated');
        return;
      }

      try {
        console.log('Testing Firebase with user:', user.uid);
        const materials = await getMaterials(user.uid);
        setTestResult(`Success! Found ${materials.length} materials`);
      } catch (error) {
        console.error('Firebase test error:', error);
        setTestResult(`Error: ${error}`);
      }
    };

    testFirebase();
  }, [user]);

  return (
    <div className="p-4 border rounded">
      <h3>Firebase Connection Test</h3>
      <p>User: {user ? user.email : 'Not logged in'}</p>
      <p>Result: {testResult}</p>
    </div>
  );
}