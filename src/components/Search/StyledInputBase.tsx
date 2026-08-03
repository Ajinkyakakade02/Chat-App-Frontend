// @ts-nocheck
import { InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: '0.875rem',
    '&::placeholder': {
      color: theme.palette.mode === 'dark' ? '#6B7280' : '#9CA3AF',
      opacity: 1,
    },
  },
}));

export default StyledInputBase;