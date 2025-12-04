'use client';

interface DomainInfoProps {
  domain: string;
}

export default function DomainInfo({ domain }: DomainInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-gray-400 text-sm">Domain</p>
        <p className="font-mono text-sm">{domain}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm">Status</p>
        <p className="text-green-400 text-sm">Active</p>
      </div>
    </div>
  );
}
