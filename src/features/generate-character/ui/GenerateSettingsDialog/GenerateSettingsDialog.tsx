import { useCallback, useState, type CSSProperties } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import cn from 'classnames';
import { BottomSheet } from '@shared/ui/BottomSheet/BottomSheet';
import type { GenerationType } from '@entities/character';
import { GradientButton } from '../GradientButton';
import styles from './GenerateSettingsDialog.module.scss';

interface GenerateSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  characterName?: string;
  generationType?: GenerationType;
  onSave?: (characterName: string, generationType: GenerationType) => void;
  /** `disableScrollLock` у Drawer/Modal (страница генерации и т.п.). */
  disableScrollLock?: boolean;
}


const TYPE_OPTIONS: ReadonlyArray<{
  value: GenerationType;
  label: string;
  placeholder: string;
  Icon: typeof StickyNote2OutlinedIcon;
}> = [
  {
    value: 'sticker',
    label: 'Стикер',
    placeholder: 'Название стикер-пака',
    Icon: StickyNote2OutlinedIcon,
  },
  {
    value: 'emoji',
    label: 'Эмодзи',
    placeholder: 'Название эмодзи-пака',
    Icon: EmojiEmotionsOutlinedIcon,
  },
];


export const GenerateSettingsDialog = ({
  open,
  onClose,
  characterName = '',
  generationType = 'sticker',
  onSave,
  disableScrollLock = false,
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

  const placeholder =
    TYPE_OPTIONS.find((o) => o.value === type)?.placeholder ?? 'Название';

  const activeIdx = Math.max(
    0,
    TYPE_OPTIONS.findIndex((o) => o.value === type),
  );

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Создать персонажа"
      keepMounted
      disableScrollLock={disableScrollLock}
    >
      <TextField
        label={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        className={styles.textField}
      />

      <Box className={styles.actions}>
        <Box
          className={styles.typeToggle}
          role="radiogroup"
          aria-label="Тип генерации"
          style={{ '--toggle-idx': activeIdx } as CSSProperties}
        >
          <span className={styles.typeThumb} aria-hidden />
          {TYPE_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = type === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={label}
                title={label}
                className={cn(styles.typeOption, { [styles.typeOptionActive]: isActive })}
                onClick={() => setType(value)}
              >
                <Icon className={styles.typeOptionIcon} />
              </button>
            );
          })}
        </Box>

        <GradientButton onClick={handleSave} className={styles.createButton}>
          Generate
        </GradientButton>
      </Box>
    </BottomSheet>
  );
};
