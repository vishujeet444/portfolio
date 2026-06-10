import { useEffect, useState } from 'react';

export default function usePageVisibility() {
  const [visible, setVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
