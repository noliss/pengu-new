import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoaderProps {
  text?: string;
  size?: number;
  height?: number | string;
}

export const Loader = ({ 
  text, 
  size = 60, 
  height = 300 
}: LoaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        flexDirection: 'column',
        gap: text ? 2 : 0
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          sx={{
            color: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <CircularProgress
          variant="indeterminate"
          size={size}
          thickness={4}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
      
      {text && (
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            // background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            // padding: '8px 16px',
            // borderRadius: '12px',
            // border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};