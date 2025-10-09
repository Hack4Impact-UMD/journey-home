export interface InputBoxProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logo?: string;
}

export interface LongButtonProps {
  name: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}