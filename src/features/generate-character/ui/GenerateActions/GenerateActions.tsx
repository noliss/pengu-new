import { memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import CasinoIcon from '@mui/icons-material/Casino';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  selectCanUndo,
  undoDraft,
  randomizeDraft,
} from '@entities/character';
import { GradientButton } from '../GradientButton';
import styles from './GenerateActions.module.scss';

interface GenerateActionsProps {
  partIds: string[];
  svgIds: string[];
  colors: string[];
  onOpenCreate: () => void;
  onOpenDelete: () => void;
}

const GenerateActionsComponent = ({
  partIds,
  svgIds,
  colors,
  onOpenCreate,
  onOpenDelete,
}: GenerateActionsProps) => {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);

  const handleUndo = useCallback(() => dispatch(undoDraft()), [dispatch]);
  const handleRandom = useCallback(
    () => dispatch(randomizeDraft({ partIds, svgIds, colors })),
    [dispatch, partIds, svgIds, colors],
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
          onClick={onOpenDelete}
          aria-label="Удалить персонажа"
        >
          <DeleteOutlineIcon />
        </IconButton>

        <GradientButton className={styles.generateButton} onClick={onOpenCreate}>
          Generate
        </GradientButton>
      </Box>
    </>
  );
};

export const GenerateActions = memo(GenerateActionsComponent);
