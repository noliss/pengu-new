import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import { Page, LottieAnimation } from '@shared/ui';
import { MOCK_COLLECTIONS } from '@entities/collection';
import { CollectionSwitcher, type SwitchDirection } from '@widgets/CollectionSwitcher';
import { GenerateDock } from '@widgets/GenerateDock';
import { GenerateActionsModals } from '@features/generate-character';
import penguAnimation from '@assets/lottie/pengu.json';
import styles from './GeneratePage.module.scss';

export const GeneratePage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionIndex, setCollectionIndex] = useState(0);
  // Направление последнего переключения нужно switcher'у для выбора
  // направления анимации заголовка (куда улетает / откуда прилетает).
  const [direction, setDirection] = useState<SwitchDirection>('next');
  const collection = MOCK_COLLECTIONS[collectionIndex];
  const hasPrev = collectionIndex > 0;
  const hasNext = collectionIndex < MOCK_COLLECTIONS.length - 1;

  const handlePrev = useCallback(() => {
    setCollectionIndex((i) => {
      if (i <= 0) return i;
      setDirection('prev');
      return i - 1;
    });
  }, []);
  const handleNext = useCallback(() => {
    setCollectionIndex((i) => {
      if (i >= MOCK_COLLECTIONS.length - 1) return i;
      setDirection('next');
      return i + 1;
    });
  }, []);

  const handleGenerate = useCallback(() => {
    // TODO: запустить генерацию через api/thunk
  }, []);

  return (
    <Page>
      <GenerateActionsModals
        createOpen={createDialogOpen}
        deleteOpen={deleteDialogOpen}
        onCloseCreate={() => setCreateDialogOpen(false)}
        onCloseDelete={() => setDeleteDialogOpen(false)}
        onGenerate={handleGenerate}
      />
      <Box className={styles.content}>
        <CollectionSwitcher
          title={collection?.title ?? ''}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={handlePrev}
          onNext={handleNext}
          direction={direction}
        />

        <Box className={styles.stage}>
          <Box className={styles.stageGlow} aria-hidden />
          <Box className={styles.stageInner}>
            <LottieAnimation animationData={penguAnimation} />
          </Box>
          <Box className={styles.stageShadow} aria-hidden />
        </Box>

        <GenerateDock
          onOpenCreate={() => setCreateDialogOpen(true)}
          onOpenDelete={() => setDeleteDialogOpen(true)}
        />
      </Box>
    </Page>
  );
};
