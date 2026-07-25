export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  extendedDesc: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  status: 'online' | 'classified' | 'under-development';
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillNode {
  name: string;
  level: number; // 0 to 100
  class: string; // e.g. "Frontend", "Backend", "Protocols"
  status: 'DECRYPTED' | 'ENCRYPTED';
  diagnosticCode: string;
}

export interface TerminalLine {
  text: string;
  type: 'system' | 'input' | 'success' | 'warn' | 'error';
  timestamp: string;
}
