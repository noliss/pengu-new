import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { Layout } from '../../components/Layout';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { CollectionCard } from '../../components/CollectionCard';
import { Loader } from '../../components/Loader/Loader';

const collections = [
  {
    id: 1,
    title: "Pengu Gold",
    imageUrl: "https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2024/12/pudgy-door-gID_7.png@webp"
  },
  {
    id: 2,
    title: "Pengu Silver",
    imageUrl: "https://pintu-academy.pintukripto.com/wp-content/uploads/2025/05/What-is-Pengu.png"
  },
  {
    id: 3,
    title: "Pengu Classic",
    imageUrl: "https://www.tbstat.com/wp/uploads/2024/12/Screenshot-2024-12-17-at-18.29.12-1200x675.png"
  },
  {
    id: 4,
    title: "Doodles Classic",
    imageUrl: "https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2023/01/doodles2-gID_7.jpeg@webp"
  },
  {
    id: 5,
    title: "Doodles Gold",
    imageUrl: "https://cointab.com/wp-content/uploads/2025/09/Doodles-.jpg"
  },
];

export const Collections = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(510));
  const [isLoading, setIsLoading] = useState(true);

  const handleSortClick = () => {
    // TODO: Implement sorting logic
  };

  const handleCollectionClick = (collectionId: number) => {
    // TODO: Navigate to collection details
    void collectionId;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ padding: "15px 15px" }}>
        <PageHeader title="Collections" />
        
        <SearchBar onSortClick={handleSortClick} />

        {isLoading ? (
          <Loader 
            text="Loading collections..." 
            size={70}
            height="400px"
          />
        ) : (
          <Grid container spacing={2}>
            {collections.map((collection) => (
              <Grid key={collection.id} size={isSmallScreen ? 6 : 4}>
                <CollectionCard
                  title={collection.title}
                  imageUrl={collection.imageUrl}
                  onClick={() => handleCollectionClick(collection.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};