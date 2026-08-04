// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Phone, ArrowRight, ArrowLeft, ChatCircleDots, Eye, EyeSlash } from 'phosphor-react';
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

  const isDefaultName = (name?: string) => {
    if (!name) return true;
    return /^User\s?\d*$/i.test(name.trim());
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.sendOTP(phoneNumber);
      setDevOtp(response.otp || '');
      setStep('otp');
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
      // If user has no password, ask them to create one
      if (!user.hasPassword) {
        setStep('password');
      } else if (isDefaultName(user.fullName)) {
        setStep('name');
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/app');
      }
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
      // Save password to backend
      await api.setPassword(verifiedUser.id, password);
      const updatedUser = { ...verifiedUser, hasPassword: true };
      if (isDefaultName(updatedUser.fullName)) {
        setStep('name');
      } else {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/app');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to set password.');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newName = fullName.trim();
    if (!newName) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    const updatedUser = {
      ...verifiedUser,
      fullName: newName,
      about: about.trim() || 'Hey there! I am using Chat App',
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    try {
      await api.updateProfile(verifiedUser.id, {
        fullName: newName,
        about: about.trim() || 'Hey there! I am using Chat App',
      });
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
      navigate('/app');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 'phone') handleRequestOtp(e as any);
      else if (step === 'otp') handleVerifyOtp(e as any);
      else if (step === 'password') handleSetPassword(e as any);
      else if (step === 'name') handleSaveProfile(e as any);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0A0B0F 0%, #1A1C20 100%)'
            : 'linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 100%)',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 3,
        }}
      >
        <Stack alignItems="center" mb={4}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
            }}
          >
            <ChatCircleDots size={36} color="#fff" weight="fill" />
          </Box>
          <Typography variant="h5" fontWeight={700} textAlign="center">
            {step === 'phone' ? 'Welcome Back' : step === 'otp' ? 'Enter OTP' : step === 'password' ? 'Create Password' : 'Complete Your Profile'}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={0.5}>
            {step === 'phone'
              ? 'Enter your phone number to sign in'
              : step === 'otp'
              ? `We sent a 6‑digit code to ${phoneNumber}`
              : step === 'password'
              ? 'Set a password to secure your account'
              : 'Choose a display name for your account'}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {devOtp && step === 'otp' && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            Dev Mode – Your OTP is: <strong>{devOtp}</strong>
          </Alert>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOtp}>
            <Stack spacing={3}>
              <TextField fullWidth label="Phone Number" type="tel" value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Enter your phone number" required
                InputProps={{ startAdornment: (<InputAdornment position="start"><Phone size={20} color={theme.palette.text.secondary} /></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading || phoneNumber.length < 10}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight />}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </Button>
            </Stack>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <Stack spacing={3}>
              <TextField fullWidth label="OTP Code" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={handleKeyDown} placeholder="000000" required
                inputProps={{ maxLength: 6, inputMode: 'numeric', style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontFamily: 'monospace' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading || otp.length !== 6}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight />}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button variant="text" onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); }}
                startIcon={<ArrowLeft />} sx={{ textTransform: 'none', fontWeight: 500 }}>
                Change Phone Number
              </Button>
            </Stack>
          </form>
        )}

        {/* Step 3: Set Password (new users) */}
        {step === 'password' && (
          <form onSubmit={handleSetPassword}>
            <Stack spacing={3}>
              <TextField fullWidth label="Create Password" type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown} placeholder="Min 6 characters" required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading || password.length < 6}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight />}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Setting Password...' : 'Continue'}
              </Button>
            </Stack>
          </form>
        )}

        {/* Step 4: Choose Name */}
        {step === 'name' && (
          <form onSubmit={handleSaveProfile}>
            <Stack spacing={3}>
              <TextField fullWidth label="Display Name" value={fullName}
                onChange={(e) => setFullName(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Your name" required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField fullWidth label="About (optional)" value={about}
                onChange={(e) => setAbout(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Something about yourself" multiline rows={2}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading || !fullName.trim()}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight />}
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </Stack>
          </form>
        )}

        {step === 'phone' && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
            Don't have an account?{' '}
            <Link to="/auth/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Login;
