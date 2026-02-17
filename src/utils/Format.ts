export const formatCurrency = (
  value: number,
  locale = "pt-BR",
  currency = "BRL"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export const formatDate = (
  date: Date | string,
  locale = "pt-BR",
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export const formatPercentage = (value: number, locale = "pt-BR"): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (
  value: number,
  locale = "pt-BR",
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const cleanCpfCnpj = (value: string | null | undefined): string | null => {
  if (!value) return null;
  return value.replace(/\D/g, "");
};

export const formatCpfCnpj = (value: string): string => {
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length <= 11) {
    return cleanedValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  } else {
    return cleanedValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
};

export const cleanPhoneNumber = (value: string | null | undefined): string | null => {
  if (!value) return null;

  const cleaned = value.replace(/\D/g, "");
  return cleaned ? cleaned : null;
};

export const formatPhoneNumber = (value: string): string => {
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length === 10) {
    return cleanedValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanedValue.length === 11) {
    return cleanedValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else {
    return value;
  }
};