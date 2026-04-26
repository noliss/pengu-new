import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import cn from 'classnames';
import styles from './BottomSheet.module.scss';

// Пороги drag-to-close: или достаточно далеко утянули вниз,
// или бросили быстрым flick-жестом (px/ms).
const DRAG_CLOSE_DISTANCE_PX = 80;
const DRAG_CLOSE_VELOCITY = 0.6;

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Заголовок сверху (центрированный). Если не задан — блок не рендерится. */
  title?: ReactNode;
  /** Основное содержимое. */
  children: ReactNode;
  /**
   * Ряд кнопок действий (обычно 1–2 `<Button>`). Если не задан — футер скрыт.
   * Дефолт-раскладка: flex-row, gap=8px, каждая кнопка `flex: 1`.
   */
  actions?: ReactNode;
  /**
   * `default` — штатный backdrop из MUI (затемнение + лёгкий blur).
   * `transparent` — почти прозрачный без blur: нужно там, где поверх sheet'а
   * важно видеть контент под ним (например, пингвин при выборе цвета).
   */
  backdrop?: 'default' | 'transparent';
  /**
   * Показать маленький "ручку" сверху (iOS-style) — намёк на то, что sheet
   * можно свайпнуть вниз. По умолчанию включено: хотим единый UX
   * "тянущегося снизу" на всех диалогах. Выключать — только если мешает.
   */
  showGrip?: boolean;
  /** Дополнительный класс на `.body` (редко нужен — для тонких подкруток). */
  bodyClassName?: string;
  /** id заголовка — если передан, используется как `aria-labelledby` у Dialog. */
  titleId?: string;
  /**
   * Если `true`, MUI Dialog не размонтирует поддерево после закрытия
   * (скрыто в DOM). Удобно для часто открываемых sheet'ов.
   */
  keepMounted?: boolean;
  /**
   * Отключает scroll lock у Modal (padding на `body`, блокировка скролла).
   * На странице генерации в связке с Lottie + `backdrop-filter` + фикс-навом
   * это часто снимает заметный фриз при первом открытии sheet'а.
   */
  disableScrollLock?: boolean;
  /** Доп. `slotProps` у MUI Dialog (редко). */
  slotProps?: DialogProps['slotProps'];
}

/**
 * Единый bottom-sheet проекта.
 *
 * MUI `<Dialog>` с glassBottom-paper у нижнего края; переходы отключены
 * (`transitionDuration: 0`). Каркас (padding, заголовок, grip, backdrop)
 * собран здесь.
 *
 * Drag-to-close: по нажатию и тяге вниз за grip-ручку paper смещается
 * вслед за пальцем/курсором; при отпускании либо закрывается (если
 * утянули достаточно далеко или бросили быстрым flick'ом), либо
 * отпрыгивает обратно. Работает и на touch, и на mouse через
 * Pointer Events (без внешней библиотеки).
 *
 * Используется:
 * - `GenerateSettingsDialog` — форма "Создать персонажа";
 * - confirm-диалог удаления в `GenerateActions`;
 * - кастомный color-picker в `ColorPickerButton`.
 */
export const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  actions,
  backdrop = 'default',
  showGrip = true,
  bodyClassName,
  titleId,
  keepMounted = false,
  disableScrollLock = false,
  slotProps,
}: BottomSheetProps) => {
  const backdropClassName =
    backdrop === 'transparent' ? styles.backdropTransparent : undefined;

  // Ref на Paper и состояние drag-жеста. Держим всё в ref'ах, чтобы не
  // триггерить ре-рендеры на каждом pointermove (60+ fps).
  const paperRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startY: number; lastY: number; lastT: number } | null>(null);

  // При каждом новом открытии сбрасываем возможные остатки inline-стилей:
  // после закрытия drag'ом на paper остаётся transform/transition.
  // Если не почистить — следующее открытие начнётся с неправильной точки.
  useEffect(() => {
    if (!open) return;
    const paper = paperRef.current;
    if (paper) {
      paper.style.transform = '';
      paper.style.transition = '';
    }
  }, [open]);

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    // Игнорируем правую кнопку мыши и случайные PEN/модификаторы.
    if (e.button !== undefined && e.button !== 0) return;
    const paper = paperRef.current;
    if (!paper) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    paper.style.transition = 'none';
    dragRef.current = {
      startY: e.clientY,
      lastY: e.clientY,
      lastT: e.timeStamp,
    };
  }, []);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const paper = paperRef.current;
    if (!drag || !paper) return;
    const delta = e.clientY - drag.startY;
    // Разрешаем только движение вниз — вверх игнорируется.
    const clamped = delta > 0 ? delta : 0;
    paper.style.transform = clamped > 0 ? `translateY(${clamped}px)` : '';
    drag.lastY = e.clientY;
    drag.lastT = e.timeStamp;
  }, []);

  const handleGripKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      // Для клавиатурных пользователей grip работает просто как "закрыть".
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      const paper = paperRef.current;
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // pointer мог уже не быть captured (cancel / системное прерывание).
      }
      if (!drag || !paper) return;

      const delta = Math.max(0, e.clientY - drag.startY);
      // Скорость только "в последнем кадре" — грубая, но её хватает,
      // чтобы отличить быстрый flick от медленного перетаскивания.
      const dt = Math.max(1, e.timeStamp - drag.lastT);
      const velocity = (e.clientY - drag.lastY) / dt;
      const shouldClose =
        delta > DRAG_CLOSE_DISTANCE_PX || velocity > DRAG_CLOSE_VELOCITY;

      paper.style.transition = 'none';
      paper.style.transform = '';
      if (shouldClose) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      transitionDuration={0}
      fullWidth
      maxWidth={false}
      keepMounted={keepMounted}
      disableScrollLock={disableScrollLock}
      aria-labelledby={title && titleId ? titleId : undefined}
      slotProps={{
        ...slotProps,
        paper: {
          variant: 'glassBottom',
          className: styles.paper,
          elevation: 0,
          ref: paperRef,
        },
        ...(backdropClassName
          ? { backdrop: { className: backdropClassName } }
          : {}),
      }}
    >
      <Box className={cn(styles.body, bodyClassName)}>
        {showGrip && (
          <button
            type="button"
            className={styles.gripArea}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleGripKeyDown}
            aria-label="Свернуть"
          >
            <span className={styles.grip} aria-hidden />
          </button>
        )}
        {title !== undefined && title !== null && title !== '' && (
          <Typography id={titleId} className={styles.title}>
            {title}
          </Typography>
        )}
        {children}
        {actions && <Box className={styles.actions}>{actions}</Box>}
      </Box>
    </Dialog>
  );
};
