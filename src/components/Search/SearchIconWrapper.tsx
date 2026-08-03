// @ts-nocheck
import { styled } from '@mui/material/styles';

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.mode === 'dark' ? '#8B92A8' : '#5A6072',   // subtle icon color
}));

export default SearchIconWrapper;