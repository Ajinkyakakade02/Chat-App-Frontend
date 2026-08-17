// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Button, TextField, Typography, Alert, Stack,
  InputAdornment, CircularProgress, IconButton,
} from '@mui/material';
import { Lock, ChatCircleDots, Eye, EyeSlash, ArrowRight, User, Envelope } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await api.register(fullName, email, password);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('session_expiry', String(Date.now() + 24 * 60 * 60 * 1000));
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed');
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
          <Typography variant="h5" fontWeight={700}>Create Account</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Join NovaChat and start chatting</Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleRegister}>
          <Stack spacing={3}>
            <TextField fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" required
              InputProps={{ startAdornment: (<InputAdornment position="start"><User size={20} /></InputAdornment>) }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
              InputProps={{ startAdornment: (<InputAdornment position="start"><Envelope size={20} /></InputAdornment>) }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock size={20} /></InputAdornment>),
                endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlash /> : <Eye />}</IconButton></InputAdornment>)
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Button type="submit" variant="contained" size="large" disabled={loading}
              endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          Already have an account? <Link to="/auth/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
