// ----------------------------------------------------------------------

export type PermissionData = {
  action: PermissionId;
};

// ----------------------------------------------------------------------

export type PermissionId = 'inspection_panel_access';

export type PermissionCheckData = { id: PermissionId } | PermissionId;

export type PermissionCheckParams = {
  method: 'every' | 'some';
  permissions: PermissionCheckData[];
};
