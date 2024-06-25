export const ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
}

export const ACCOUNT_STATUS = {
  Block: true,
  Unlock: false
}

export const STATUS_ONLINE = {
  Offline: false,
  Online: true
}

export const STATUS_EMPLOYEE = [
  {
    label: 'Doing',
    value: true
  },
  {
    label: 'Retire',
    value: false
  }
]

export const STATUS_PRODUCT = [
  { label: 'Public', value: true },
  { label: 'Draft', value: false }
]

export const COMBO_PRODUCT = [
  { label: 'Combo', value: true },
  { label: 'Product', value: false }
]
