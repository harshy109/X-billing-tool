import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import { logoutUser, selectAuthUser } from '../features/auth/authSlice.js'
import AccessPill from '../components/AccessPill.jsx'
import { hasPermission } from '../config/roles.js'

const capabilityCards = [
  {
    title: 'Vendor creation',
    permission: 'vendors:create',
    description: 'Only Super Admin can create vendors in the enterprise portal.',
  },
  {
    title: 'Billing configuration',
    permission: 'billing:manage',
    description: 'Billing Admin can manage vendor billing settings and templates.',
  },
  {
    title: 'Read-only oversight',
    permission: 'vendors:view',
    description: 'Read Only Admin can view dashboard and records without write access.',
  },
]

export default function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthUser)

  const onLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="overline" color="primary">
            X-Billing Tool
          </Typography>
          <AccessPill role={user?.role} />
          <Typography variant="h4" fontWeight={700}>
            Dashboard shell
          </Typography>
          <Typography color="text.secondary">
            Signed in as {user?.name} with the {user?.role} role.
          </Typography>
          <Typography color="text.secondary">
            The next module will replace this placeholder with the enterprise dashboard metrics.
          </Typography>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {capabilityCards.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="caption" color={hasPermission(user?.role, item.permission) ? 'success.main' : 'text.secondary'} sx={{ display: 'block', mt: 2 }}>
                      {hasPermission(user?.role, item.permission) ? 'Allowed for your role' : 'Not allowed for your role'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" onClick={onLogout} sx={{ width: 'fit-content' }}>
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}