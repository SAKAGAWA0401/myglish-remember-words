// Header.jsx
import AuthButton from '@/components/AuthButton';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">MYGLISH</h1>
      <AuthButton />
    </header>
  );
}