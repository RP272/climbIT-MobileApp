import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetter = useMemo(
    () => debounce((newValue: T) => setDebouncedValue(newValue), delayMs),
    [delayMs],
  );

  useEffect(() => {
    debouncedSetter(value);
    return () => debouncedSetter.cancel();
  }, [value, debouncedSetter]);

  return debouncedValue;
}
