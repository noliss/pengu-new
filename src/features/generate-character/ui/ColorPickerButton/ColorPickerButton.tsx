import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { HexColorPicker } from 'react-colorful';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import cn from 'classnames';
import { BottomSheet } from '@shared/ui/BottomSheet/BottomSheet';
import styles from './ColorPickerButton.module.scss';

const HEX_REGEX = /^#([0-9a-fA-F]{6})$/;

const normalizeHex = (raw: string): string => {
  const trimmed = raw.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.slice(0, 7);
};

// --- HEX <-> RGB / HSL утилиты ---

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface RgbStrings {
  r: string;
  g: string;
  b: string;
}

interface HslStrings {
  h: string;
  s: string;
  l: string;
}

const channelToHex = (n: number): string => n.toString(16).padStart(2, '0').toUpperCase();

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  if (!HEX_REGEX.test(hex)) return null;
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
};

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;

const hexToRgbStrings = (hex: string): RgbStrings => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { r: '0', g: '0', b: '0' };
  return { r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) };
};

const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return {
    h: Math.round(h * 360) % 360,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};


const hslToHex = (h: number, s: number, l: number): string => {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = lNorm - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(v * 255);
  };
  return rgbToHex(f(0), f(8), f(4));
};

const hexToHslStrings = (hex: string): HslStrings => {
  const hsl = hexToHsl(hex);
  if (!hsl) return { h: '0', s: '0', l: '0' };
  return { h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) };
};

