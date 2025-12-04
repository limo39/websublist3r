'use client';

interface HistoryListProps {
  limit?: number;
}

export default function HistoryList({ limit = 5 }: HistoryListProps) {
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-sm">No scan history yet</p>
    </div>
  );
}
