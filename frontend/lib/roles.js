export const ROLE_STYLE = {
  admin: {
    badge: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200/60',
    gradient: 'from-purple-600 to-violet-600',
    chip: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
  },
  consultant: {
    badge: 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200/60',
    gradient: 'from-indigo-600 to-blue-600',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  client: {
    badge: 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200/60',
    gradient: 'from-teal-600 to-emerald-600',
    chip: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'text-teal-600',
  },
};

export const ROLE_LABEL = {
  admin: 'Admin',
  consultant: 'Consultant',
  client: 'Client',
};

export function getRoleStyle(role) {
  return ROLE_STYLE[role] || ROLE_STYLE.client;
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}