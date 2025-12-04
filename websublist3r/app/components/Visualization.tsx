'use client';

import { SubdomainInfo } from '@/lib/types';

interface VisualizationProps {
  subdomains: SubdomainInfo[];
}

export default function Visualization({ subdomains }: VisualizationProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
      <div className="text-center">
        <p className="text-gray-300 mb-2">Subdomain Graph</p>
        <p className="text-gray-400 text-sm">{subdomains.length} subdomains found</p>
      </div>
    </div>
  );
}
