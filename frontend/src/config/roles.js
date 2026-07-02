export const ROLE_PERMISSIONS = {
  'Super Admin': ['vendors:create', 'vendors:view', 'billing:view', 'dashboard:view'],
  'Billing Admin': ['vendors:view', 'billing:manage', 'billing:view', 'dashboard:view'],
  'Read Only Admin': ['vendors:view', 'billing:view', 'dashboard:view'],
}

export const hasPermission = (role, permission) => {
  if (!role) {
    return false
  }

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}