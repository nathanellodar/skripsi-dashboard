export const MOCK_USER = {
  id: 1,
  name: 'Admin Security',
  email: 'admin@gateway.local',
  role: 'Administrator',
  avatar: 'https://ui-avatars.com/api/?name=Admin+Security&background=10b981&color=fff'
};

export const MOCK_STATS = {
  totalDevices: 124,
  activeConnections: 1042,
  threatsBlocked: 34,
  systemUptime: '99.98%'
};

export const MOCK_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2026-05-04T05:50:12Z',
    sourceIp: '192.168.1.105',
    destinationIp: '10.0.0.5',
    action: 'BLOCKED',
    severity: 'high',
    protocol: 'TCP',
    description: 'Suspicious payload detected on port 22'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-05-04T05:45:00Z',
    sourceIp: '192.168.1.50',
    destinationIp: '8.8.8.8',
    action: 'ALLOWED',
    severity: 'info',
    protocol: 'UDP',
    description: 'DNS query resolved'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-05-04T05:30:22Z',
    sourceIp: '192.168.1.110',
    destinationIp: '172.16.0.4',
    action: 'FLAGGED',
    severity: 'warning',
    protocol: 'HTTP',
    description: 'Unusual data transfer volume'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-05-04T05:15:10Z',
    sourceIp: '192.168.1.22',
    destinationIp: '10.0.0.10',
    action: 'ALLOWED',
    severity: 'info',
    protocol: 'HTTPS',
    description: 'Secure connection established'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-05-04T04:50:05Z',
    sourceIp: '192.168.1.200',
    destinationIp: '10.0.0.1',
    action: 'BLOCKED',
    severity: 'high',
    protocol: 'ICMP',
    description: 'Ping flood detected'
  }
];
