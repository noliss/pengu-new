import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useForkRef } from '@mui/material/utils';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer, { type SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import cn from 'classnames';
import styles from './BottomSheet.module.scss';

/** MUI SwipeableDrawer обрабатывает только touch; для мыши/пера — тянем paper за ручку. */
const GRIP_DRAG_CLOSE_PX = 80;
const GRIP_DRAG_VELOCITY = 0.6;

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  backdrop?: 'default' | 'transparent';
  showGrip?: boolean;
  bodyClassName?: string;
  titleId?: string;
  keepMounted?: boolean;
  disableScrollLock?: boolean;
  slotProps?: SwipeableDrawerProps['slotProps'];
  /**
   * Обычный Drawer без document-touch свайпа SwipeableDrawer — для палитр/слайдеров.
   * Закрытие: ручка (в т.ч. пальцем), backdrop, кнопки в контенте.
   */
  disableSwipeToDismiss?: boolean;
}

/**
 * Нижний sheet: `SwipeableDrawer` (touch-свайп) + drag за ручку мышью/пером.
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
  slotProps: userSlotProps,
  disableSwipeToDismiss = false,
}: BottomSheetProps) => {
  const swipeToDismiss = !disableSwipeToDismiss;
  const backdropClassName =
    backdrop === 'transparent' ? styles.backdropTransparent : undefined;

  let paperRest: Record<string, unknown> = {};
  let paperUserClass: string | undefined;
  let paperUserRef: React.Ref<HTMLDivElement> | undefined;
  if (userSlotProps?.paper && typeof userSlotProps.paper === 'object' && !Array.isArray(userSlotProps.paper)) {
    const p = userSlotProps.paper as {
      className?: string;
      ref?: React.Ref<HTMLDivElement>;
    };
    const { className, ref, ...rest } = p;
    paperUserClass = typeof className === 'string' ? className : undefined;
    paperUserRef = ref;
    paperRest = rest as Record<string, unknown>;
  }

  let backdropRest: Record<string, unknown> = {};
  let backdropUserClass: string | undefined;
  if (
    userSlotProps?.backdrop &&
    typeof userSlotProps.backdrop === 'object' &&
    !Array.isArray(userSlotProps.backdrop)
  ) {
    const { className, ...rest } = userSlotProps.backdrop as { className?: string };
    backdropUserClass = typeof className === 'string' ? className : undefined;
    backdropRest = rest as Record<string, unknown>;
  }

  const paperRef = useRef<HTMLDivElement | null>(null);
  const gripDragRef = useRef<{ startY: number; lastY: number; lastT: number } | null>(null);

  /** Через PaperProps: иначе ref из slotProps.paper перезапишет внутренний ref SwipeableDrawer и сломает touch-свайп. */
  const paperPropsRef = useForkRef(paperRef, paperUserRef);

  useEffect(() => {
    if (!open) return;
    const paper = paperRef.current;
    if (paper) {
      paper.style.transform = '';
      paper.style.transition = '';
    }
  }, [open]);

  const handleGripPointerDown = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (swipeToDismiss && e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    const paper = paperRef.current;
    if (!paper) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    paper.style.transition = 'none';
    gripDragRef.current = {
      startY: e.clientY,
      lastY: e.clientY,
      lastT: e.timeStamp,
    };
  }, [swipeToDismiss]);

  const handleGripPointerMove = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (swipeToDismiss && e.pointerType === 'touch') return;
    const drag = gripDragRef.current;
    const paper = paperRef.current;
    if (!drag || !paper) return;
    const delta = e.clientY - drag.startY;
    const clamped = delta > 0 ? delta : 0;
    paper.style.transform = clamped > 0 ? `translateY(${clamped}px)` : '';
    drag.lastY = e.clientY;
    drag.lastT = e.timeStamp;
  }, [swipeToDismiss]);

  const handleGripPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (swipeToDismiss && e.pointerType === 'touch') return;
      const drag = gripDragRef.current;
      const paper = paperRef.current;
      gripDragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      if (!drag || !paper) return;

      const delta = Math.max(0, e.clientY - drag.startY);
      const dt = Math.max(1, e.timeStamp - drag.lastT);
      const velocity = (e.clientY - drag.lastY) / dt;
      const shouldClose = delta > GRIP_DRAG_CLOSE_PX || velocity > GRIP_DRAG_VELOCITY;

      paper.style.transition = 'none';
      paper.style.transform = '';
      if (shouldClose) {
        onClose();
      }
    },
    [onClose],
  );

  const handleGripKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose, swipeToDismiss],
  );

  const mergedSlotProps: SwipeableDrawerProps['slotProps'] = {
    ...userSlotProps,
    root: {
      ...(typeof userSlotProps?.root === 'object' && userSlotProps.root ? userSlotProps.root : {}),
      ...(title && titleId ? { 'aria-labelledby': titleId as string } : {}),
    },
    paper: {
      ...paperRest,
      variant: 'glassBottom',
      elevation: 0,
      className: cn(styles.paper, paperUserClass),
    },
    backdrop: {
      ...backdropRest,
      className: cn(backdropClassName, backdropUserClass),
    },
  };

  const sheetBody = (
    <Box className={cn(styles.body, bodyClassName)}>
      {showGrip && (
        <button
          type="button"
          className={styles.gripRow}
          onPointerDown={handleGripPointerDown}
          onPointerMove={handleGripPointerMove}
          onPointerUp={handleGripPointerUp}
          onPointerCancel={handleGripPointerUp}
          onKeyDown={handleGripKeyDown}
          aria-label="Свернуть"
        >
          <span className={styles.grip} aria-hidden />
        </button>
      )}
      {title !== undefined && title !== null && title !== '' && (
        <Typography id={titleId} className={styles.title} component="h2">
          {title}
        </Typography>
      )}
      {children}
      {actions && <Box className={styles.actions}>{actions}</Box>}
    </Box>
  );

  if (disableSwipeToDismiss) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        variant="temporary"
        PaperProps={{ ref: paperPropsRef }}
        ModalProps={{ keepMounted }}
        onClose={() => onClose()}
        keepMounted={keepMounted}
        disableScrollLock={disableScrollLock}
        slotProps={mergedSlotProps}
      >
        {sheetBody}
      </Drawer>
    );
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      variant="temporary"
      PaperProps={{ ref: paperPropsRef }}
      ModalProps={{ keepMounted }}
      onClose={() => onClose()}
      onOpen={() => {}}
      disableSwipeToOpen
      allowSwipeInChildren={false}
      keepMounted={keepMounted}
      disableScrollLock={disableScrollLock}
      disableBackdropTransition={backdrop === 'transparent'}
      slotProps={mergedSlotProps}
    >
      {sheetBody}
    </SwipeableDrawer>
  );
};
