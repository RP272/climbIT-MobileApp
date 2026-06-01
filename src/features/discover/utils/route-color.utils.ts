import type { HoldColor } from "@/src/types/all-routes.types";

export function getHoldColorFromHex(color: string | undefined): HoldColor | undefined {
  const backgroundColor = normalizeHexColor(color);

  if (!backgroundColor) {
    return undefined;
  }

  const { red, green, blue } = getRgbComponents(backgroundColor);
  const textColor = getReadableTextColor(backgroundColor);

  return {
    label: getColorNameFromHex(backgroundColor),
    dotClassName: "",
    surfaceClassName: "",
    textClassName: "",
    dotStyle: {
      backgroundColor,
      borderColor: textColor,
      borderWidth: 0.5,
    },
    surfaceStyle: {
      backgroundColor: toRgba(red, green, blue, 0.5),
      borderColor: toRgba(red, green, blue, 1),
      borderWidth: 1,
    },
    textStyle: {
      color: textColor,
    },
  };
}

export function getColorNameFromHex(color: string | undefined) {
  const hexColor = normalizeHexColor(color);

  if (!hexColor) {
    return "Kolor";
  }

  return getColorNameFromRgb(getRgbComponents(hexColor));
}

export function normalizeHexColor(color: string | undefined) {
  if (!color) {
    return null;
  }

  const trimmedColor = color.trim();
  const hex = trimmedColor.startsWith("#") ? trimmedColor.slice(1) : trimmedColor;

  if (/^[\da-fA-F]{3}$/.test(hex)) {
    const [red, green, blue] = hex;

    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase();
  }

  if (/^[\da-fA-F]{6}$/.test(hex)) {
    return `#${hex}`.toUpperCase();
  }

  return null;
}

function getRgbComponents(hexColor: string) {
  return {
    red: Number.parseInt(hexColor.slice(1, 3), 16),
    green: Number.parseInt(hexColor.slice(3, 5), 16),
    blue: Number.parseInt(hexColor.slice(5, 7), 16),
  };
}

function getColorNameFromRgb(color: ReturnType<typeof getRgbComponents>) {
  const { hue, saturation, value } = getHsvComponents(color);

  if (value <= 0.12) {
    return "Czarny";
  }

  if (saturation <= 0.12 && value >= 0.9) {
    return "Biały";
  }

  if (saturation <= 0.16) {
    return "Szary";
  }

  if (hue < 15 || hue >= 345) {
    return "Czerwony";
  }

  if (hue < 45) {
    return "Pomarańczowy";
  }

  if (hue < 70) {
    return "Żółty";
  }

  if (hue < 165) {
    return "Zielony";
  }

  if (hue < 250) {
    return "Niebieski";
  }

  if (hue < 310) {
    return "Fioletowy";
  }

  if (hue < 345) {
    return "Różowy";
  }

  return "Kolor";
}

function getHsvComponents({ red, green, blue }: ReturnType<typeof getRgbComponents>) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max;
  let hue = 0;

  if (delta !== 0) {
    if (max === normalizedRed) {
      hue = 60 * (((normalizedGreen - normalizedBlue) / delta) % 6);
    } else if (max === normalizedGreen) {
      hue = 60 * ((normalizedBlue - normalizedRed) / delta + 2);
    } else {
      hue = 60 * ((normalizedRed - normalizedGreen) / delta + 4);
    }
  }

  return {
    hue: hue < 0 ? hue + 360 : hue,
    saturation,
    value: max,
  };
}

function toRgba(red: number, green: number, blue: number, alpha: number) {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getReadableTextColor(hexColor: string) {
  const red = Number.parseInt(hexColor.slice(1, 3), 16);
  const green = Number.parseInt(hexColor.slice(3, 5), 16);
  const blue = Number.parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#111827" : "#FFFFFF";
}
