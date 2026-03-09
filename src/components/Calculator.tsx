'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';

type Operation = '+' | '-' | '×' | '÷' | null;

export default function Calculator() {
  const router = useRouter();
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [lastExpression, setLastExpression] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setCurrent(digit);
        setWaitingForOperand(false);
      } else {
        setCurrent(current === '0' ? digit : current + digit);
      }
    },
    [current, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setCurrent('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  }, [current, waitingForOperand]);

  const clear = useCallback(() => {
    setCurrent('0');
    setPrevious('');
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
    setLastExpression('');
    setLastResult('');
    setShareStatus('idle');
  }, []);

  const backspace = useCallback(() => {
    if (current.length > 1) {
      setCurrent(current.slice(0, -1));
    } else {
      setCurrent('0');
    }
  }, [current]);

  const percentage = useCallback(() => {
    const value = parseFloat(current);
    setCurrent(String(value / 100));
  }, [current]);

  const handleOperation = useCallback(
    (op: Operation) => {
      const value = parseFloat(current);
      if (previous !== '' && !waitingForOperand && operation) {
        const prev = parseFloat(previous);
        let result: number;
        switch (operation) {
          case '+':
            result = prev + value;
            break;
          case '-':
            result = prev - value;
            break;
          case '×':
            result = prev * value;
            break;
          case '÷':
            result = value !== 0 ? prev / value : 0;
            break;
          default:
            result = value;
        }
        const resultStr = String(parseFloat(result.toFixed(10)));
        setCurrent(resultStr);
        setPrevious(resultStr);
        setHistory(`${prev} ${operation} ${value} = ${resultStr}`);
      } else {
        setPrevious(String(value));
      }
      setOperation(op);
      setWaitingForOperand(true);
    },
    [current, previous, operation, waitingForOperand]
  );

  const calculate = useCallback(() => {
    if (!operation || previous === '' || waitingForOperand) return;

    const prev = parseFloat(previous);
    const value = parseFloat(current);
    let result: number;

    switch (operation) {
      case '+':
        result = prev + value;
        break;
      case '-':
        result = prev - value;
        break;
      case '×':
        result = prev * value;
        break;
      case '÷':
        result = value !== 0 ? prev / value : 0;
        break;
      default:
        return;
    }

    const resultStr = String(parseFloat(result.toFixed(10)));
    const expr = `${prev} ${operation} ${value}`;
    setHistory(`${expr} = ${resultStr}`);
    setLastExpression(expr);
    setLastResult(resultStr);
    setCurrent(resultStr);
    setPrevious('');
    setOperation(null);
    setWaitingForOperand(false);
    setShareStatus('idle');
  }, [current, previous, operation, waitingForOperand]);

  const shareToFeed = async () => {
    if (!lastExpression || !lastResult) return;
    setShareStatus('loading');
    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: lastExpression,
          result: lastResult,
          username: 'Anonymous',
        }),
      });
      if (!res.ok) throw new Error('Failed to share');
      setShareStatus('success');
      setTimeout(() => {
        router.push('/feed');
      }, 800);
    } catch {
      setShareStatus('error');
    }
  };

  const displayExpression = operation ? `${previous} ${operation}` : '';

  return (
    <div className="w-full max-w-sm">
      <div className="card">
        <CalculatorDisplay
          expression={displayExpression}
          current={current}
          history={history}
        />

        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <CalculatorButton label="AC" onClick={clear} variant="function" />
          <CalculatorButton label="⌫" onClick={backspace} variant="function" />
          <CalculatorButton label="%" onClick={percentage} variant="function" />
          <CalculatorButton label="÷" onClick={() => handleOperation('÷')} variant="operator" />

          {/* Row 2 */}
          <CalculatorButton label="7" onClick={() => inputDigit('7')} />
          <CalculatorButton label="8" onClick={() => inputDigit('8')} />
          <CalculatorButton label="9" onClick={() => inputDigit('9')} />
          <CalculatorButton label="×" onClick={() => handleOperation('×')} variant="operator" />

          {/* Row 3 */}
          <CalculatorButton label="4" onClick={() => inputDigit('4')} />
          <CalculatorButton label="5" onClick={() => inputDigit('5')} />
          <CalculatorButton label="6" onClick={() => inputDigit('6')} />
          <CalculatorButton label="-" onClick={() => handleOperation('-')} variant="operator" />

          {/* Row 4 */}
          <CalculatorButton label="1" onClick={() => inputDigit('1')} />
          <CalculatorButton label="2" onClick={() => inputDigit('2')} />
          <CalculatorButton label="3" onClick={() => inputDigit('3')} />
          <CalculatorButton label="+" onClick={() => handleOperation('+')} variant="operator" />

          {/* Row 5 */}
          <CalculatorButton label="0" onClick={() => inputDigit('0')} variant="wide" />
          <CalculatorButton label="." onClick={inputDecimal} />
          <CalculatorButton label="=" onClick={calculate} variant="equals" />
        </div>

        {lastExpression && lastResult && (
          <div className="mt-4">
            <button
              onClick={shareToFeed}
              disabled={shareStatus === 'loading' || shareStatus === 'success'}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                shareStatus === 'success'
                  ? 'bg-green-500'
                  : shareStatus === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary-600 hover:bg-primary-700'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {shareStatus === 'loading'
                ? 'Sharing...'
                : shareStatus === 'success'
                ? '✓ Shared to Feed!'
                : shareStatus === 'error'
                ? 'Error — Try Again'
                : '📤 Share to Feed'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
