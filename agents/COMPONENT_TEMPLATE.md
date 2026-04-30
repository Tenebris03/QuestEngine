
---

## 📄 `COMPONENT_TEMPLATE.md`
```markdown
# Component Blueprint
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils'; // clsx + tailwind-merge

interface ComponentProps {
  title: string;
  variant?: 'default' | 'highlight' | 'compact';
  children?: React.ReactNode;
}

/**
 * Reusable component description.
 * @param props Component properties
 */
const Component: React.FC<ComponentProps> = ({ title, variant = 'default', children }) => {
  const { t } = useTranslation();

  return (
    <article className={cn(
      'rounded-xl border border-border bg-bg-secondary p-6 transition-all',
      variant === 'highlight' && 'border-primary shadow-primary-glow',
      variant === 'compact' && 'p-4'
    )}>
      <h3 className="text-lg font-semibold text-text-primary">{t(title)}</h3>
      {children && <div className="mt-4">{children}</div>}
    </article>
  );
};

export default Component;

Required Additions
@/lib/utils.ts must export cn(...classes: string[]) using clsx + tailwind-merge.
All interactive elements must include aria-label or visible text.
Focus states: focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary