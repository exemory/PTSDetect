import { Select, selectClasses, Option } from '@mui/joy';
import { ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const onLanguageChange = (_event: any, value: any) => {
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
  };

  return (
    <Select
      onChange={onLanguageChange}
      disabled={false}
      defaultValue={i18n.language}
      size="sm"
      startDecorator={<Languages size={16} />}
      indicator={<ChevronDown size={16} />}
      sx={{
        width: 140,
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      <Option value="en">English</Option>
      <Option value="uk">Українська</Option>
      <Option value="ru">Русский</Option>
    </Select>
  );
};
