import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { RegisterDto } from '../types';
import { register as registerAction } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>();

  const onSubmit = async (data: RegisterDto) => {
    const result = await dispatch(registerAction(data));
    if (registerAction.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            TaskFlow Plattform
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Konto erstellen
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vorname"
                  {...register('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nachname"
                  {...register('lastName')}
                />
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Benutzername"
              autoComplete="username"
              {...register('username', {
                required: 'Benutzername erforderlich',
                minLength: { value: 3, message: 'Benutzername muss mindestens 3 Zeichen haben' },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="E-Mail-Adresse"
              autoComplete="email"
              {...register('email', {
                required: 'E-Mail erforderlich',
                pattern: { value: /^\S+@\S+$/i, message: 'Ungültige E-Mail-Adresse' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Passwort"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Passwort erforderlich',
                minLength: { value: 6, message: 'Passwort muss mindestens 6 Zeichen haben' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Konto wird erstellt...' : 'Registrieren'}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Bereits ein Konto? Anmelden
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
