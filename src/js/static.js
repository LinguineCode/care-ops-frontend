// NOTE: id: 'admin' purposefully not included
// NOTE: Intentionally not i18n'd: may move to BE
const ACCESS_TYPES = [
  {
    id: 'employee',
    name: 'Employee',
    details: 'can access Workspace but not Admin',
  },
  {
    id: 'manager',
    name: 'Manager',
    details: 'can access Workspace and Admin',
  },
];

const ACTION_OUTREACH = {
  DISABLED: 'disabled',
  PATIENT: 'patient',
};

const PUBLISH_STATE_STATUS = {
  CONDITIONAL: 'conditional',
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

const STATE_STATUS = {
  STARTED: 'started',
  QUEUED: 'queued',
  DONE: 'done',
};

export {
  ACCESS_TYPES,
  ACTION_OUTREACH,
  PUBLISH_STATE_STATUS,
  STATE_STATUS,
};
