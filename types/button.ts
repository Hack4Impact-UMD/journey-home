interface InputBoxProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

interface LongButtonProps {
  name: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}