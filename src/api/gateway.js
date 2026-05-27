const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || 'API Error');
  }
  return res.json();
};

export const checkSetup = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/check-setup`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.need_setup === true;
  } catch (e) {
    return false;
  }
};

export const setupUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/users/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res);
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await handleResponse(res);
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  return data;
};

export const logout = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getHeaders()
  });
  localStorage.removeItem('access_token');
  return handleResponse(res);
};

export const fetchLogs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/logs${query ? '?' + query : ''}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const fetchStatsSummary = async () => {
  const res = await fetch(`${API_BASE}/stats/summary`, { headers: getHeaders() });
  return handleResponse(res);
};



export const fetchOpenPorts = async () => {
  const res = await fetch(`${API_BASE}/ports/open-ports`, { headers: getHeaders() });
  return handleResponse(res);
};

export const enablePort = async (port, protocol = 'tcp') => {
  const res = await fetch(`${API_BASE}/ports/enable`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ port, protocol })
  });
  return handleResponse(res);
};

export const disablePort = async (port, protocol = 'tcp') => {
  const res = await fetch(`${API_BASE}/ports/disable`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ port, protocol })
  });
  return handleResponse(res);
};

export const fetchNotifHistory = async (limit = 20) => {
  const res = await fetch(`${API_BASE}/notif/history?limit=${limit}`, { headers: getHeaders() });
  return handleResponse(res);
};

// ─── Services (Sinkronisasi Port) ───

export const fetchServicePorts = async () => {
  const res = await fetch(`${API_BASE}/services/ports`, { headers: getHeaders() });
  return handleResponse(res);
};

export const syncServicePorts = async () => {
  const res = await fetch(`${API_BASE}/services/sync`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(res);
};

export const fetchServiceChanges = async (limit = 50) => {
  const query = limit ? `?limit=${limit}` : '';
  const res = await fetch(`${API_BASE}/services/changes${query}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const fetchDevice = async () => {
  const res = await fetch(`${API_BASE}/device`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateDevice = async (deviceData) => {
  const res = await fetch(`${API_BASE}/device`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(deviceData)
  });
  return handleResponse(res);
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/users/me`, { headers: getHeaders() });
  return handleResponse(res);
};

export const changePassword = async (old_password, new_password) => {
  const res = await fetch(`${API_BASE}/users/change-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ old_password, new_password })
  });
  return handleResponse(res);
};

// ─── WebSocket: Alert Log Stream (/logs/ws) ───
let ws = null;
export const connectLogStream = ({ onMessage, onOpen, onClose }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  
  if (ws) {
    ws.close();
  }
  
  ws = new WebSocket(`${WS_BASE}/logs/ws?token=${token}`);
  
  ws.onopen = () => {
    if (onOpen) onOpen();
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'ping') return;
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error('Failed to parse WebSocket message', err);
    }
  };
  
  ws.onerror = (e) => console.error('WebSocket Error:', e);
  
  ws.onclose = () => {
    console.log('WebSocket Closed');
    if (onClose) onClose();
  };
};

export const disconnectLogStream = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

// ─── WebSocket: Terminal Stream (/logs/terminal/ws) ───
let terminalWs = null;
export const connectTerminalStream = ({ onMessage, onOpen, onClose }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  if (terminalWs) {
    terminalWs.close();
  }

  terminalWs = new WebSocket(`${WS_BASE}/logs/terminal/ws?token=${token}`);

  terminalWs.onopen = () => {
    if (onOpen) onOpen();
  };

  terminalWs.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'ping') return;
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error('Failed to parse terminal WebSocket message', err);
    }
  };

  terminalWs.onerror = (e) => console.error('Terminal WebSocket Error:', e);

  terminalWs.onclose = () => {
    console.log('Terminal WebSocket Closed');
    if (onClose) onClose();
  };
};

export const disconnectTerminalStream = () => {
  if (terminalWs) {
    terminalWs.close();
    terminalWs = null;
  }
};
