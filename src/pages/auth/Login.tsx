// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box, Button, TextField, Typography, Alert, Stack,
  InputAdornment, CircularProgress, IconButton,
} from '@mui/material';
import { Lock, ChatCircleDots, Eye, EyeSlash, ArrowRight, ArrowLeft } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'name'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [about, setAbout] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        setError('Phone number must start with 9, 8, or 7');
        setLoading(false);
        return;
      }
      if (!/^[987]/.test(digitsOnly)) {
        setError('Phone number must be start');
        setLoading(false);
        return;
      }
      const fullNumber = `+91${digitsOnly}`;
      setPhoneNumber(fullNumber);
      
      const response = await api.sendOTP(fullNumber);
      
      if (response.exists) {
        // User already exists, ask for password
        setIsExistingUser(true);
        setStep('password');
      } else {
        // New user, proceed with OTP
        setDevOtp(response.otp || '');
        setStep('otp');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.verifyOTP(phoneNumber, otp);
      setVerifiedUser(user);
      setStep('password');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (verifiedUser) {
        await api.setPassword(verifiedUser.id, password);
        const updatedUser = { ...verifiedUser, hasPassword: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/app');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(phoneNumber, password);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid password');
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
            {step === 'phone' ? 'Welcome' : step === 'otp' ? 'Enter OTP' : 'Enter Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {step === 'phone' ? 'Enter your phone number' : step === 'otp' ? `Code sent to ${phoneNumber}` : 'Enter your password to continue'}
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {devOtp && step === 'otp' && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>Dev OTP: <strong>{devOtp}</strong></Alert>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOtp}>
            <Stack spacing={3}>
              <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" required
                InputProps={{ startAdornment: (<InputAdornment position="start"><Typography sx={{ fontWeight: 600, mr: 1 }}>+91</Typography></InputAdornment>) }}
                helperText="Enter correct Number" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Checking...' : 'Continue'}
              </Button>
            </Stack>
          </form>
        )}

        {/* Step 2: OTP (new users only) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <Stack spacing={3}>
              <TextField fullWidth label="OTP Code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required
                inputProps={{ maxLength: 6, inputMode: 'numeric', style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading || otp.length !== 6}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button variant="text" onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); }}
                startIcon={<ArrowLeft />}>Change Number</Button>
            </Stack>
          </form>
        )}

        {/* Step 3: Password */}
        {step === 'password' && (
          <form onSubmit={isExistingUser ? handlePasswordLogin : handleSetPassword}>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                {isExistingUser ? 'This account already exists. Enter your password to log in.' : 'Set a password for your new account.'}
              </Typography>
              <TextField fullWidth label={isExistingUser ? 'Password' : 'Create Password'} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required
                InputProps={{ startAdornment: (<InputAdornment position="start"><Lock size={20} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlash /> : <Eye />}</IconButton></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" size="large" disabled={loading || password.length < 6}
                endIcon={<ArrowRight />} sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Please wait...' : isExistingUser ? 'Sign In' : 'Set Password & Continue'}
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Login;
