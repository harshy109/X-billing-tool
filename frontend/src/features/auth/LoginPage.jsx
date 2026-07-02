import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material'
import { loginUser, selectAuthError, selectAuthStatus, selectAuthUser } from './authSlice.js'

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

const defaultValues = {
  email: 'super.admin@xbilling.local',
  password: 'Admin@123',
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectAuthUser)
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues })

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [navigate, user])

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values))

    if (loginUser.fulfilled.match(result)) {
      navigate('/', { replace: true })
    }
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 8 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="primary">
              X-Billing Tool
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in with a seeded enterprise role to enter the administration portal.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Email" autoComplete="email" {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
            <TextField label="Password" type="password" autoComplete="current-password" {...register('password')} error={Boolean(errors.password)} helperText={errors.password?.message} />

            {error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : null}

            <Button type="submit" variant="contained" size="large" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}