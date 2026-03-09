'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-sky-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-primary-600 tracking-tight">
          mmnx
        </Link>
        <div className="flex gap-4">
          <Link
            href="/calculator"
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              pathname === '/calculator'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            Calculator
          </Link>
          <Link
            href="/feed"
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              pathname === '/feed'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            Feed
          </Link>
        </div>
      </div>
    </nav>
  );
}
