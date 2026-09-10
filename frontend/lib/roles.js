export const ROLE_STYLE = {
  admin: {
    badge: 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200/60',
    gradient: 'from-teal-600 to-emerald-600',
    chip: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'text-teal-600',
  },
  consultant: {
    badge: 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200/60',
    gradient: 'from-teal-600 to-emerald-600',
    chip: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'text-teal-600',
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