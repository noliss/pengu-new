import Container from "@mui/material/Container";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/PageHeader";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../store/hooks";
import { useUserSelector } from "../../store/selectors/userSelector";

export const Profile = () => {
  const user = useAppSelector(useUserSelector);

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ padding: "15px 15px" }}>
        <PageHeader title="Profile" />

        <Grid container spacing={2}>
          <Grid size={12}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                  }}
                >
                  <Avatar
                    src={user?.photo_url}
                    alt={user?.first_name || "User"}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {user?.first_name?.[0] || user?.username?.[0] || "U"}
                  </Avatar>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.first_name || user?.username || "Anonymous"}
                    </Typography>
                    {user?.username && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        @{user.username}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  User Information
                </Typography>
                <Grid container spacing={2}>
                  {user?.id && (
                    <Grid size={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}
                      >
                        User ID
                      </Typography>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        {user.id}
                      </Typography>
                    </Grid>
                  )}
                  {user?.language_code && (
                    <Grid size={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}
                      >
                        Language
                      </Typography>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        {user.language_code.toUpperCase()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
