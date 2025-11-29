import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'

import { KeyboardArrowRightOutlined, Search } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AppsIcon from "@mui/icons-material/Apps";
import SortIcon from "@mui/icons-material/Sort";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const collections = [
  "Pengu Gold",
  "Pengu Silver",
  "Doodles",
  "Pengu Friends",
  "Doodles New #2 New #2 New #2 New #2 New #2",
  "Doodles New",
  "Doodles New #3",
  "Doodles Old",
  "Doodles New #2",
  "Doodles New #2 New #2 New #2 New #2 New #2",
];

export const Collections = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(510));

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 7 }}>
      <Container maxWidth="sm" sx={{ padding: "15px 15px" }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          pb={3}
        >
          <Typography
            align="center"
            variant="h5"
            sx={{
              color: "white",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          >
            Collections
          </Typography>
          <TonConnectButton style={{ maxWidth: '160px' }} />
        </Grid>

        {/* Стилизованный TextField */}
        <Grid container wrap="nowrap" sx={{ mb: 2 }} alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid container sx={{width: '100%'}}>
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
              <SortIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {collections.map((item) => {
            return (
              <Grid key={item} size={isSmallScreen ? 6 : 4}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <CardMedia
                    image="https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/12/pudgy-door-gID_7.png@webp"
                    sx={{
                      height: 140,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <CardContent
                    sx={{
                      background: "rgba(0, 0, 0, 0.3)",
                      backdropFilter: "blur(5px)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      height: '38px',
                      padding: '10px 10px',
                      paddingBottom: '10px !important',
                    }}
                  >
                    <Grid
                      alignItems="center"
                      justifyContent="space-between"
                      direction="row"
                      wrap="nowrap"
                      container
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
                          fontWeight: 500,
                        }}
                      >
                        {item.length > 20 ? `${item.substring(0, 28)}...` : item}
                      </Typography>
                      <IconButton type="button" sx={{ color: "white", padding: 0 }}>
                        <KeyboardArrowRightOutlined />
                      </IconButton>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Bottom Navigation с эффектом стеклянного морфизма */}
      <BottomNavigation
        sx={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          borderTop: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: '40px 40px 0 0',
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '40px 40px 0 0',
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            zIndex: -1,
          },
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255, 255, 255, 0.8)",
            minWidth: "auto",
            padding: "8px 12px",
            transition: "all 0.3s ease",
            borderRadius: '40px 40px 0 0',
            "&:hover": {
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: '40px 40px 0 0',
            },
            "&.Mui-selected": {
              color: "white",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.75rem",
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&.Mui-selected": {
              fontSize: "0.8rem",
              fontWeight: 600,
            },
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
            transition: "all 0.3s ease",
          },
        }}
        showLabels
      >
        <BottomNavigationAction onClick={() => navigate('/')} label="Collections" icon={<AppsIcon />} />
        <BottomNavigationAction onClick={() => navigate('/generate')} label="Character" icon={<AutoAwesomeIcon />} />
        <BottomNavigationAction onClick={() => navigate('/profile')} label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
};