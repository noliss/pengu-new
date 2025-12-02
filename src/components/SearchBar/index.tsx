import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { Search, Sort } from "@mui/icons-material";

interface SearchBarProps {
  onSortClick?: () => void;
}

export const SearchBar = ({ onSortClick }: SearchBarProps) => {
  return (
    <Grid container wrap="nowrap" sx={{ mb: 2 }} alignItems="center" justifyContent="space-between" spacing={2}>
      <Grid container sx={{ width: '100%' }}>
        <TextField
          fullWidth
          placeholder="Search collections..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              maxHeight: "40px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 25px rgba(0, 0, 0, 0.15)",
              },
              "&.Mui-focused": {
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
              },
              "& fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
              "&::placeholder": {
                color: "rgba(255, 255, 255, 0.6)",
                opacity: 1,
              },
            },
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