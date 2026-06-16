import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export function TaskIcon({ name, ...props }: IconProps) {
  const pascalName = name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  
  const IconComponent = (Icons as any)[pascalName] || Icons.Circle;
  return <IconComponent {...props} />;
}
