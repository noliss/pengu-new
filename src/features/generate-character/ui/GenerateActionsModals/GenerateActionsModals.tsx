import { memo, useCallback } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { BottomSheet } from '@shared/ui';
import {
  selectCharacterName,
  selectGenerationType,
  setCharacterName,
  setGenerationType,
  resetDraft,
} from '@entities/character';
import type { GenerationType } from '@entities/character';
import { GenerateSettingsDialog } from '../GenerateSettingsDialog';
import styles from '../GenerateActions/GenerateActions.module.scss';

export interface GenerateActionsModalsProps {
  createOpen: boolean;
  deleteOpen: boolean;
  onCloseCreate: () => void;
  onCloseDelete: () => void;
  onGenerate?: () => void;
}

const GenerateActionsModalsComponent = ({
  createOpen,
  deleteOpen,
  onCloseCreate,
  onCloseDelete,
  onGenerate,
}: GenerateActionsModalsProps) => {
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectCharacterName);
  const type = useAppSelector(selectGenerationType);

  const handleConfirmDelete = useCallback(() => {
    dispatch(resetDraft());
    onCloseDelete();
  }, [dispatch, onCloseDelete]);

  const handleCreate = useCallback(
    (newName: string, newType: GenerationType) => {
      dispatch(setCharacterName(newName));
      dispatch(setGenerationType(newType));
      onCloseCreate();
      onGenerate?.();
    },
    [dispatch, onCloseCreate, onGenerate],
  );

  return (
    <>
      <BottomSheet
        open={deleteOpen}
        onClose={onCloseDelete}
        title="Удалить персонажа?"
        titleId="delete-character-title"
        keepMounted
        disableScrollLock
        actions={
          <>
            <Button onClick={onCloseDelete} variant="glass">
              Отмена
            </Button>
            <Button onClick={handleConfirmDelete} variant="glassDestructive">
              Удалить
            </Button>
          </>
        }
      >
        <Typography className={styles.deleteText}>
          Это безвозвратное действие. Все выбранные части, цвета и история
          изменений будут удалены.
        </Typography>
      </BottomSheet>

      <GenerateSettingsDialog
        open={createOpen}
        onClose={onCloseCreate}
        characterName={name}
        generationType={type}
        onSave={handleCreate}
        disableScrollLock
      />
    </>
  );
};

export const GenerateActionsModals = memo(GenerateActionsModalsComponent);
