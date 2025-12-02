import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { KeyboardArrowRightOutlined, ImageOutlined } from "@mui/icons-material";

interface CollectionCardProps {
  title: string;
  imageUrl: string;
  onClick?: () => void;
}

export const CollectionCard = ({ title, imageUrl, onClick }: CollectionCardProps) => {
  const [imageError, setImageError] = useState(false);
  const truncatedTitle = title.length > 20 ? `${title.substring(0, 28)}...` : title;

  return (
    <Card
      onClick={onClick}
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
      {imageError ? (
        <Box
          sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <ImageOutlined sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)' }} />
        </Box>
      ) : (
        <CardMedia
          image={imageUrl}
          onError={() => setImageError(true)}
          sx={{
            height: 140,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />
      )}
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
            {truncatedTitle}
          </Typography>
          <IconButton type="button" sx={{ color: "white", padding: 0 }}>
            <KeyboardArrowRightOutlined />
          </IconButton>
        </Grid>
      </CardContent>
    </Card>
  );
};