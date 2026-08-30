export const PASSWORD_RULES = {
  minLength: { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  hasLetter: { test: (p) => /[A-Za-z]/.test(p), label: 'Contains a letter' },
  hasNumber: { test: (p) => /\d/.test(p), label: 'Contains a number' },
  hasSpecial: {
    test: (p) => /[@$!%*#?&^~\-_=+\[\]{}|;:'",.<>\/\\`]/.test(p),
    label: 'Contains a special character',
  },
};

export function getPasswordErrors(password) {
  const errors = [];
  for (const [, rule] of Object.entries(PASSWORD_RULES)) {
    if (!rule.test(password)) errors.push(rule.label);
  }
  return errors;
}

export function isPasswordValid(password) {
  return Object.values(PASSWORD_RULES).every((rule) => rule.test(password));
}
