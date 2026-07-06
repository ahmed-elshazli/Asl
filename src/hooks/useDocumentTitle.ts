import { useEffect } from 'react';

/**
 * يغيّر عنوان تاب المتصفح (document.title) ديناميكياً.
 * يعيد العنوان الافتراضي عند unmount.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | أصِل`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
