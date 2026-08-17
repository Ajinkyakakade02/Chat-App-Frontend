// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Button, TextField, Typography, Alert, Stack,
  InputAdornment, CircularProgress, IconButton,
} from '@mui/material';
import { Lock, ChatCircleDots, Eye, EyeSlash, ArrowRight, Phone } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState<'login' | 'forgot' | 'otp' | 'reset'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Normal Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const fullNumber = `+91${digitsOnly}`;
      const user = await api.login(fullNumber, password);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 👇 ADD THIS LINE - Set session expiry to 24 hours from now
      localStorage.setItem('session_expiry', String(Date.now() + 24 * 60 * 60 * 1000));
      
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 1: Send OTP to email
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const fullNumber = `+91${digitsOnly}`;
      await api.forgotPassword(fullNumber, email);
      setSuccess('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 2: Reset password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const fullNumber = `+91${digitsOnly}`;
      await api.resetPassword(fullNumber, otp, newPassword);
      setSuccess('Password reset successfully. Please login.');
      setStep('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to reset password');
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
          <Typography variant="h5" fontWeight={700}>
            {step === 'login' ? 'Welcome Back' : step === 'forgot' ? 'Forgot Password' : step === 'otp' ? 'Enter OTP' : 'Reset Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {step === 'login' ? 'Sign in with your phone and password' : ''}
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

        {/* Step 1: Login */}
        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" required
                InputProps={{ startAdornment: (<InputAdornment position="start"><Typography sx={{ fontWeight: 600, mr: 1 }}>+91</Typography></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock size={20} /></InputAdornment>),
                  endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlash /> : <Eye />}</IconButton></InputAdornment>)
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button variant="text" onClick={() => { setStep('forgot'); setError(''); setSuccess(''); }} sx={{ textTransform: 'none' }}>
                Forgot Password?
              </Button>
            </Stack>
          </form>
        )}

        {/* Step 2: Forgot Password - Enter Phone + Email */}
        {step === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <Stack spacing={3}>
              <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter your phone number" required
                InputProps={{ startAdornment: (<InputAdornment position="start"><Typography sx={{ fontWeight: 600, mr: 1 }}>+91</Typography></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              <Button variant="text" onClick={() => setStep('login')} sx={{ textTransform: 'none' }}>Back to Login</Button>
            </Stack>
          </form>
        )}

        {/* Step 3: Enter OTP */}
        {step === 'otp' && (
          <form onSubmit={handleResetPassword}>
            <Stack spacing={3}>
              <TextField fullWidth label="OTP Code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required
                inputProps={{ maxLength: 6, inputMode: 'numeric', style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="New Password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" required
                InputProps={{
                  endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlash /> : <Eye />}</IconButton></InputAdornment>)
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Stack>
          </form>
        )}

        {step === 'login' && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
            Don't have an account? <Link to="/auth/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Login;
