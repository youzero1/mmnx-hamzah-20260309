import Calculator from '@/components/Calculator';

export default function CalculatorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-3xl font-bold text-primary-700 mb-8">Calculator</h1>
      <Calculator />
    </div>
  );
}
