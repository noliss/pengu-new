import { useCallback, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

interface GenerateSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  characterName?: string;
  generationType?: 'sticker' | 'emoji';
  onSave?: (characterName: string, generationType: 'sticker' | 'emoji') => void;
}

const Transition = (props: { children: React.ReactElement }) => {
  return <Slide direction="up" {...props} />;
};

export const GenerateSettingsDialog = ({
  open,
  onClose,
  characterName: initialCharacterName = '',
  generationType: initialGenerationType = 'sticker',
  onSave,
}: GenerateSettingsDialogProps) => {
  const [characterName, setCharacterName] = useState(initialCharacterName);
  const [generationType, setGenerationType] = useState<'sticker' | 'emoji'>(initialGenerationType);

  // Синхронизация с внешними значениями при открытии модального окна
  useEffect(() => {
    if (open) {
      setCharacterName(initialCharacterName);
      setGenerationType(initialGenerationType);
    }
  }, [open, initialCharacterName, initialGenerationType]);

  const handleCharacterNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value);
  }, []);

  const handleGenerationTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.checked ? 'emoji' : 'sticker';
    setGenerationType(newType);
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(characterName, generationType);
    }
    onClose();
  }, [characterName, generationType, onSave, onClose]);

  const handleCancel = useCallback(() => {
    // Сбрасываем значения к исходным
    setCharacterName(initialCharacterName);
    setGenerationType(initialGenerationType);
    onClose();
  }, [initialCharacterName, initialGenerationType, onClose]);

  const handleClose = useCallback((_event?: unknown, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      handleCancel();
    }
  }, [handleCancel]);

  const isEmoji = generationType === 'emoji';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={false}
      keepMounted={false}
      sx={{
        '& .MuiDialog-container': {
          margin: 0,
          padding: 0,
        },
      }}
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: '14px',
          margin: 0,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100vw',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          marginBottom: '12px', 
          color: 'white', 
          fontWeight: 600, 
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        Настройки
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <TextField
          label="Название персонажа"
          value={characterName}
          onChange={handleCharacterNameChange}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontSize: '13px',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '13px',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={isEmoji}
                onChange={handleGenerationTypeChange}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      color: 'white',
                      '& + .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            }
            label={
              <Typography 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '13px',
                  fontWeight: 500,
                  marginLeft: '8px',
                }}
              >
                {isEmoji ? 'Эмодзи' : 'Стикер'}
              </Typography>
            }
            sx={{
              margin: 0,
              flex: 1,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              onClick={handleCancel}
              sx={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '12px',
                minWidth: '70px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              sx={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '12px',
                minWidth: '70px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

