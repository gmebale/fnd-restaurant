/**
 * Permission definitions for each role
 */

const CLIENT_PERMISSIONS = {
  'products:read': true,
  'products:view-details': true,
  'cart:create': true,
  'cart:read': true,
  'cart:update': true,
  'cart:delete': true,
  'orders:create': true,
  'orders:read-own': true,
  'orders:cancel-own': true,
  'orders:track-own': true,
  'favorites:create': true,
  'favorites:read': true,
  'favorites:delete': true,
  'reviews:create': true,
  'reviews:read': true,
  'reviews:update-own': true,
  'reviews:delete-own': true,
  'profile:read': true,
  'profile:update': true,
  'chat:send': true,
  'chat:read-own': true,
  'loyalty:read': true,
  'loyalty:redeem': true,
  'notifications:read': true,
  'notifications:mark-read': true,
};

const CUISINIER_PERMISSIONS = {
  ...CLIENT_PERMISSIONS,
  'orders:read-all': true,
  'orders:update-status': true,
  'orders:view-kitchen': true,
  'products:read': true,
  'products:update-availability': true,
  'chat:read-order': true,
  'chat:send-order': true,
};

const LIVREUR_PERMISSIONS = {
  ...CLIENT_PERMISSIONS,
  'orders:read-ready': true,
  'orders:update-status': true,
  'orders:view-delivery': true,
  'orders:update-location': true,
  'chat:read-order': true,
  'chat:send-order': true,
};

const ADMIN_PERMISSIONS = {
  ...CUISINIER_PERMISSIONS,
  ...LIVREUR_PERMISSIONS,
  'products:create': true,
  'products:update': true,
  'products:delete': true,
  'orders:read-all': true,
  'orders:update-all': true,
  'orders:cancel-any': true,
  'orders:view-stats': true,
  'promos:create': true,
  'promos:read': true,
  'promos:update': true,
  'promos:delete': true,
  'reviews:read-all': true,
  'reviews:delete-any': true,
  'reviews:respond': true,
  'users:read': true,
  'users:update': true,
  'stats:dashboard': true,
  'stats:reports': true,
  'stats:export': true,
  'chat:read-all': true,
  'chat:send-any': true,
  'tickets:read': true,
  'tickets:update': true,
  'tickets:close': true,
};

const SUPER_ADMIN_PERMISSIONS = {
  ...ADMIN_PERMISSIONS,
  'users:create': true,
  'users:delete': true,
  'users:assign-role': true,
  'users:manage-permissions': true,
  'system:settings': true,
  'system:backup': true,
  'system:logs': true,
  'roles:create': true,
  'roles:update': true,
  'roles:delete': true,
  '*': true, // All permissions
};

/**
 * Get permissions for a role
 */
const getPermissions = (role) => {
  switch (role) {
    case 'CLIENT':
      return CLIENT_PERMISSIONS;
    case 'CUISINIER':
      return CUISINIER_PERMISSIONS;
    case 'LIVREUR':
      return LIVREUR_PERMISSIONS;
    case 'ADMIN':
      return ADMIN_PERMISSIONS;
    case 'SUPER_ADMIN':
      return SUPER_ADMIN_PERMISSIONS;
    default:
      return {};
  }
};

/**
 * Check if user has permission
 */
const hasPermission = (userRole, permission) => {
  const permissions = getPermissions(userRole);
  return permissions[permission] === true || permissions['*'] === true;
};

module.exports = {
  getPermissions,
  hasPermission,
  CLIENT_PERMISSIONS,
  CUISINIER_PERMISSIONS,
  LIVREUR_PERMISSIONS,
  ADMIN_PERMISSIONS,
  SUPER_ADMIN_PERMISSIONS,
};

