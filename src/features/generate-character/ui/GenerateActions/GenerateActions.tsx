import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import UndoIcon from '@mui/icons-material/Undo';
import CasinoIcon from '@mui/icons-material/Casino';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleUndo = useCallback(() => dispatch(undoDraft()), [dispatch]);
  const handleRandom = useCallback(
    () => dispatch(randomizeDraft({ partIds, svgIds, colors })),
    [dispatch, partIds, svgIds, colors],
  );

  // Диалог подтверждения удаления: ресет драфта — деструктивное действие,
  const openDelete = useCallback(() => setIsDeleteOpen(true), []);
  const closeDelete = useCallback(() => setIsDeleteOpen(false), []);
  const handleConfirmDelete = useCallback(() => {
    dispatch(resetDraft());
    setIsDeleteOpen(false);
  }, [dispatch]);


  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);
  const handleCreate = useCallback(
    (newName: string, newType: GenerationType) => {
      dispatch(setCharacterName(newName));
      dispatch(setGenerationType(newType));
      setIsCreateOpen(false);
      onGenerate?.();
    },
    [dispatch, onGenerate],
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
          onClick={openDelete}
          aria-label="Удалить персонажа"
        >
          <DeleteOutlineIcon />
        </IconButton>

        <Button className={styles.generateButton} onClick={openCreate}>
          Generate
        </Button>
      </Box>

      <Dialog
        open={isDeleteOpen}
        onClose={closeDelete}
        slotProps={{
          paper: {
            variant: 'glass',
            className: styles.deletePaper,
          },
        }}
        aria-labelledby="delete-character-title"
      >
        <Box className={styles.deleteBody}>
          <Typography id="delete-character-title" className={styles.deleteTitle}>
            Удалить персонажа?
          </Typography>
          <Typography className={styles.deleteText}>
            Это безвозвратное действие. Все выбранные части, цвета и история
            изменений будут удалены.
          </Typography>
          <Box className={styles.deleteActions}>
            <Button onClick={closeDelete} variant="glass" className={styles.deleteCancel}>
              Отмена
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="glassPrimary"
              className={styles.deleteConfirm}
            >
              Удалить
            </Button>
          </Box>
        </Box>
      </Dialog>

      <GenerateSettingsDialog
        open={isCreateOpen}
        onClose={closeCreate}
        characterName={name}
        generationType={type}
        onSave={handleCreate}
      />
    </>
  );
};
