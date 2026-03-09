interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'function' | 'wide';
  className?: string;
}

export default function CalculatorButton({
  label,
  onClick,
  variant = 'default',
  className = '',
}: CalculatorButtonProps) {
  const base =
    'flex items-center justify-center rounded-xl font-semibold text-lg cursor-pointer select-none transition-all duration-100 active:scale-95 shadow-sm h-14';

  const variants: Record<string, string> = {
    default: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200',
    operator: 'bg-primary-500 hover:bg-primary-400 text-white',
    equals: 'bg-primary-700 hover:bg-primary-600 text-white',
    function: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    wide: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 col-span-2',
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
