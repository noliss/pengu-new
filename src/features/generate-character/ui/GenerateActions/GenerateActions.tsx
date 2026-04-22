import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import CasinoIcon from '@mui/icons-material/Casino';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  selectCanUndo,
  selectCharacterName,
  selectGenerationType,
  setCharacterName,
  setGenerationType,
  undoDraft,
  resetDraft,
  randomizeDraft,
} from '@entities/character';
import type { GenerationType } from '@entities/character';
import { GenerateSettingsDialog } from '../GenerateSettingsDialog';
import styles from './GenerateActions.module.scss';

interface GenerateActionsProps {
  partIds: string[];
  svgIds: string[];
  colors: string[];
  onGenerate?: () => void;
}

export const GenerateActions = ({ partIds, svgIds, colors, onGenerate }: GenerateActionsProps) => {
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectCharacterName);
  const type = useAppSelector(selectGenerationType);
  const canUndo = useAppSelector(selectCanUndo);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleUndo = useCallback(() => dispatch(undoDraft()), [dispatch]);
  const handleRandom = useCallback(
    () => dispatch(randomizeDraft({ partIds, svgIds, colors })),
    [dispatch, partIds, svgIds, colors],
  );
  const handleReset = useCallback(() => dispatch(resetDraft()), [dispatch]);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const handleSave = useCallback(
    (newName: string, newType: GenerationType) => {
      dispatch(setCharacterName(newName));
      dispatch(setGenerationType(newType));
      setIsSettingsOpen(false);
    },
    [dispatch],
  );

  return (
    <>
      <Box className={styles.container}>
        <Box className={styles.actionsGroup}>
          <IconButton
            className={styles.iconButton}
            onClick={handleUndo}
            disabled={!canUndo}
            aria-label="Отменить последнее действие"
          >
            <UndoIcon />
          </IconButton>
          <IconButton className={styles.iconButton} onClick={handleRandom} aria-label="Случайный выбор">
            <CasinoIcon />
          </IconButton>
          <IconButton className={styles.iconButton} onClick={handleReset} aria-label="Сбросить">
            <RefreshIcon />
          </IconButton>
          <IconButton className={styles.iconButton} onClick={openSettings} aria-label="Настройки">
            <SettingsIcon />
          </IconButton>
        </Box>

        <Button className={styles.generateButton} onClick={onGenerate}>
          Generate
        </Button>
      </Box>

      <GenerateSettingsDialog
        open={isSettingsOpen}
        onClose={closeSettings}
        characterName={name}
        generationType={type}
        onSave={handleSave}
      />
    </>
  );
};
