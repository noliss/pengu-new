import { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Slide from '@mui/material/Slide';
import cn from 'classnames';
import styles from './ColorPicker.module.scss';

interface ColorPickerProps {
  colors?: string[];
  selectedColor?: string | null;
  onColorSelect?: (color: string) => void;
}

const DEFAULT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

const Transition = (props: { children: React.ReactElement }) => <Slide direction="up" {...props} />;

export const ColorPicker = ({ colors = DEFAULT_COLORS, selectedColor, onColorSelect }: ColorPickerProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');

  const displayColor = selectedColor || colors[0];
  const isMenuOpen = Boolean(menuAnchor);
  const isCustomSelected = Boolean(selectedColor && !colors.includes(selectedColor));

  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  const handleSelect = useCallback(
    (color: string) => {
      onColorSelect?.(color);
      closeMenu();
    },
    [onColorSelect, closeMenu],
  );

  const handleOpenCustom = useCallback(() => {
    closeMenu();
    setCustomColor(isCustomSelected && selectedColor ? selectedColor : '#FFFFFF');
    setIsCustomOpen(true);
  }, [closeMenu, isCustomSelected, selectedColor]);

  const handleCustomConfirm = useCallback(() => {
    onColorSelect?.(customColor);
    setIsCustomOpen(false);
  }, [onColorSelect, customColor]);

  const handleCustomCancel = useCallback(() => setIsCustomOpen(false), []);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          className={styles.trigger}
          sx={{ backgroundColor: displayColor }}
          aria-label="Выбрать цвет"
        />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { className: styles.menuPaper } }}
      >
        {colors.map((color) => (
          <MenuItem key={color} onClick={() => handleSelect(color)} sx={{ borderRadius: 1, minHeight: 32 }}>
            <Box
              className={cn(styles.swatch, selectedColor === color ? styles.selected : styles.default)}
              sx={{ backgroundColor: color }}
            />
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleOpenCustom}
          sx={{
            borderRadius: 1,
            minHeight: 32,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: '2px',
          }}
        >
          <Box
            className={cn(styles.swatch, isCustomSelected ? styles.customSelected : styles.custom)}
            sx={isCustomSelected ? { backgroundColor: selectedColor ?? undefined } : undefined}
          >
            {!isCustomSelected && <AddIcon sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />}
          </Box>
        </MenuItem>
      </Menu>

      <Dialog
        open={isCustomOpen}
        onClose={handleCustomCancel}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={false}
        slotProps={{ paper: { variant: 'glassBottom', sx: { m: 0, p: 0, position: 'fixed', bottom: 0, left: 0, right: 0, width: '100vw', maxWidth: '100vw', boxSizing: 'border-box' } } }}
      >
        <Box className={styles.bottomSheet}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '15px', textAlign: 'center' }}>
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
