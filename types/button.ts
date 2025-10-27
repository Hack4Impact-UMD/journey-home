export interface InputBoxProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logo?: string;
  name?: string;
  disabled?: boolean;
}

export interface LongButtonProps {
  name: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}