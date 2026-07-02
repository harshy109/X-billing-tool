import { Chip } from '@mui/material'

export default function AccessPill({ role }) {
  return <Chip label={role || 'Guest'} color="primary" variant="outlined" size="small" />
}