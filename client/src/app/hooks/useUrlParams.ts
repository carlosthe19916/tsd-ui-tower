import { useCallback } from "react";

import { useSearchParams } from "react-router-dom";

export const useUrlParam = (key: string, defaultValue: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (newValue: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newValue === defaultValue) {
            next.delete(key);
          } else {
            next.set(key, newValue);
          }
          return next;
        },
        { replace: true },
      );
    },
    [key, defaultValue, setSearchParams],
  );

  return [value, setValue] as const;
};

export const useClearUrlParams = (...keys: string[]) => {
  const [, setSearchParams] = useSearchParams();

  return useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        keys.forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );
  }, [keys, setSearchParams]);
};
