import Button, { type ButtonProps } from '@mui/material/Button';
import cn from 'classnames';
import styles from './GradientButton.module.scss';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  /**
   * Показывать ли пульсирующую ✨-иконку слева от лейбла.
   * По умолчанию `true` — это «магический» CTA феечи.
   */
  showSparkle?: boolean;
}

/**
 * CTA: чёрно-белый градиентный sway, обводка через mask, hover-fill и glow.
 * Размеры через CSS-переменные на том же элементе (className):
 *  - `--btn-height` (default 36px)
 *  - `--btn-padding-x` (default 22px)
 *  - `--btn-font-size` (default 13px)
 *  - `--btn-sparkle-size` (default 16px)
 */
export const GradientButton = ({
  children,
  showSparkle = true,
  className,
  ...rest
}: GradientButtonProps) => (
  <Button {...rest} disableRipple className={cn(styles.btn, className)}>
    <span className={styles.glow} aria-hidden />
    <span className={styles.idleShimmer} aria-hidden />
    <span className={styles.labelRow}>
      {showSparkle && (
        <span className={styles.sparkle} aria-hidden>
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2l1.2 5.5L17 9l-5.8 1.5L10 16l-1.2-5.5L3 9l5.8-1.5z" />
            <path d="M5 2l.5 2L8 5l-2.5.5L5 8l-.5-2.5L2 5l2.5-.5z" opacity=".7" />
          </svg>
        </span>
      )}
      {children}
    </span>
  </Button>
);
