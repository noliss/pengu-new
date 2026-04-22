import { useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import type { GenerationType } from '@entities/character';
import styles from './GenerateSettingsDialog.module.scss';

interface GenerateSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  characterName?: string;
  generationType?: GenerationType;
  onSave?: (characterName: string, generationType: GenerationType) => void;
}

const Transition = (props: { children: React.ReactElement }) => <Slide direction="up" {...props} />;

/**
 * Внутренняя форма с state — монтируется заново при каждом открытии диалога
 * (diplom: keepMounted={false} у Dialog + компонент условно рендерится),
 * поэтому initial-значения подтягиваются через useState без useEffect.
 */
const SettingsForm = ({
  initialName,
  initialType,
  onClose,
  onSave,
}: {
  initialName: string;
  initialType: GenerationType;
  onClose: () => void;
  onSave?: (name: string, type: GenerationType) => void;
}) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<GenerationType>(initialType);

  const handleSave = useCallback(() => {
    onSave?.(name, type);
    onClose();
  }, [name, type, onSave, onClose]);

  return (
    <Box className={styles.body}>
      <Typography variant="h6" className={styles.title}>
        Настройки
      </Typography>

      <TextField
        label="Название персонажа"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        className={styles.textField}
      />

      <Box className={styles.row}>
        <FormControlLabel
          control={
            <Switch
              checked={type === 'emoji'}
              onChange={(e) => setType(e.target.checked ? 'emoji' : 'sticker')}
            />
          }
          label={
            <Typography className={styles.switchLabel}>
              {type === 'emoji' ? 'Эмодзи' : 'Стикер'}
            </Typography>
          }
          sx={{ margin: 0, flex: 1 }}
        />

        <Box className={styles.actions}>
          <Button onClick={onClose} variant="glass">
            Отмена
          </Button>
          <Button onClick={handleSave} variant="glassPrimary">
            Сохранить
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const GenerateSettingsDialog = ({
  open,
  onClose,
  characterName = '',
  generationType = 'sticker',
  onSave,
}: GenerateSettingsDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
    fullWidth
    maxWidth={false}
    keepMounted={false}
    slotProps={{
      paper: {
        variant: 'glassBottom',
        sx: {
          m: 0,
          p: 0,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100vw',
          maxWidth: '100vw',
          boxSizing: 'border-box',
        },
      },
    }}
  >
    {open && (
      <SettingsForm
        initialName={characterName}
        initialType={generationType}
        onClose={onClose}
        onSave={onSave}
      />
    )}
  </Dialog>
);
