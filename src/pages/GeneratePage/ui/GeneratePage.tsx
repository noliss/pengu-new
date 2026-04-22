import Box from '@mui/material/Box';
import { Page, LottieAnimation } from '@shared/ui';
import { GenerateDock } from '@widgets/GenerateDock';
import penguAnimation from '@assets/lottie/pengu.json';
import styles from './GeneratePage.module.scss';

export const GeneratePage = () => {
  return (
    <Page>
      <Box className={styles.content}>
        <Box className={styles.stage}>
          <Box className={styles.stageGlow} aria-hidden />
          <Box className={styles.stageInner}>
            <LottieAnimation animationData={penguAnimation} loop autoplay />
          </Box>
          <Box className={styles.stageShadow} aria-hidden />
        </Box>
      </Box>

      <GenerateDock
        onGenerate={() => {
          // TODO: запустить генерацию через api/thunk
        }}
      />
    </Page>
  );
};
