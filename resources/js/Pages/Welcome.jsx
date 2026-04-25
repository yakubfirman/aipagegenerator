import { Head, Link } from '@inertiajs/react';
import {
    Sparkles, Zap, Monitor, Layers, Download, RefreshCw,
    Palette, Copy, ChevronRight, CheckCircle2,
    FileText, Wand2, Eye, ArrowRight,
} from 'lucide-react';

const HOW_IT_WORKS = [
    {
        step: '01', title: 'Isi Data Produk',
        desc: 'Masukkan nama produk, deskripsi, fitur unggulan, target audiens, harga, dan USP. Semakin lengkap data, semakin tajam copy yang dihasilkan.',
        icon: FileText,
        detail: ['Nama & deskripsi produk', 'Fitur utama (pisahkan koma)', 'Target audiens spesifik', 'Harga & keunggulan unik'],
    },
    {
        step: '02', title: 'AI Generate Konten',
        desc: 'Sistem mengirimkan data ke model Grok (xAI). AI menganalisis konteks dan menulis seluruh elemen sales page dalam hitungan detik.',
        icon: Wand2,
        detail: ['Headline yang menarik perhatian', 'Sub-headline & deskripsi persuasif', 'Poin manfaat & fitur produk', 'Social proof & tombol CTA'],
    },
    {
        step: '03', title: 'Preview & Kustomisasi',
        desc: 'Ganti template, ubah warna tema, regenerasi bagian tertentu, atau atur link CTA. Semua tanpa reload halaman.',
        icon: Eye,
        detail: ['3 template: Default, Minimal, Bold', '5 warna tema tersedia', 'Regenerasi per-bagian konten', 'Undo / revert ke versi sebelumnya'],
    },
    {
        step: '04', title: 'Export & Publikasikan',
        desc: 'Download halaman sebagai file HTML mandiri. Tidak membutuhkan framework atau server khusus.',
        icon: Download,
        detail: ['HTML standalone, zero dependency', 'CSS & JS sudah di-inline', 'Siap upload ke hosting apapun', 'Bisa dibuka langsung di browser'],
    },
];

const FEATURES = [
    {
        icon: Wand2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20',
        title: 'AI Copywriting Otomatis',
        desc: 'Didukung model Grok dari xAI. Generate headline, deskripsi, manfaat, fitur, social proof, dan CTA secara bersamaan dari data produk Anda.',
    },
    {
        icon: Monitor, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20',
        title: '3 Template Visual',
        desc: 'Default, Minimal, dan Bold. Switching template instan setelah konten terbuat tanpa perlu generate ulang dari awal.',
    },
    {
        icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
        title: 'Regenerasi Per Bagian',
        desc: 'Tidak puas satu bagian? Klik regenerasi hanya di bagian itu saja tanpa mengubah bagian lainnya.',
    },
    {
        icon: Palette, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
        title: '5 Warna Tema',
        desc: 'Pilih dari Violet, Emerald, Rose, Amber, atau Sky. Setiap warna mengubah gradient, tombol CTA, dan aksen visual secara real-time.',
    },
    {
        icon: Copy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
        title: 'Duplikasi & Riwayat Konten',
        desc: 'Duplikasi sales page sebagai titik awal baru. Sistem menyimpan 3 versi terakhir untuk undo jika hasil regenerasi tidak sesuai.',
    },
    {
        icon: Download, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
        title: 'Export HTML Mandiri',
        desc: 'Unduh sebagai file HTML lengkap dengan CSS inline. Tidak perlu framework, tidak perlu server Node/PHP. Upload dan langsung live.',
    },
];

const TEMPLATES = [
    {
        name: 'Default', icon: Monitor, tagline: 'Premium & Elegan',
        desc: 'Cocok untuk produk digital, SaaS, kursus online. Tampilan modern dengan gradient violet-to-indigo dan layout yang terstruktur.',
        color: 'from-violet-500/20 to-indigo-500/20', border: 'border-violet-500/30', tag: 'Paling Populer',
    },
    {
        name: 'Minimal', icon: Layers, tagline: 'Bersih & Profesional',
        desc: 'Cocok untuk jasa profesional, konsultasi, atau produk premium. Whitespace luas, tipografi dominan, minim gangguan visual.',
        color: 'from-slate-700/40 to-slate-600/20', border: 'border-slate-600/40', tag: null,
    },
    {
        name: 'Bold', icon: Zap, tagline: 'Energik & Dramatis',
        desc: 'Cocok untuk fitness, event, flash sale. Warna kontras tinggi, headline besar, dan urgency yang kuat.',
        color: 'from-orange-500/20 to-rose-500/20', border: 'border-orange-500/30', tag: null,
    },
];

