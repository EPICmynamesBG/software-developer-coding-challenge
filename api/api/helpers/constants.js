const ROLES = {
  STANDARD: 'standard',
  ADMIN: 'admin'
};

const ROLE_HEIRARCHY = {
  ADMIN: [ROLES.ADMIN, ROLES.STANDARD],
  STANDARD: [ROLES.STANDARD]
};

const UUID = '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

const YEAR = '^[0-9]{4}$';

const VIN = '^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$'

module.exports = {
  ROLES,
  ROLE_HEIRARCHY,
  UUID,
  YEAR,
  VIN
};
