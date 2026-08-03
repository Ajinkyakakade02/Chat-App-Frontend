// @ts-nocheck
import { styled, alpha } from '@mui/material/styles';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 16,                              // softer rounded corners
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.06)
    : alpha(theme.palette.common.black, 0.04),
  backdropFilter: 'blur(12px)',                  // glass effect
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.1)
      : alpha(theme.palette.common.black, 0.06),
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export default Search;