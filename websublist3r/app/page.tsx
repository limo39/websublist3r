// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScanForm from '@/components/ScanForm';
import ResultsTable from '@/components/ResultsTable';
import Visualization from '@/components/Visualization';
import ProgressBar from '@/components/ProgressBar';
import HistoryList from '@/components/HistoryList';
import DomainInfo from '@/components/DomainInfo';
import { ScanResult } from '@/lib/types';

export default function Home() {
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'results' | 'visualization' | 'history'>('results');
  const router = useRouter();

  const handleScanStart = async (domain: string, options: any) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);
    setActiveTab('results');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, options })
      });

      const data = await response.json();

      if (response.ok) {
        setScanResults({
          ...data,
          subdomains: [],
          status: 'running'
        });

        alert('Scan started!');
        
        // Start polling for results
        pollScanStatus(data.scanId);
      } else {
        throw new Error(data.error || 'Failed to start scan');
      }
    } catch (error) {
      setIsScanning(false);
      alert(error instanceof Error ? error.message : 'Failed to start scan');
    }
  };

  const pollScanStatus = async (scanId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/scan/${scanId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          setIsScanning(false);
          setScanResults(data);
          alert('Scan completed!');
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setIsScanning(false);
          alert('Scan failed');
        } else {
          setScanProgress(prev => Math.min(prev + 10, 90));
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
  };

  const exportResults = async (format: 'json' | 'csv' | 'txt') => {
    if (!scanResults) return;

    try {
      const response = await fetch(`/api/scan/${scanResults.scanId}/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sublist3r_${scanResults.domain}_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Sublist3r Web
                </h1>
                <p className="text-gray-400 text-sm">Advanced Subdomain Enumeration Tool</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'results' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <span>🔍</span>
                <span>Scan</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <span>📜</span>
                <span>History</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <span>🌐</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Domains Scanned</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <span>⚡</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Subdomains Found</p>
                    <p className="text-2xl font-bold">45,678</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <span>⏱️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Scan Time</p>
                    <p className="text-2xl font-bold">2.4s</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <span>📊</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold">98.7%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Form */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Start New Scan</h2>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-green-400">System Ready</span>
                </div>
              </div>
              
              <ScanForm onScanStart={handleScanStart} disabled={isScanning} />
            </div>

            {/* Progress Bar */}
            {isScanning && (
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Scanning {scanResults?.domain}</span>
                    <span className="text-blue-400">{scanProgress}%</span>
                  </div>
                  <ProgressBar progress={scanProgress} />
                </div>
                <div className="text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span>Enumerating subdomains...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Results/Visualization Tabs */}
            {scanResults && (
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="flex border-b border-gray-700 mb-6">
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 font-medium ${activeTab === 'results' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Results ({scanResults.subdomainCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('visualization')}
                    className={`px-4 py-2 font-medium ${activeTab === 'visualization' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Visualization
                  </button>
                </div>

                {activeTab === 'results' && scanResults.subdomains.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Discovered Subdomains</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => exportResults('txt')}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <span>⬇️</span>
                          <span>TXT</span>
                        </button>
                        <button
                          onClick={() => exportResults('csv')}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <span>⬇️</span>
                          <span>CSV</span>
                        </button>
                        <button
                          onClick={() => exportResults('json')}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <span>⬇️</span>
                          <span>JSON</span>
                        </button>
                      </div>
                    </div>
                    <ResultsTable subdomains={scanResults.subdomains} />
                  </div>
                )}

                {activeTab === 'visualization' && (
                  <div className="h-[400px]">
                    <Visualization subdomains={scanResults.subdomains} />
                  </div>
                )}

                {activeTab === 'results' && scanResults.subdomains.length === 0 && !isScanning && (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-gray-700 rounded-full mb-4">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Results Yet</h3>
                    <p className="text-gray-400">Start a scan to discover subdomains</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Domain Information */}
            {scanResults && (
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Domain Information</h3>
                <DomainInfo domain={scanResults.domain} />
              </div>
            )}

            {/* Recent History */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Scans</h3>
                <button
                  onClick={() => router.push('/history')}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View All
                </button>
              </div>
              <HistoryList limit={5} />
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigator.clipboard.writeText(scanResults?.domain || '')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span>Copy Domain</span>
                  <span className="text-xs text-gray-400">Ctrl+C</span>
                </button>
                <button
                  onClick={() => scanResults && exportResults('json')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span>Export Results</span>
                  <span className="text-xs text-gray-400">JSON</span>
                </button>
                <button
                  onClick={() => router.push('/api/scan')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span>API Documentation</span>
                  <span className="text-xs text-gray-400">REST</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Database</span>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Sublist3r Engine</span>
                    <span className="text-sm text-green-400">Ready</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Rate Limit</span>
                    <span className="text-sm text-yellow-400">5/10</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                Sublist3r Web &copy; {new Date().getFullYear()} - Advanced Subdomain Enumeration
              </p>
              <p className="text-gray-500 text-sm">
                Use responsibly. Only scan domains you own or have permission to test.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}