import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material';
import { Search, Sort } from "@mui/icons-material";
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSortClick?: () => void;
  sx?: SxProps<Theme>;
}

export const SearchBar = ({ onSortClick, sx }: SearchBarProps) => {
  return (
    <Grid 
      container 
      wrap="nowrap" 
      className={styles.container}
      alignItems="center" 
      justifyContent="space-between" 
      spacing={2}
      sx={sx}
    >
      <Grid container sx={{ width: '100%' }}>
        <TextField
          fullWidth
          placeholder="Search collections..."
          variant="outlined"
          className={styles.searchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid>
        <IconButton
          onClick={onSortClick}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            color: "rgba(255, 255, 255, 0.7)",
            width: "40px",
            height: "40px",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 25px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Sort />
        </IconButton>
      </Grid>
    </Grid>
  );
};