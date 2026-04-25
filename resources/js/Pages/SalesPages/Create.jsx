import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SalesPagePreview from '@/Components/SalesPagePreview';
import {
    Sparkles, Eye, EyeOff, ChevronRight, Package, FileText,
    Users, Tag, Star, DollarSign, ArrowLeft, Lightbulb, CheckCircle2,
} from 'lucide-react';

const TEMPLATES = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bold',    label: 'Bold' },
];

const TIPS = [
    { icon: '✦', text: 'Nama produk yang spesifik meningkatkan relevansi AI copy.' },
    { icon: '✦', text: 'Sebutkan fitur konkret, bukan abstrak — mis. "Video 4K 60fps", bukan "Video bagus".' },
    { icon: '✦', text: 'Target audiens yang spesifik menghasilkan copywriting yang lebih personal.' },
    { icon: '✦', text: 'USP (Unique Selling Point) membantu AI membuat headline yang lebih kuat.' },
];

/* Character counter component */
function CharCount({ value, max }) {
    const len = value?.length ?? 0;
    const ratio = len / max;
    return (
        <span className={`text-[10px] tabular-nums ${ratio >= 1 ? 'text-red-400' : ratio > 0.8 ? 'text-amber-400' : 'text-slate-600'}`}>
            {len}/{max}
        </span>
    );
}

const InputField = ({ label, icon: Icon, required, error, hint, max, value, children }) => (
    <div>
        <div className="mb-1.5 flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                <Icon className="h-3.5 w-3.5 text-slate-500" />
                {label} {required && <span className="text-violet-400">*</span>}
            </label>
            {max && <CharCount value={value} max={max} />}
        </div>
        {hint && <p className="mb-1.5 text-xs text-slate-600">{hint}</p>}
        {children}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
);

const inputClass = "mt-0 block w-full rounded-sm border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition";

