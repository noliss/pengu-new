import Container from "@mui/material/Container";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/PageHeader";
import Grid from "@mui/material/Grid";

export const Generate = () => {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ padding: "15px 15px" }}>
        <PageHeader title="Generate" />

        <Grid container spacing={2}>
          Generate Page
        </Grid>
      </Container>
    </Layout>
  );
};
