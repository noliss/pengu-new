import { useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramBackButton } from '@shared/hooks/useTelegramBackButton';

interface PageProps {
  children: ReactNode;
  /** Показывать Telegram back-кнопку и реагировать на неё */
  back?: boolean;
  /** Кастомный обработчик. По умолчанию navigate(-1) */
  onBack?: () => void;
}

export const Page = ({ children, back = true, onBack }: PageProps) => {
  const navigate = useNavigate();

  const handler = useCallback(() => {
    if (onBack) onBack();
    else navigate(-1);
  }, [onBack, navigate]);

  useTelegramBackButton(back, handler);

  return <>{children}</>;
};
