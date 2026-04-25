import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Sparkles, Plus, FileText, ArrowRight, Zap, Download,
    CheckCircle2, Clock, LayoutTemplate, Monitor, Layers,
    TrendingUp, Eye, Pencil, ExternalLink,
} from 'lucide-react';

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedCount({ value, className }) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef(null);
    useEffect(() => {
        let start = null;
        const duration = 600;
        const animate = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [value]);
    return <span className={className}>{display}</span>;
}

const TEMPLATE_META = {
    default: { icon: Monitor,  color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
    minimal: { icon: Layers,   color: 'text-slate-300',   bg: 'bg-slate-700/40'   },
    bold:    { icon: Zap,      color: 'text-orange-400',  bg: 'bg-orange-500/10'  },
};

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
}

export default function Dashboard({ stats, recentPages = [] }) {
    const { auth } = usePage().props;

    const steps = [
        { num: '01', title: 'Isi Data Produk',      desc: 'Nama produk, deskripsi, fitur, target audiens, dan harga.',                           icon: FileText,       color: 'text-violet-400',  bg: 'bg-violet-600/10',  border: 'border-violet-500/20' },
        { num: '02', title: 'Generate dengan AI',   desc: 'AI memilih template & warna terbaik, lalu menulis seluruh konten sales page.',        icon: Sparkles,       color: 'text-indigo-400',  bg: 'bg-indigo-600/10',  border: 'border-indigo-500/20' },
        { num: '03', title: 'Lihat & Poles',        desc: 'Preview hasil, ganti template, atau regenerasi bagian tertentu sesuai selera.',       icon: LayoutTemplate, color: 'text-violet-400',  bg: 'bg-violet-600/10',  border: 'border-violet-500/20' },
        { num: '04', title: 'Export & Publish',     desc: 'Unduh sebagai file HTML standalone siap upload ke mana saja.',                        icon: Download,       color: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/20' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 sm:py-10">
                <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* ── Hero card ─────────────────────────────────── */}
                    <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 shadow-2xl shadow-violet-900/40 animate-fade-in">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        {/* Glowing orb */}
                        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2 text-violet-200">
                                    <Sparkles className="h-4 w-4 shrink-0" />
                                    <span className="text-sm font-medium">{getGreeting()}, {auth.user.name}!</span>
                                </div>
                                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                                    AI Sales Page
                                    <br />
                                    <span className="text-violet-200">Generator</span>
                                </h1>
                                <p className="mt-3 max-w-md text-sm text-indigo-100 sm:text-base">
                                    Buat landing page penjualan yang menarik dalam hitungan detik — tanpa skill design atau coding.
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-row flex-wrap gap-3 md:flex-col">
                                <Link href={route('sales-pages.create')} className="flex items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 font-bold text-violet-700 shadow-lg transition hover:bg-violet-50 hover:scale-105">
                                    <Plus className="h-5 w-5" /> Buat Sales Page
                                </Link>
                                <Link href={route('sales-pages.index')} className="flex items-center justify-center gap-2 rounded-sm border border-white/30 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/20">
                                    <FileText className="h-5 w-5" /> Lihat Semua
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats row ─────────────────────────────────── */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="group rounded-sm border border-slate-800 bg-slate-900 p-4 text-center transition hover:border-slate-700 sm:p-5 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-slate-500" />
                            </div>
                            <AnimatedCount value={stats?.total ?? 0} className="text-2xl font-black text-white sm:text-3xl" />
                            <p className="mt-1 text-xs text-slate-500">Total Halaman</p>
                        </div>
                        <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/5 p-4 text-center transition hover:border-emerald-500/40 sm:p-5 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <AnimatedCount value={stats?.generated ?? 0} className="text-2xl font-black text-emerald-400 sm:text-3xl" />
                            <p className="mt-1 text-xs text-slate-500">Generated</p>
                        </div>
                        <div className="rounded-sm border border-amber-500/20 bg-amber-500/5 p-4 text-center transition hover:border-amber-500/40 sm:p-5 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-amber-500" />
                            </div>
                            <AnimatedCount value={stats?.draft ?? 0} className="text-2xl font-black text-amber-400 sm:text-3xl" />
                            <p className="mt-1 text-xs text-slate-500">Draft</p>
                        </div>
                    </div>

                    {/* ── Recent pages ──────────────────────────────── */}
                    {recentPages.length > 0 && (
                        <div className="rounded-sm border border-slate-800 bg-slate-900 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
                                <div>
                                    <h2 className="font-bold text-white">Halaman Terbaru</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">Sales page yang baru dibuat atau diedit</p>
                                </div>
                                <Link href={route('sales-pages.index')} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition">
                                    Lihat semua <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <ul className="divide-y divide-slate-800/60">
                                {recentPages.map((page) => {
                                    const tpl = TEMPLATE_META[page.template] ?? TEMPLATE_META.default;
                                    const TplIcon = tpl.icon;
                                    const isGenerated = page.status === 'generated';
                                    return (
                                        <li key={page.id} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-800/30 sm:px-6">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-slate-700 ${tpl.bg}`}>
                                                <TplIcon className={`h-3.5 w-3.5 ${tpl.color}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-white">{page.product_name}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {new Date(page.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {page.generated_content?.headline && (
                                                        <> · <span className="text-violet-400/70 truncate italic">"{page.generated_content.headline}"</span></>
                                                    )}
                                                </p>
                                            </div>
                                            <span className={`hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:flex ${
                                                isGenerated ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                                {isGenerated ? <><CheckCircle2 className="h-3 w-3" />Done</> : <><Clock className="h-3 w-3" />Draft</>}
                                            </span>
                                            <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
                                                <Link href={route('sales-pages.show', page.id)} className="rounded-sm border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition hover:text-white" title="Lihat">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Link>
                                                <Link href={route('sales-pages.edit', page.id)} className="rounded-sm border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition hover:text-white" title="Edit">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* ── How it works ──────────────────────────────── */}
                    <div className="rounded-sm border border-slate-800 bg-slate-900 animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
                            <h2 className="font-bold text-white">Cara Penggunaan</h2>
                            <p className="mt-0.5 text-xs text-slate-500">4 langkah mudah membuat sales page profesional</p>
                        </div>
                        <div className="grid gap-0 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4 md:divide-x md:divide-y-0">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.num} className="flex gap-4 p-5 sm:flex-col sm:gap-3 sm:p-5">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${step.border} ${step.bg}`}>
                                            <Icon className={`h-5 w-5 ${step.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-600">{step.num}</span>
                                                <p className="text-sm font-semibold text-white">{step.title}</p>
                                            </div>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── CTA row ───────────────────────────────────── */}
                    <div className="flex flex-col gap-4 rounded-sm border border-violet-500/20 bg-violet-600/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                        <div>
                            <p className="font-bold text-white">Siap membuat sales page berikutnya?</p>
                            <p className="mt-0.5 text-sm text-slate-400">Isi data produk, klik generate — selesai dalam 30 detik. Tekan <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">Ctrl K</kbd> kapan saja.</p>
                        </div>
                        <Link href={route('sales-pages.create')} className="flex shrink-0 items-center justify-center gap-2 rounded-sm bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 hover:scale-105">
                            Mulai Sekarang <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}