import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material';
import { Search, Sort } from '@mui/icons-material';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSortClick?: () => void;
  sx?: SxProps<Theme>;
}

export const SearchBar = ({ value, placeholder = 'Search...', onChange, onSortClick, sx }: SearchBarProps) => (
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
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        className={styles.searchField}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Grid>
    <Grid>
      <IconButton onClick={onSortClick} className={styles.sortButton}>
        <Sort />
      </IconButton>
    </Grid>
  </Grid>
);
