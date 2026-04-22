import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UndoIcon from '@mui/icons-material/Undo';
import CasinoIcon from '@mui/icons-material/Casino';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const handleUndo = useCallback(() => dispatch(undoDraft()), [dispatch]);
  const handleRandom = useCallback(
    () => dispatch(randomizeDraft({ partIds, svgIds, colors })),
    [dispatch, partIds, svgIds, colors],
  );

  const openMore = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setMoreAnchor(e.currentTarget),
    [],
  );
  const closeMore = useCallback(() => setMoreAnchor(null), []);

  const handleReset = useCallback(() => {
    dispatch(resetDraft());
    setMoreAnchor(null);
  }, [dispatch]);

  const openSettings = useCallback(() => {
    setMoreAnchor(null);
    setIsSettingsOpen(true);
  }, []);
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
        <IconButton
          className={styles.iconButton}
          onClick={handleUndo}
          disabled={!canUndo}
          aria-label="Отменить последнее действие"
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          className={styles.iconButton}
          onClick={handleRandom}
          aria-label="Случайный выбор"
        >
          <CasinoIcon />
        </IconButton>
        <IconButton
          className={styles.iconButton}
          onClick={openMore}
          aria-label="Ещё"
          aria-haspopup="menu"
          aria-expanded={Boolean(moreAnchor)}
        >
          <MoreHorizIcon />
        </IconButton>

        <Button className={styles.generateButton} onClick={onGenerate}>
          Generate
        </Button>
      </Box>

      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={closeMore}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { className: styles.menuPaper } }}
      >
        <MenuItem onClick={handleReset} className={styles.menuItem}>
          <ListItemIcon className={styles.menuIcon}>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Сбросить</ListItemText>
        </MenuItem>
        <MenuItem onClick={openSettings} className={styles.menuItem}>
          <ListItemIcon className={styles.menuIcon}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Настройки</ListItemText>
        </MenuItem>
      </Menu>

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
