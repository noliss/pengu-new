import { useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { BottomSheet } from '@shared/ui';
import type { GenerationType } from '@entities/character';
import styles from './GenerateSettingsDialog.module.scss';

interface GenerateSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  characterName?: string;
  generationType?: GenerationType;
  onSave?: (characterName: string, generationType: GenerationType) => void;
}

/**
 * Диалог «Создать персонажа» с pre-mount'ом (`keepMounted`) — рендерится
 * сразу при заходе на страницу генерации, чтобы первое открытие было без
 * лагов даже на слабых устройствах.
 *
 * Поскольку поддерево не размонтируется на close, инициализация `useState`
 * происходит только один раз. Чтобы при повторном open подхватывались
 * актуальные `characterName`/`generationType` из redux, синхронизируем
 * локальный стейт по транзишну `open: false → true` (паттерн «Adjust state
 * while rendering» — без useEffect и cascading-render'ов).
 */
export const GenerateSettingsDialog = ({
  open,
  onClose,
  characterName = '',
  generationType = 'sticker',
  onSave,
}: GenerateSettingsDialogProps) => {
  const [name, setName] = useState(characterName);
  const [type, setType] = useState<GenerationType>(generationType);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    // Синхронизируем только на момент открытия — пока пользователь печатает,
    // не хотим перетирать его ввод сменой redux-значений.
    if (open) {
      setName(characterName);
      setType(generationType);
    }
  }

  const handleSave = useCallback(() => {
    onSave?.(name, type);
    onClose();
  }, [name, type, onSave, onClose]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Создать персонажа" keepMounted>
      <TextField
        label="Название персонажа"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        className={styles.textField}
      />

      <Box className={styles.typeRow}>
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
          sx={{ margin: 0 }}
        />
      </Box>

      <Box className={styles.actions}>
        <Button onClick={onClose} variant="glass">
          Отмена
        </Button>
        <Button onClick={handleSave} variant="glassPrimary">
          Создать
        </Button>
      </Box>
    </BottomSheet>
  );
};
