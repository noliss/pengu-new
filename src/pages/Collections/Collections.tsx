import Container from "@mui/material/Container";
import { useAppSelector } from "../../store/hooks";
import { useUserSelector } from "../../store/selectors/userSelector";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { KeyboardArrowRightOutlined, Search } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AppsIcon from "@mui/icons-material/Apps";
import SortIcon from "@mui/icons-material/Sort";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

const collections = [
  "Pengu Gold",
  "Pengu Silver",
  "Doodles",
  "Pengu Friends",
  "Title Title Title Title Title",
];

export const Collections = () => {
  const user = useAppSelector(useUserSelector);
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
          {/* <Grid
            container
            alignItems="center"
            gap={2}
            sx={{
              background: "rgba(255, 255, 255, 0.11)",
              padding: "5px 10px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          > */}
            <TonConnectButton style={{ maxWidth: '160px' }} />
            {/* <Typography
              variant="body2"
              sx={{
                color: "white",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              }}
            >
              {user?.first_name} {user?.last_name}
            </Typography>
            <Avatar src={user?.photo_url} /> */}
          {/* </Grid> */}
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
                      height: "fit-content",
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
                        {item}
                      </Typography>
                      <IconButton type="button" sx={{ color: "white" }}>
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

      {/* Bottom Navigation */}
      <BottomNavigation
        sx={{
          background: "rgba(255, 255, 255, 0.2)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          "& .MuiBottomNavigationAction-root": {
            color: "white",
            "&.Mui-selected": {
              color: "white",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            color: "white",
            "&.Mui-selected": {
              color: "white",
            },
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
