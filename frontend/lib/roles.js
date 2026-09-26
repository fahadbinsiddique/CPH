// Role accents follow design-system/mentalhealthapp/MASTER.md:
// primary violet -> accent wellness green, black on-color text (4.5:1+).
export const ROLE_STYLE = {
  admin: {
    badge: 'bg-primary/10 text-foreground border-primary/20',
    gradient: 'from-primary to-accent',
    chip: 'bg-primary/10 text-foreground border-primary/20',
    iconColor: 'text-primary',
  },
  consultant: {
    badge: 'bg-primary/10 text-foreground border-primary/20',
    gradient: 'from-primary to-accent',
    chip: 'bg-primary/10 text-foreground border-primary/20',
    iconColor: 'text-primary',
  },
  client: {
    badge: 'bg-primary/10 text-foreground border-primary/20',
    gradient: 'from-primary to-accent',
    chip: 'bg-primary/10 text-foreground border-primary/20',
    iconColor: 'text-primary',
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