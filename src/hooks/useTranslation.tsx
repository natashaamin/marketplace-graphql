import { useIntl } from 'umi';

export const useTranslation = (message: any, value?: any) => {
  const intl = useIntl();
  const isTranslated = intl.formatMessage(
    {
      id: message,
    },
    Object.assign({}, value ?? null),
  );

  return isTranslated;
};