// Парсит «канал»: только цифры 0..max, иначе null. Пустую строку считаем
// невалидной — не коммитим, но в input оставляем, чтобы пользователь спокойно
// стирал и допечатывал. max берём из конкретного канала (255 для RGB, 360
// для H, 100 для S/L).
const parseChannel = (raw: string, max: number): number | null => {
  if (!/^\d{1,3}$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
};

const RGB_CHANNELS: ReadonlyArray<{ key: keyof RgbStrings; label: string; aria: string }> = [
  { key: 'r', label: 'R', aria: 'Красный канал (0–255)' },
  { key: 'g', label: 'G', aria: 'Зелёный канал (0–255)' },
  { key: 'b', label: 'B', aria: 'Синий канал (0–255)' },
];

const HSL_CHANNELS: ReadonlyArray<{ key: keyof HslStrings; label: string; aria: string }> = [
  { key: 'h', label: 'H', aria: 'Тон (0–360°)' },
  { key: 's', label: 'S', aria: 'Насыщенность (0–100%)' },
  { key: 'l', label: 'L', aria: 'Светлота (0–100%)' },
];

const HSL_MAX: Record<keyof HslStrings, number> = { h: 360, s: 100, l: 100 };

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isCustomSelected = useMemo(
    () => Boolean(selectedColor && !colors.includes(selectedColor)),
    [selectedColor, colors],
  );

  const pickerValue = selectedColor ?? '#FFFFFF';

  // Локальные состояния picker'а: обновляются синхронно на каждое событие,
  // чтобы UI (pointer picker'а, превью-swatch, hex/rgb-инпуты) был отзывчивым,
  // а в redux улетает только "последний коммит" после паузы (debounce).
  // liveColor — единственная правда (всегда HEX). hexInput / rgbInput — это
  // зеркала под ввод пользователя (могут быть промежуточно-невалидными).
  const [liveColor, setLiveColor] = useState(pickerValue);
  const [hexInput, setHexInput] = useState(pickerValue);
  const [rgbInput, setRgbInput] = useState<RgbStrings>(() => hexToRgbStrings(pickerValue));
  const [hslInput, setHslInput] = useState<HslStrings>(() => hexToHslStrings(pickerValue));
  const [format, setFormat] = useState<ColorFormat>('hex');
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
  // Делаем во время рендера (паттерн "Adjust state while rendering"), чтобы не
  // плодить cascading render'ы из useEffect.
  const [prevSheetOpen, setPrevSheetOpen] = useState(sheetOpen);
  if (sheetOpen !== prevSheetOpen) {
    setPrevSheetOpen(sheetOpen);
    if (sheetOpen) {
      const hex = pickerValue.toUpperCase();
      setLiveColor(hex);
      setHexInput(hex);
      setRgbInput(hexToRgbStrings(hex));
      setHslInput(hexToHslStrings(hex));
    }
  }

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
      const hex = color.toUpperCase();
      setLiveColor(hex);
      setHexInput(hex);
      setRgbInput(hexToRgbStrings(hex));
      setHslInput(hexToHslStrings(hex));
      scheduleColor(hex);
    },
    [scheduleColor],
  );

  const handleHexChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = normalizeHex(e.target.value);
      setHexInput(next);
      if (HEX_REGEX.test(next)) {
        const upper = next.toUpperCase();
        setLiveColor(upper);
        setRgbInput(hexToRgbStrings(upper));
        setHslInput(hexToHslStrings(upper));
        scheduleColor(upper);
      }
    },
    [scheduleColor],
  );

  const handleRgbChange = useCallback(
    (channel: keyof RgbStrings) => (e: ChangeEvent<HTMLInputElement>) => {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 3);
      const nextRgb: RgbStrings = { ...rgbInput, [channel]: sanitized };
      setRgbInput(nextRgb);
      const r = parseChannel(nextRgb.r, 255);
      const g = parseChannel(nextRgb.g, 255);
      const b = parseChannel(nextRgb.b, 255);
      if (r != null && g != null && b != null) {
        const hex = rgbToHex(r, g, b);
        setLiveColor(hex);
        setHexInput(hex);
        setHslInput(hexToHslStrings(hex));
        scheduleColor(hex);
      }
    },
    [rgbInput, scheduleColor],
  );

  const handleRgbBlur = useCallback(
    (channel: keyof RgbStrings) => () => {
      if (parseChannel(rgbInput[channel], 255) != null) return;
      setRgbInput(hexToRgbStrings(liveColor));
    },
    [rgbInput, liveColor],
  );

  const handleHslChange = useCallback(
    (channel: keyof HslStrings) => (e: ChangeEvent<HTMLInputElement>) => {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 3);
      const nextHsl: HslStrings = { ...hslInput, [channel]: sanitized };
      setHslInput(nextHsl);
      const h = parseChannel(nextHsl.h, HSL_MAX.h);
      const s = parseChannel(nextHsl.s, HSL_MAX.s);
      const l = parseChannel(nextHsl.l, HSL_MAX.l);
      if (h != null && s != null && l != null) {
        const hex = hslToHex(h, s, l);
        setLiveColor(hex);
        setHexInput(hex);
        setRgbInput(hexToRgbStrings(hex));
        scheduleColor(hex);
      }
    },
    [hslInput, scheduleColor],
  );

  const handleHslBlur = useCallback(
    (channel: keyof HslStrings) => () => {
      if (parseChannel(hslInput[channel], HSL_MAX[channel]) != null) return;
      setHslInput(hexToHslStrings(liveColor));
    },
    [hslInput, liveColor],
  );

  const handleCopy = useCallback(async () => {
    try {
      let text = liveColor;
      if (format === 'rgb') {
        const rgb = hexToRgb(liveColor);
        if (rgb) text = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      } else if (format === 'hsl') {
        const hsl = hexToHsl(liveColor);
        if (hsl) text = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      }
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard недоступен (старые браузеры / нет permissions) — молча игнорируем
    }
  }, [liveColor, format]);

  return (
    <>
      <button
        ref={setAnchorEl}
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
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Pre-mount: страница генерации горячая, swatches должны
        // прорастать без задержки. Popover лёгкий, держать его в DOM дёшево.
        keepMounted
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

      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        // Backdrop прозрачный: sheet полупрозрачный, хочется видеть пингвина
        // позади, чтобы на лету оценивать выбранный цвет.
        backdrop="transparent"
        // HexColorPicker — самый тяжёлый dialog на странице (canvas-style
        // picker + drag-to-close + дебаунс). Pre-mount убирает заметный
        // тормоз при первом «свой цвет» на слабых устройствах.
        keepMounted
        bodyClassName={styles.compactBody}
      >
        <Box className={styles.pickerWrapper}>
          <HexColorPicker color={liveColor} onChange={handlePickerChange} />
        </Box>


        <Box className={styles.formatToggle} role="tablist" aria-label="Формат цвета">
          {(['hex', 'rgb', 'hsl'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={format === mode}
              className={cn(styles.formatTab, {
                [styles.formatTabActive]: format === mode,
              })}
              onClick={() => setFormat(mode)}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </Box>

        <Box className={styles.hexRow}>
          <Box className={styles.hexField}>
            <Box
              className={styles.hexSwatch}
              style={{ backgroundColor: liveColor }}
              aria-hidden
            />
            {format === 'hex' && (
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
            )}
            {format === 'rgb' && (
              <Box className={styles.rgbInputs} role="group" aria-label="RGB-каналы">
                {RGB_CHANNELS.map(({ key, label, aria }) => (
                  <Box key={key} className={styles.rgbChannel}>
                    <span className={styles.rgbLabel} aria-hidden>
                      {label}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className={styles.rgbInput}
                      value={rgbInput[key]}
                      onChange={handleRgbChange(key)}
                      onBlur={handleRgbBlur(key)}
                      spellCheck={false}
                      autoComplete="off"
                      maxLength={3}
                      aria-label={aria}
                    />
                  </Box>
                ))}
              </Box>
            )}
            {format === 'hsl' && (
              <Box className={styles.rgbInputs} role="group" aria-label="HSL-каналы">
                {HSL_CHANNELS.map(({ key, label, aria }) => (
                  <Box key={key} className={styles.rgbChannel}>
                    <span className={styles.rgbLabel} aria-hidden>
                      {label}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className={styles.rgbInput}
                      value={hslInput[key]}
                      onChange={handleHslChange(key)}
                      onBlur={handleHslBlur(key)}
                      spellCheck={false}
                      autoComplete="off"
                      maxLength={3}
                      aria-label={aria}
                    />
                  </Box>
                ))}
              </Box>
            )}
            <IconButton
              size="small"
              className={styles.hexCopy}
              onClick={handleCopy}
              aria-label={copied ? 'Скопировано' : 'Скопировать'}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Box>

          <IconButton
            size="small"
            className={styles.hexApply}
            onClick={closeSheet}
            aria-label="Применить цвет"
          >
            <CheckRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </BottomSheet>
    </>
  );
};
