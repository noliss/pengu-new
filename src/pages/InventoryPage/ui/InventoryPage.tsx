import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Loader, Page, PageHeader } from '@shared/ui';
import { ConnectWalletButton } from '@features/connect-wallet';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  fetchInventoryNfts,
  NftInventoryCard,
  selectInventoryError,
  selectInventoryItems,
  selectInventoryStatus,
} from '@entities/inventory';

export const InventoryPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(510));
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectInventoryStatus);
  const items = useAppSelector(selectInventoryItems);
  const error = useAppSelector(selectInventoryError);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchInventoryNfts());
    }
  }, [dispatch, status]);

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <Page>
      <Container maxWidth="sm" sx={{ padding: '15px 15px' }}>
        <PageHeader title={t('inventory.title')} rightSlot={<ConnectWalletButton />} />

        {isLoading ? (
          <Loader text={t('inventory.loading')} size={70} height="400px" />
        ) : items.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ py: 4, textAlign: 'center' }}
            color={error ? 'error' : 'text.secondary'}
          >
            {error ?? t('inventory.empty')}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid key={item.id} size={isSmallScreen ? 6 : 4}>
                <NftInventoryCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
};
