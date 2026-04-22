import { useState, useCallback, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Slide from '@mui/material/Slide';

interface ColorPickerProps {
  colors?: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

const defaultColors = [
  '#FF6B6B', // Красный
  '#4ECDC4', // Бирюзовый
  '#45B7D1', // Голубой
  '#FFA07A', // Лососевый
  '#98D8C8', // Мятный
  '#F7DC6F', // Желтый
  '#BB8FCE', // Фиолетовый
  '#85C1E2', // Светло-голубой
];

const Transition = (props: { children: React.ReactElement }) => {
  return <Slide direction="up" {...props} />;
};

export const ColorPicker = ({ 
  colors = defaultColors, 
  selectedColor,
  onColorSelect 
}: ColorPickerProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const isOpeningRef = useRef(false);

  const displayColor = selectedColor || colors[0];
  const isMenuOpen = Boolean(menuAnchor);

  const handleColorButtonClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
    handleMenuClose();
  }, [onColorSelect, handleMenuClose]);

  const handleCustomColorClick = useCallback(() => {
    handleMenuClose();
    
    // Если модальное окно уже открыто или открывается, не открываем его снова
    if (isCustomColorOpen || isOpeningRef.current) {
      return;
    }
    
    isOpeningRef.current = true;
    
    // Если выбран кастомный цвет, используем его, иначе белый
    const initialColor = selectedColor && !colors.includes(selectedColor) 
      ? selectedColor 
      : '#FFFFFF';
    setCustomColor(initialColor);
    setIsCustomColorOpen(true);
    
    // Сбрасываем флаг после небольшой задержки
    setTimeout(() => {
      isOpeningRef.current = false;
    }, 100);
  }, [isCustomColorOpen, selectedColor, colors, handleMenuClose]);

  const handleCustomColorChange = useCallback((color: string) => {
    setCustomColor(color);
  }, []);

  const handleCustomColorConfirm = useCallback(() => {
    if (onColorSelect) {
      onColorSelect(customColor);
    }
    setIsCustomColorOpen(false);
    isOpeningRef.current = false;
  }, [onColorSelect, customColor]);

  const handleCustomColorCancel = useCallback((_event?: unknown, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown' || !reason) {
      setIsCustomColorOpen(false);
      isOpeningRef.current = false;
    }
  }, []);


  const isCustomColorSelected = selectedColor && !colors.includes(selectedColor);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          onClick={handleColorButtonClick}
          sx={{
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
            borderRadius: '50%',
            backgroundColor: displayColor,
            cursor: 'pointer',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              transform: 'scale(1.1)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          }}
          aria-label="Выбрать цвет"
        />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            marginTop: '8px',
            minWidth: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {colors.map((color, index) => (
          <MenuItem
            key={index}
            onClick={() => handleColorSelect(color)}
            sx={{
              padding: '4px 8px',
              borderRadius: '6px',
              marginBottom: index < colors.length - 1 ? '2px' : '4px',
              minHeight: '32px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid white' : '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: selectedColor === color 
                    ? '0 0 0 1px rgba(255, 255, 255, 0.3)' 
                    : 'none',
                  flexShrink: 0,
                }}
              />
            </Box>
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleCustomColorClick}
          sx={{
            padding: '4px 8px',
            borderRadius: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '2px',
            minHeight: '32px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: isCustomColorSelected 
                  ? '2px solid white' 
                  : '2px dashed rgba(255, 255, 255, 0.3)',
                backgroundColor: isCustomColorSelected ? selectedColor : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isCustomColorSelected 
                  ? '0 0 0 1px rgba(255, 255, 255, 0.3)' 
                  : 'none',
              }}
            >
              {!isCustomColorSelected && (
                <AddIcon sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />
              )}
            </Box>
          </Box>
        </MenuItem>
      </Menu>

      <Dialog
        open={isCustomColorOpen}
        onClose={handleCustomColorCancel}
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
          Выберите цвет
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              '& .react-colorful': {
                width: '100%',
                height: '120px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              },
              '& .react-colorful__saturation': {
                borderRadius: '10px 10px 0 0',
              },
              '& .react-colorful__hue': {
                height: '18px',
                borderRadius: '0 0 10px 10px',
              },
              '& .react-colorful__pointer': {
                width: '16px',
                height: '16px',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <HexColorPicker color={customColor} onChange={handleCustomColorChange} />
          </Box>
          <Box
            sx={{
              padding: '8px 14px',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 500,
              fontSize: '13px',
              textAlign: 'center',
              minWidth: '100px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: customColor,
            }}
          >
            {customColor}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={() => handleCustomColorCancel()}
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
            onClick={handleCustomColorConfirm}
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
            Применить
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

