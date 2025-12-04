// lib/types.ts
export interface ScanOptions {
  engines?: string[];
  ports?: number[];
  threads?: number;
  enableBruteforce?: boolean;
  verbose?: boolean;
  saveFull?: boolean;
}

export interface SubdomainInfo {
  subdomain: string;
  ip_addresses: string[];
  cname?: string;
  ports?: number[];
  discovered_at?: Date;
}

export interface ScanResult {
  id?: string;
  scanId?: string;
  scan_id?: string;
  domain: string;
  subdomains: SubdomainInfo[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at?: Date;
  createdAt?: Date;
  completed_at?: Date;
  completedAt?: Date;
  scan_options?: ScanOptions;
  scanOptions?: ScanOptions;
  subdomain_count?: number;
  subdomainCount?: number;
}

export interface DomainInfo {
  registrar?: string;
  creation_date?: string;
  expiration_date?: string;
  name_servers?: string[];
  status?: string[];
}

export interface BatchScanResult {
  domain: string;
  scan_id: string;
  status: string;
}
