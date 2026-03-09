interface CalculatorDisplayProps {
  expression: string;
  current: string;
  history: string;
}

export default function CalculatorDisplay({ expression, current, history }: CalculatorDisplayProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 mb-4 min-h-[120px] flex flex-col justify-end">
      <div className="text-gray-400 text-sm h-6 text-right truncate">{history}</div>
      <div className="text-white text-4xl font-light text-right truncate mt-1">
        {current || '0'}
      </div>
      {expression && (
        <div className="text-primary-300 text-sm text-right mt-1 truncate">{expression}</div>
      )}
    </div>
  );
}
