import Lottie from 'lottie-react';
import cn from 'classnames';
import styles from './LottieAnimation.module.scss';

interface LottieAnimationProps {
  animationData: object | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
  width?: number | string;
  height?: number | string;
}

export const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className,
  onComplete,
  width,
  height,
}: LottieAnimationProps) => {
  const inlineStyle: React.CSSProperties = {};
  if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={cn(styles.wrapper, className)}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        className={styles.animation}
        style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      />
    </div>
  );
};
