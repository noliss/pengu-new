import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backButton } from '@tma.js/sdk-react';

interface PageProps {
  children: React.ReactNode;
  back?: boolean;
}

export const Page = ({ children, back = true }: PageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
      const unsubscribe = backButton.onClick(() => {
        navigate(-1);
      });
      return unsubscribe;
    }
    backButton.hide();
  }, [back, navigate]);

  return <>{children}</>;
};