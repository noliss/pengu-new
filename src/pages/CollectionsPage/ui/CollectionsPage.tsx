import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Loader, PageHeader, SearchBar } from '@shared/ui';
import { Page } from '@shared/ui/Page';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { ConnectWalletButton } from '@features/connect-wallet';
import {
  CollectionCard,
  fetchCollections,
  selectCollectionsStatus,
  selectCollectionsSearch,
  selectFilteredCollections,
  setSearch,
} from '@entities/collection';

export const CollectionsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(510));
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCollectionsStatus);
  const search = useAppSelector(selectCollectionsSearch);
  const collections = useAppSelector(selectFilteredCollections);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchCollections());
    }
  }, [dispatch, status]);

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <Page back={false}>
      <Container maxWidth="sm" sx={{ padding: '15px 15px' }}>
        <PageHeader title={t('collections.title')} rightSlot={<ConnectWalletButton />} />

        <SearchBar
          value={search}
          placeholder={t('collections.searchPlaceholder')}
          onChange={(value) => dispatch(setSearch(value))}
        />

        {isLoading ? (
          <Loader text={t('collections.loading')} size={70} height="400px" />
        ) : (
          <Grid container spacing={2}>
            {collections.map((collection) => (
              <Grid key={collection.id} size={isSmallScreen ? 6 : 4}>
                <CollectionCard
                  title={collection.title}
                  imageUrl={collection.imageUrl}
                  onClick={() => {
                    // TODO: navigate(buildCollectionDetailsPath(collection.id))
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
};
