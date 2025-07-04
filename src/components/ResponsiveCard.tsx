
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useMobileLayout } from '../hooks/useMobileLayout';

interface ResponsiveCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export const ResponsiveCard = ({ title, children, className = '', compact = false }: ResponsiveCardProps) => {
  const { isMobile } = useMobileLayout();

  return (
    <Card className={`${className} ${isMobile ? 'mx-2' : ''}`}>
      {title && (
        <CardHeader className={isMobile && compact ? 'pb-3' : ''}>
          <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={isMobile && compact ? 'pt-0' : ''}>
        {children}
      </CardContent>
    </Card>
  );
};
