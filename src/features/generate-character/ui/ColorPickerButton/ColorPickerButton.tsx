import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { HexColorPicker } from 'react-colorful';
import Popover from '@mui/material/Popover';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import cn from 'classnames';
import styles from './ColorPickerButton.module.scss';

const HEX_REGEX = /^#([0-9a-fA-F]{6})$/;

const normalizeHex = (raw: string): string => {
  const trimmed = raw.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.slice(0, 7);
};

interface ColorPickerButtonProps {
  /** Список пресет-цветов */
  colors: string[];
  /** Текущий выбранный цвет (может быть не из пресета — тогда это кастомный) */
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

/**
 * Триггер-кнопка выбора цвета.
 * - По тапу выпадает вертикальный popover с пресетами + dashed "свой цвет".
 * - По "свой цвет" снизу выезжает компактный sheet с HexColorPicker.
 *   Цвет применяется real-time (onChange), чтобы пингвин обновлялся на лету;
 *   кнопка "Готово" просто закрывает sheet.
 */
// Задержка между движением picker'а и применением цвета в redux/persist.
const COLOR_COMMIT_DELAY_MS = 140;

export const ColorPickerButton = ({
  colors,
  selectedColor,
  onColorSelect,
  disabled,
}: ColorPickerButtonProps) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isCustomSelected = useMemo(
    () => Boolean(selectedColor && !colors.includes(selectedColor)),
    [selectedColor, colors],
  );

  const pickerValue = selectedColor ?? '#FFFFFF';

  // Локальные состояния picker'а: обновляются синхронно на каждое событие,
  // чтобы UI (pointer picker'а, превью-swatch, hex-инпут) был отзывчивым,
  // а в redux улетает только "последний коммит" после паузы (debounce).
  const [liveColor, setLiveColor] = useState(pickerValue);
  const [hexInput, setHexInput] = useState(pickerValue);
  const [copied, setCopied] = useState(false);

  // Таймер дебаунса + последнее запланированное значение. Держим в ref,
  // чтобы flush при закрытии sheet'а или unmount'е не потерял последний цвет.
  const debounceRef = useRef<number | null>(null);
  const pendingColorRef = useRef<string | null>(null);

  const flushPending = useCallback(() => {
    if (debounceRef.current != null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (pendingColorRef.current != null) {
      const color = pendingColorRef.current;
      pendingColorRef.current = null;
      onColorSelect(color);
    }
  }, [onColorSelect]);

  const scheduleColor = useCallback(
    (color: string) => {
      pendingColorRef.current = color;
      if (debounceRef.current != null) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null;
        if (pendingColorRef.current != null) {
          const next = pendingColorRef.current;
          pendingColorRef.current = null;
          onColorSelect(next);
        }
      }, COLOR_COMMIT_DELAY_MS);
    },
    [onColorSelect],
  );

  // При открытии sheet'а синхронизируем локальные состояния с актуальным выбором.
  useEffect(() => {
    if (sheetOpen) {
      setLiveColor(pickerValue);
      setHexInput(pickerValue.toUpperCase());
    }
  }, [sheetOpen, pickerValue]);

  // На unmount очищаем таймер и применяем последнее значение, чтобы не потерять.
  useEffect(() => {
    return () => {
      flushPending();
    };
  }, [flushPending]);

  const openPopover = useCallback(() => setPopoverOpen(true), []);
  const closePopover = useCallback(() => setPopoverOpen(false), []);

  const handleSwatch = useCallback(
    (color: string) => {
      // Пресет выбирается дискретно — пишем сразу, минуя debounce.
      flushPending();
      onColorSelect(color);
      closePopover();
    },
    [onColorSelect, closePopover, flushPending],
  );

  const openSheet = useCallback(() => {
    closePopover();
    setSheetOpen(true);
  }, [closePopover]);

  const closeSheet = useCallback(() => {
    // Закрытие — хороший момент убедиться, что последний цвет сохранён.
    flushPending();
    setSheetOpen(false);
  }, [flushPending]);

  const handlePickerChange = useCallback(
    (color: string) => {
      setLiveColor(color);
      setHexInput(color.toUpperCase());
      scheduleColor(color);
    },
    [scheduleColor],
  );

  const handleHexChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = normalizeHex(e.target.value);
      setHexInput(next);
      if (HEX_REGEX.test(next)) {
        setLiveColor(next);
        scheduleColor(next);
      }
    },
    [scheduleColor],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(liveColor);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard недоступен (старые браузеры / нет permissions) — молча игнорируем
    }
  }, [liveColor]);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={cn(styles.trigger, {
          [styles.empty]: !selectedColor,
          [styles.active]: popoverOpen || sheetOpen,
        })}
        style={selectedColor ? { backgroundColor: selectedColor } : undefined}
        onClick={openPopover}
        disabled={disabled}
        aria-label="Выбрать цвет"
        aria-haspopup="dialog"
        aria-expanded={popoverOpen}
      >
        {!selectedColor && <PaletteOutlinedIcon className={styles.triggerIcon} />}
      </button>

      <Popover
        open={popoverOpen}
        anchorEl={anchorRef.current}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            className: styles.popoverPaper,
            elevation: 0,
          },
        }}
      >
        <Box className={styles.palette} role="listbox" aria-label="Цвета">
          {colors.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                className={cn(styles.swatch, { [styles.selected]: isSelected })}
                style={{ backgroundColor: color }}
                onClick={() => handleSwatch(color)}
                aria-label={`Цвет ${color}`}
                aria-pressed={isSelected}
              />
            );
          })}
          <button
            type="button"
            className={cn(styles.swatch, styles.customSwatch, {
              [styles.selected]: isCustomSelected,
            })}
            style={isCustomSelected && selectedColor ? { backgroundColor: selectedColor } : undefined}
            onClick={openSheet}
            aria-label="Свой цвет"
            aria-pressed={isCustomSelected}
          >
            {!isCustomSelected && <AddIcon sx={{ fontSize: 12 }} />}
          </button>
        </Box>
      </Popover>

      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={closeSheet}
        slotProps={{
          paper: { className: styles.sheetPaper, elevation: 0 },
          backdrop: { className: styles.sheetBackdrop },
        }}
      >
        <Box className={styles.sheet} role="dialog" aria-label="Свой цвет">
          <Box className={styles.sheetGrip} aria-hidden />
          <Box className={styles.pickerWrapper}>
            <HexColorPicker color={liveColor} onChange={handlePickerChange} />
          </Box>

          <Box className={styles.hexField}>
            <Box
              className={styles.hexSwatch}
              style={{ backgroundColor: liveColor }}
              aria-hidden
            />
            <input
              type="text"
              className={styles.hexInput}
              value={hexInput}
              onChange={handleHexChange}
              spellCheck={false}
              autoComplete="off"
              maxLength={7}
              aria-label="HEX-код цвета"
            />
            <IconButton
              size="small"
              className={styles.hexCopy}
              onClick={handleCopy}
              aria-label={copied ? 'Скопировано' : 'Скопировать'}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Box>

          <Button
            className={styles.sheetDone}
            onClick={closeSheet}
            fullWidth
            variant="text"
          >
            Готово
          </Button>
        </Box>
      </Drawer>
    </>
  );
};
