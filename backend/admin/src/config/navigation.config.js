// Menu items available to each role
export const roleNavItems = {
  superadmin: [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  admin: [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  editor: [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  viewer: [
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
  ],
};

export const getNavItems = (role) => {
  return roleNavItems[role?.toLowerCase()] || roleNavItems.viewer;
};

export const canAccessTab = (role, tabId) => {
  const items = getNavItems(role);
  return items.some(item => item.id === tabId);
};