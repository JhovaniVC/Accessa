const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUARD: 'guard',
  RESIDENT: 'resident'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.USER]: ['read', 'create'],
  [ROLES.GUARD]: ['read', 'update'],
  [ROLES.RESIDENT]: ['read', 'create', 'update']
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS
};
