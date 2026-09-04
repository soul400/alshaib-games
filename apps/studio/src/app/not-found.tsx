import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-6">
      <h2 className="text-3xl font-black text-white">404 - الصفحة غير موجودة</h2>
      <p className="text-slate-400 text-sm">عذراً، لم نتمكن من العثور على الصفحة المطلوبة.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-lg"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
