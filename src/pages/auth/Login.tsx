// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Button, TextField, Typography, Alert, Stack,
  InputAdornment, CircularProgress, IconButton,
} from '@mui/material';
import { Phone, Lock, ChatCircleDots, Eye, EyeSlash } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(phoneNumber, password);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #0A0B0F 0%, #1A1C20 100%)' : 'linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 100%)', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(24px)', border: `1px solid ${theme.palette.divider}`, boxShadow: 3 }}>
        <Stack alignItems="center" mb={4}>
          <Box sx={{ width: 72, height: 72, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: `0 8px 24px ${theme.palette.primary.main}40` }}>
            <ChatCircleDots size={36} color="#fff" weight="fill" />
          </Box>
          <Typography variant="h5" fontWeight={700}>Welcome Back</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Sign in with your phone and password</Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" required InputProps={{ startAdornment: (<InputAdornment position="start"><Phone size={20} /></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required InputProps={{ startAdornment: (<InputAdornment position="start"><Lock size={20} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlash /> : <Eye />}</IconButton></InputAdornment>) }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>{loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}</Button>
          </Stack>
        </form>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          Don't have an account? <Link to="/auth/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