const CONTENT_SECTIONS = [
    'Headline utama yang menarik perhatian',
    'Sub-headline yang memperkuat pesan',
    'Deskripsi produk yang persuasif',
    'Poin-poin manfaat (benefits)',
    'Daftar fitur lengkap produk',
    'Social proof / testimoni pelanggan',
    'Informasi harga & penawaran',
    'Tombol CTA (Call-to-Action)',
];

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="AI Sales Page Generator" />
            <div className="min-h-screen bg-slate-950 text-white antialiased">

                {/* Navbar */}
                <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-slate-950/85 backdrop-blur-md">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-br from-violet-600 to-indigo-600 shadow shadow-violet-600/40">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-extrabold tracking-tight text-white">AI Sales Page</span>
                            <span className="hidden rounded-full border border-violet-500/30 bg-violet-500/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-violet-400 sm:inline">Generator</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="flex items-center gap-2 rounded-sm bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
                                    Dashboard <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm text-slate-400 transition hover:text-white">Masuk</Link>
                                    <Link href={route('register')} className="flex items-center gap-1.5 rounded-sm bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
                                        Mulai Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden pb-28 pt-40 text-center">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-1/2 top-[-80px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[140px]" />
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                    </div>
                    <div className="relative mx-auto max-w-4xl px-6">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/8 px-4 py-1.5 text-sm text-violet-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Powered by xAI Grok &middot; Laravel 11 &middot; React
                        </div>
                        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Sales Page Profesional<br />
                            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
                                Dibuat oleh AI
                            </span>
                        </h1>
                        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-400">
                            Sistem berbasis AI yang mengubah data produk Anda menjadi sales page lengkap &mdash;
                            headline menarik, deskripsi persuasif, poin manfaat, hingga CTA yang menjual &mdash;
                            dalam hitungan detik, tanpa skill copywriting.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={auth?.user ? route('sales-pages.create') : route('register')}
                                className="flex items-center gap-2 rounded-sm bg-violet-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-violet-600/25 transition hover:scale-105 hover:bg-violet-500">
                                <Sparkles className="h-4 w-4" />
                                {auth?.user ? 'Buat Sales Page Baru' : 'Mulai Sekarang, Gratis'}
                            </Link>
                            <a href="#cara-kerja" className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
                                Pelajari cara kerjanya <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-slate-800/60 pt-10">
                            {[['8','Bagian Konten AI'],['3','Template Visual'],['5','Warna Tema'],['1-klik','Export HTML']].map(([val, label]) => (
                                <div key={label} className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-extrabold text-white">{val}</span>
                                    <span className="text-xs text-slate-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cara Kerja */}
                <section id="cara-kerja" className="border-t border-slate-800/60 py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-14 text-center">
                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">Alur Sistem</p>
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Bagaimana Sistem Ini Bekerja</h2>
                            <p className="mx-auto mt-4 max-w-xl text-slate-500">4 langkah dari data mentah ke sales page siap tayang.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {HOW_IT_WORKS.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.step} className="group relative overflow-hidden rounded-sm border border-slate-800 bg-slate-900 p-6 transition hover:border-violet-500/30">
                                        <span className="absolute right-4 top-4 select-none text-6xl font-black text-slate-800/60">{item.step}</span>
                                        <div className="relative">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-violet-500/30 bg-violet-500/10">
                                                    <Icon className="h-5 w-5 text-violet-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                            </div>
                                            <p className="mb-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                                            <ul className="space-y-1.5">
                                                {item.detail.map((d) => (
                                                    <li key={d} className="flex items-center gap-2 text-xs text-slate-500">
                                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-violet-500/60" />
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {i % 2 === 0 && (
                                            <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-500/30 bg-slate-950 text-violet-500">
                                                    <ArrowRight className="h-3 w-3" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Konten yang Dihasilkan */}
                <section className="border-t border-slate-800/60 py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div>
                                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">Output AI</p>
                                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">8 Bagian Konten<br />Sekaligus, Otomatis</h2>
                                <p className="mt-4 leading-relaxed text-slate-500">
                                    Dari satu input data produk, AI menulis semua elemen yang dibutuhkan sales page efektif. Setiap bagian bisa diregenerasi secara independen jika hasilnya kurang sesuai.
                                </p>
                                <Link href={auth?.user ? route('sales-pages.create') : route('register')}
                                    className="mt-8 inline-flex items-center gap-2 rounded-sm border border-violet-500/30 bg-violet-600/15 px-5 py-2.5 text-sm font-semibold text-violet-400 transition hover:bg-violet-600/25">
                                    Coba Generate Sekarang <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {CONTENT_SECTIONS.map((sec, i) => (
                                    <div key={sec} className="flex items-center gap-3 rounded-sm border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm transition hover:border-slate-700">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-400">{i + 1}</span>
                                        <span className="text-slate-300">{sec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Template */}
                <section className="border-t border-slate-800/60 py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-14 text-center">
                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">Template</p>
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">3 Gaya Visual, Satu Klik Ganti</h2>
                            <p className="mx-auto mt-4 max-w-xl text-slate-500">Template bisa diganti kapan saja setelah konten terbuat, tanpa generate ulang dari awal.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {TEMPLATES.map((t) => {
                                const Icon = t.icon;
                                return (
                                    <div key={t.name} className={"relative overflow-hidden rounded-sm border bg-gradient-to-b p-6 transition hover:-translate-y-1 " + t.border + " " + t.color}>
                                        {t.tag && (
                                            <span className="absolute right-4 top-4 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">{t.tag}</span>
                                        )}
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-white/10 bg-white/5">
                                            <Icon className="h-6 w-6 text-white/70" />
                                        </div>
                                        <h3 className="text-xl font-extrabold text-white">{t.name}</h3>
                                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/40">{t.tagline}</p>
                                        <p className="mt-3 text-sm leading-relaxed text-slate-400">{t.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Fitur Lengkap */}
                <section className="border-t border-slate-800/60 py-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-14 text-center">
                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-500">Fitur Sistem</p>
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Semua yang Anda Butuhkan</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.title} className={"rounded-sm border bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:bg-slate-900/70 " + f.border}>
                                        <div className={"mb-4 flex h-10 w-10 items-center justify-center rounded-sm " + f.bg}>
                                            <Icon className={"h-5 w-5 " + f.color} />
                                        </div>
                                        <h3 className="font-bold text-white">{f.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="border-t border-slate-800/60 py-20">
                    <div className="mx-auto max-w-6xl px-6">
                        <p className="mb-8 text-center text-sm font-bold uppercase tracking-widest text-slate-700">Dibangun dengan</p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {[
                                ['Laravel 11','Backend & API'],['React 19','Frontend UI'],['Inertia.js','SPA Routing'],
                                ['Tailwind CSS','Styling'],['xAI Grok','AI Model'],['Vite','Build Tool'],
                            ].map(([name, desc]) => (
                                <div key={name} className="flex items-center gap-2.5 rounded-sm border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm">
                                    <span className="font-bold text-slate-300">{name}</span>
                                    <span className="text-slate-600">&middot;</span>
                                    <span className="text-xs text-slate-600">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="border-t border-slate-800/60 py-28 text-center">
                    <div className="mx-auto max-w-2xl px-6">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-sm border border-violet-500/30 bg-violet-500/10">
                            <Sparkles className="h-8 w-8 text-violet-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Siap Generate Sales Page Pertama Anda?</h2>
                        <p className="mx-auto mt-4 max-w-md text-slate-500">
                            Tidak perlu skill copywriting. Tidak perlu desainer. Cukup isi data produk dan biarkan AI yang bekerja.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={auth?.user ? route('sales-pages.create') : route('register')}
                                className="flex items-center gap-2 rounded-sm bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/25 transition hover:scale-105 hover:bg-violet-500">
                                <Sparkles className="h-4 w-4" />
                                {auth?.user ? 'Buat Sales Page Baru' : 'Daftar & Mulai Gratis'}
                            </Link>
                            {!auth?.user && (
                                <Link href={route('login')} className="text-sm text-slate-500 underline underline-offset-4 transition hover:text-white">
                                    Sudah punya akun? Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800/60 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-violet-600/80">
                                <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-bold text-slate-600">AI Sales Page Generator</span>
                        </div>
                        <p className="text-xs text-slate-700">{new Date().getFullYear()} &middot; Laravel 11 + React + xAI Grok</p>
                    </div>
                </footer>

            </div>
        </>
    );
}