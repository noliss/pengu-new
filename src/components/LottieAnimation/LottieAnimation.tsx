import Lottie from 'lottie-react';
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
  className = '',
  onComplete,
  width,
  height,
}: LottieAnimationProps) => {
  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        className={styles.animation}
        style={Object.keys(style).length > 0 ? style : undefined}
      />
    </div>
  );
};

