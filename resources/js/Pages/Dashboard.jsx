import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sparkles, Plus, FileText, ArrowRight, Zap, Palette, Download, CheckCircle2, Clock, LayoutTemplate } from 'lucide-react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;

    const steps = [
        {
            num: '01',
            title: 'Isi Data Produk',
            desc: 'Nama produk, deskripsi, fitur, target audiens, dan harga.',
            icon: FileText,
            color: 'text-violet-400',
            bg: 'bg-violet-600/10',
            border: 'border-violet-500/20',
        },
        {
            num: '02',
            title: 'Generate dengan AI',
            desc: 'AI memilih template & warna terbaik, lalu menulis seluruh konten sales page.',
            icon: Sparkles,
            color: 'text-indigo-400',
            bg: 'bg-indigo-600/10',
            border: 'border-indigo-500/20',
        },
        {
            num: '03',
            title: 'Lihat & Poles',
            desc: 'Preview hasil, ganti template, atau regenerasi bagian tertentu sesuai selera.',
            icon: LayoutTemplate,
            color: 'text-violet-400',
            bg: 'bg-violet-600/10',
            border: 'border-violet-500/20',
        },
        {
            num: '04',
            title: 'Export & Publish',
            desc: 'Unduh sebagai file HTML standalone siap upload ke mana saja.',
            icon: Download,
            color: 'text-emerald-400',
            bg: 'bg-emerald-600/10',
            border: 'border-emerald-500/20',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 sm:py-10">
                <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* ── Hero card ─────────────────────────────────── */}
                    <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 shadow-2xl shadow-violet-900/40">
                        {/* subtle dot grid */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />
                        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2 text-violet-200">
                                    <Sparkles className="h-4 w-4 shrink-0" />
                                    <span className="text-sm font-medium">Halo, {auth.user.name}!</span>
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
                                <Link
                                    href={route('sales-pages.create')}
                                    className="flex items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 font-bold text-violet-700 shadow-lg transition hover:bg-violet-50"
                                >
                                    <Plus className="h-5 w-5" />
                                    Buat Sales Page
                                </Link>
                                <Link
                                    href={route('sales-pages.index')}
                                    className="flex items-center justify-center gap-2 rounded-sm border border-white/30 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    <FileText className="h-5 w-5" />
                                    Lihat Semua
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats row ─────────────────────────────────── */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-sm border border-slate-800 bg-slate-900 p-4 text-center sm:p-5">
                            <p className="text-2xl font-black text-white sm:text-3xl">{stats?.total ?? 0}</p>
                            <p className="mt-1 text-xs text-slate-500">Total Halaman</p>
                        </div>
                        <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/5 p-4 text-center sm:p-5">
                            <p className="text-2xl font-black text-emerald-400 sm:text-3xl">{stats?.generated ?? 0}</p>
                            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Generated
                            </p>
                        </div>
                        <div className="rounded-sm border border-amber-500/20 bg-amber-500/5 p-4 text-center sm:p-5">
                            <p className="text-2xl font-black text-amber-400 sm:text-3xl">{stats?.draft ?? 0}</p>
                            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
                                <Clock className="h-3 w-3 text-amber-500" /> Draft
                            </p>
                        </div>
                    </div>

                    {/* ── How it works ──────────────────────────────── */}
                    <div className="rounded-sm border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
                            <h2 className="font-bold text-white">Cara Penggunaan</h2>
                            <p className="mt-0.5 text-xs text-slate-500">4 langkah mudah membuat sales page profesional</p>
                        </div>
                        <div className="grid gap-0 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4 md:divide-x md:divide-y-0">
                            {steps.map((step, i) => {
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
                    <div className="flex flex-col gap-4 rounded-sm border border-violet-500/20 bg-violet-600/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <p className="font-bold text-white">Siap membuat sales page berikutnya?</p>
                            <p className="mt-0.5 text-sm text-slate-400">Isi data produk, klik generate — selesai dalam 30 detik.</p>
                        </div>
                        <Link
                            href={route('sales-pages.create')}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-sm bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
                        >
                            Mulai Sekarang <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
