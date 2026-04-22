import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import CasinoIcon from '@mui/icons-material/Casino';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { GenerateSettingsDialog } from '../GenerateSettingsDialog';
import styles from './GenerateActions.module.scss';

interface GenerateActionsProps {
  onUndo?: () => void;
  onRandom?: () => void;
  onReset?: () => void;
  onSettings?: () => void;
  onGenerate?: () => void;
  characterName?: string;
  generationType?: 'sticker' | 'emoji';
  onCharacterNameChange?: (name: string) => void;
  onGenerationTypeChange?: (type: 'sticker' | 'emoji') => void;
  onSave?: (characterName: string, generationType: 'sticker' | 'emoji') => void;
}

export const GenerateActions = ({
  onUndo,
  onRandom,
  onReset,
  onSettings,
  onGenerate,
  characterName,
  generationType,
  onCharacterNameChange,
  onGenerationTypeChange,
  onSave,
}: GenerateActionsProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleUndo = useCallback(() => {
    if (onUndo) {
      onUndo();
    }
  }, [onUndo]);

  const handleRandom = useCallback(() => {
    if (onRandom) {
      onRandom();
    }
  }, [onRandom]);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const handleSettings = useCallback(() => {
    setIsSettingsOpen(true);
    if (onSettings) {
      onSettings();
    }
  }, [onSettings]);

  const handleGenerate = useCallback(() => {
    if (onGenerate) {
      onGenerate();
    }
  }, [onGenerate]);

  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleSave = useCallback((name: string, type: 'sticker' | 'emoji') => {
    if (onSave) {
      onSave(name, type);
    } else {
      // Если onSave не передан, вызываем отдельные колбэки
      if (onCharacterNameChange) {
        onCharacterNameChange(name);
      }
      if (onGenerationTypeChange) {
        onGenerationTypeChange(type);
      }
    }
    setIsSettingsOpen(false);
  }, [onSave, onCharacterNameChange, onGenerationTypeChange]);

  return (
    <>
      <Box className={styles.container}>
        <Box className={styles.actionsGroup}>
          <IconButton
            className={styles.iconButton}
            onClick={handleUndo}
            aria-label="Отменить последнее действие"
            sx={{ color: 'white' }}
          >
            <UndoIcon />
          </IconButton>
          
          <IconButton
            className={styles.iconButton}
            onClick={handleRandom}
            aria-label="Случайный выбор"
            sx={{ color: 'white' }}
          >
            <CasinoIcon />
          </IconButton>
          
          <IconButton
            className={styles.iconButton}
            onClick={handleReset}
            aria-label="Сбросить"
            sx={{ color: 'white' }}
          >
            <RefreshIcon />
          </IconButton>
          
          <IconButton
            className={styles.iconButton}
            onClick={handleSettings}
            aria-label="Настройки"
            sx={{ color: 'white' }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
        
        <Button
          className={styles.generateButton}
          onClick={handleGenerate}
          sx={{ color: 'white', textTransform: 'none', borderRadius: '30px' }}
        >
          Generate
        </Button>
      </Box>

      <GenerateSettingsDialog
        open={isSettingsOpen}
        onClose={handleSettingsClose}
        characterName={characterName}
        generationType={generationType}
        onSave={handleSave}
      />
    </>
  );
};

