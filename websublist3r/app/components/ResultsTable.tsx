'use client';

import { SubdomainInfo } from '@/lib/types';

interface ResultsTableProps {
  subdomains: SubdomainInfo[];
}

export default function ResultsTable({ subdomains }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="text-left py-3 px-4">Subdomain</th>
            <th className="text-left py-3 px-4">IP Address</th>
            <th className="text-left py-3 px-4">CNAME</th>
          </tr>
        </thead>
        <tbody>
          {subdomains.map((sub, idx) => (
            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="py-3 px-4">{sub.subdomain}</td>
              <td className="py-3 px-4">{sub.ip_addresses?.join(', ') || 'N/A'}</td>
              <td className="py-3 px-4">{sub.cname || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