/* Step progress */
function StepProgress({ data }) {
    const fields = ['product_name', 'description', 'features', 'target_audience', 'price'];
    const filled = fields.filter((f) => data[f]?.trim()).length;
    const pct = Math.round((filled / fields.length) * 100);
    return (
        <div className="border-b border-slate-800 px-6 py-3 bg-slate-900/50">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Kelengkapan form</span>
                <span className={`text-xs font-bold ${pct === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {pct === 100 ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Siap generate!</span> : `${pct}%`}
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function Create() {
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState('default');
    const [tipIdx, setTipIdx] = useState(0);
    const { data, setData, post, processing, errors } = useForm({
        product_name: '',
        description: '',
        features: '',
        target_audience: '',
        price: '',
        unique_selling_points: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sales-pages.store'));
    };

    const previewContent = useMemo(() => {
        if (!data.product_name) return null;
        const featureList = data.features
            ? data.features.split(',').map((f) => f.trim()).filter(Boolean)
            : [];
        return {
            headline: data.product_name,
            sub_headline: data.unique_selling_points || 'Sub judul menarik akan muncul di sini',
            description: data.description || 'Deskripsi produk Anda akan ditampilkan di sini.',
            benefits: featureList.length ? featureList : ['Manfaat 1', 'Manfaat 2', 'Manfaat 3'],
            features: featureList.length ? featureList : ['Fitur A', 'Fitur B', 'Fitur C'],
            social_proof: `Cocok untuk: ${data.target_audience || 'target audiens Anda'}`,
            pricing: data.price || 'Harga',
            cta: 'Dapatkan Sekarang',
        };
    }, [data]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('sales-pages.index')} className="flex shrink-0 items-center justify-center rounded-sm border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:border-slate-600 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-white">Buat Sales Page Baru</h1>
                        <p className="mt-0.5 text-sm text-slate-400">Isi data produk — AI akan generate konten & desain secara otomatis</p>
                    </div>
                    {previewContent && (
                        <button type="button" onClick={() => setShowMobilePreview(!showMobilePreview)}
                            className="lg:hidden flex shrink-0 items-center gap-2 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-500 hover:text-violet-300">
                            {showMobilePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Buat Sales Page" />

            <div className="py-8 sm:py-10">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

                    {/* ── Form card ─────────────────────────────── */}
                    <div className="rounded-sm border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-6 py-4">
                            <h2 className="font-semibold text-white">Informasi Produk</h2>
                            <p className="mt-0.5 text-xs text-slate-500">Field bertanda <span className="text-violet-400">*</span> wajib diisi</p>
                        </div>

                        {/* Progress bar */}
                        <StepProgress data={data} />

                        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                            <InputField label="Nama Produk / Layanan" icon={Package} required error={errors.product_name}
                                hint="Nama yang jelas dan spesifik. Mis: 'Kursus Online Desain UI/UX Pemula 2025'"
                                max={100} value={data.product_name}>
                                <input type="text" value={data.product_name} onChange={(e) => setData('product_name', e.target.value)}
                                    className={inputClass} placeholder="contoh: Kursus Online Desain UI/UX" maxLength={100} />
                            </InputField>

                            <InputField label="Deskripsi Produk" icon={FileText} required error={errors.description}
                                hint="Jelaskan manfaat utama dan apa yang membuat produk Anda berbeda"
                                max={600} value={data.description}>
                                <textarea rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)}
                                    className={inputClass} placeholder="Jelaskan produk/layanan Anda secara detail..." maxLength={600} />
                            </InputField>

                            <InputField label="Fitur Utama" icon={Star} required error={errors.features}
                                hint="Pisahkan dengan koma. AI akan menggunakannya sebagai poin manfaat dan fitur."
                                max={400} value={data.features}>
                                <textarea rows={3} value={data.features} onChange={(e) => setData('features', e.target.value)}
                                    className={inputClass} placeholder="Video HD, Sertifikat, Akses Seumur Hidup, Mentor langsung" maxLength={400} />
                            </InputField>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InputField label="Target Audiens" icon={Users} required error={errors.target_audience}
                                    max={100} value={data.target_audience}>
                                    <input type="text" value={data.target_audience} onChange={(e) => setData('target_audience', e.target.value)}
                                        className={inputClass} placeholder="Mahasiswa, profesional muda..." maxLength={100} />
                                </InputField>
                                <InputField label="Harga" icon={DollarSign} required error={errors.price}
                                    max={50} value={data.price}>
                                    <input type="text" value={data.price} onChange={(e) => setData('price', e.target.value)}
                                        className={inputClass} placeholder="Rp 299.000 / bulan" maxLength={50} />
                                </InputField>
                            </div>

                            <InputField label="Keunggulan Unik (USP)" icon={Tag} error={errors.unique_selling_points}
                                hint="Apa yang tidak dimiliki kompetitor? AI akan jadikan ini headline utama."
                                max={200} value={data.unique_selling_points}>
                                <textarea rows={2} value={data.unique_selling_points}
                                    onChange={(e) => setData('unique_selling_points', e.target.value)}
                                    className={inputClass} placeholder="Apa yang membedakan produk Anda dari kompetitor?" maxLength={200} />
                            </InputField>

                            {/* AI Tip */}
                            <div className="flex items-start gap-3 rounded-sm border border-violet-500/20 bg-violet-500/5 px-4 py-3">
                                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-violet-300/80">{TIPS[tipIdx % TIPS.length].text}</p>
                                </div>
                                <button type="button" onClick={() => setTipIdx((i) => i + 1)}
                                    className="shrink-0 text-[10px] font-medium text-violet-500 hover:text-violet-400 transition">Next →</button>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-between">
                                <Link href={route('sales-pages.index')} className="flex items-center justify-center rounded-sm border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-white">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing}
                                    className="flex items-center justify-center gap-2 rounded-sm bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100">
                                    {processing
                                        ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Menyimpan...</>
                                        : <><Sparkles className="h-4 w-4" /> Simpan & Generate AI <ChevronRight className="h-4 w-4" /></>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Live Preview panel ─────────────────────────────── */}
                    <div className={`${showMobilePreview ? 'block' : 'hidden'} lg:block`}>
                        {previewContent ? (
                            <div className="sticky top-20">
                                <div className="mb-3 flex items-center gap-2 rounded-sm border border-slate-800 bg-slate-900 p-3">
                                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                                    <span className="shrink-0 text-xs font-medium text-slate-400">Preview:</span>
                                    {TEMPLATES.map((t) => (
                                        <button key={t.value} type="button" onClick={() => setPreviewTemplate(t.value)}
                                            className={`rounded-sm px-3 py-1 text-xs font-medium transition ${previewTemplate === t.value ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                            {t.label}
                                        </button>
                                    ))}
                                    <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-500">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                                    </span>
                                </div>
                                <div className="overflow-hidden rounded-sm border border-slate-800">
                                    <div className="origin-top-left scale-[0.82]" style={{ width: '122%' }}>
                                        <SalesPagePreview content={previewContent} template={previewTemplate} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-sm border border-dashed border-slate-800 bg-slate-900/30 text-center lg:min-h-[500px]">
                                <Sparkles className="h-8 w-8 text-slate-700" />
                                <p className="mt-3 text-sm font-medium text-slate-600">Preview akan muncul</p>
                                <p className="mt-1 text-xs text-slate-700">saat Anda mulai mengisi nama produk</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}