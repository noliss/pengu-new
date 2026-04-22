import { useCallback, useState, type ReactElement } from 'react';
import { HexColorPicker } from 'react-colorful';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import cn from 'classnames';
import styles from './ColorPalette.module.scss';

interface ColorPaletteProps {
  colors?: string[];
  selectedColor?: string | null;
  onColorSelect?: (color: string) => void;
  allowCustom?: boolean;
  /** Компактные swatches — для мест с ограниченной шириной (напр. bottom-sheet) */
  compact?: boolean;
}

const FALLBACK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

const Transition = (props: { children: ReactElement }) => <Slide direction="up" {...props} />;

/**
 * Inline-палитра цветов: ряд swatches + кнопка "свой цвет" (открывает диалог с HexColorPicker).
 * Используется в местах, где есть достаточно места для раскладки (например, bottom sheet).
 */
export const ColorPalette = ({
  colors = FALLBACK_COLORS,
  selectedColor,
  onColorSelect,
  allowCustom = true,
  compact = false,
}: ColorPaletteProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');

  const isCustomSelected = Boolean(selectedColor && !colors.includes(selectedColor));

  const openCustom = useCallback(() => {
    setCustomColor(isCustomSelected && selectedColor ? selectedColor : '#FFFFFF');
    setIsCustomOpen(true);
  }, [isCustomSelected, selectedColor]);

  const handleCustomConfirm = useCallback(() => {
    onColorSelect?.(customColor);
    setIsCustomOpen(false);
  }, [customColor, onColorSelect]);

  const handleCustomCancel = useCallback(() => setIsCustomOpen(false), []);

  return (
    <>
      <Box className={cn(styles.grid, { [styles.gridCompact]: compact })}>
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <button
              key={color}
              type="button"
              className={cn(styles.swatch, { [styles.selected]: isSelected, [styles.compact]: compact })}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect?.(color)}
              aria-label={`Цвет ${color}`}
              aria-pressed={isSelected}
            />
          );
        })}
        {allowCustom && (
          <button
            type="button"
            className={cn(styles.swatch, styles.customSwatch, {
              [styles.selected]: isCustomSelected,
              [styles.compact]: compact,
            })}
            style={isCustomSelected && selectedColor ? { backgroundColor: selectedColor } : undefined}
            onClick={openCustom}
            aria-label="Свой цвет"
            aria-pressed={isCustomSelected}
          >
            {!isCustomSelected && <AddIcon sx={{ fontSize: compact ? 14 : 16 }} />}
          </button>
        )}
      </Box>

      <Dialog
        open={isCustomOpen}
        onClose={handleCustomCancel}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={false}
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
        <Box className={styles.bottomSheet}>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 600, fontSize: '15px', textAlign: 'center' }}
          >
            Выберите цвет
          </Typography>
          <Box className={styles.pickerWrapper}>
            <HexColorPicker color={customColor} onChange={setCustomColor} />
          </Box>
          <Box className={styles.colorPreview} sx={{ background: customColor }}>
            {customColor}
          </Box>
          <Box className={styles.actions}>
            <Button onClick={handleCustomCancel} variant="glass">
              Отмена
            </Button>
            <Button onClick={handleCustomConfirm} variant="glassPrimary">
              Применить
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
