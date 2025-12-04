'use client';

import { useState } from 'react';

interface ScanFormProps {
  onScanStart: (domain: string, options: any) => void;
  disabled?: boolean;
}

export default function ScanForm({ onScanStart, disabled }: ScanFormProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onScanStart(domain, {});
      setDomain('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter domain (e.g., example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
      >
        {disabled ? 'Scanning...' : 'Start Scan'}
      </button>
    </form>
  );
}
