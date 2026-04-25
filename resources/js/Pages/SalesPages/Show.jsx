import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import SalesPagePreview from "@/Components/SalesPagePreview";
import { ArrowLeft, Pencil, Sparkles, RefreshCw, Download, CheckCircle2, AlertCircle, Monitor, Layers, Zap, Wand2, Shuffle, Link2, Save, Palette, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Clipboard, ClipboardCheck, RotateCcw, History } from "lucide-react";

const TEMPLATES = [
    { value: "default", label: "Default",  icon: Monitor, desc: "Premium & Elegan",        hint: "Cocok untuk produk digital & teknologi" },
    { value: "minimal", label: "Minimal",  icon: Layers,  desc: "Bersih & Profesional",    hint: "Cocok untuk jasa, kursus & konsultasi" },
    { value: "bold",    label: "Bold",     icon: Zap,     desc: "Energik & Dramatis",       hint: "Cocok untuk fitness, event & FOMO" },
];

const SECTIONS = [
    { key: "headline",     label: "Judul Utama" },
    { key: "sub_headline", label: "Sub-judul" },
    { key: "description",  label: "Deskripsi" },
    { key: "benefits",     label: "Manfaat" },
    { key: "features",     label: "Fitur" },
    { key: "social_proof", label: "Testimoni" },
    { key: "cta",          label: "Tombol CTA" },
];

const SCHEME_OPTIONS = [
    { key: 'violet',  label: 'Violet',  color: '#7c3aed' },
    { key: 'emerald', label: 'Hijau',   color: '#059669' },
    { key: 'rose',    label: 'Pink',    color: '#e11d48' },
    { key: 'amber',   label: 'Amber',   color: '#d97706' },
    { key: 'sky',     label: 'Biru',    color: '#0ea5e9' },
];

export default function Show({ page }) {
    const content = page.generated_content;
    const { flash } = usePage().props;
    const [generating, setGenerating] = useState(false);
    const [template, setTemplate] = useState(page.template ?? "default");
    const [regeneratingSection, setRegeneratingSection] = useState(null);
    const [loadingTemplate, setLoadingTemplate] = useState(null);
    const [colorScheme, setColorScheme] = useState(content?.color_scheme ?? 'violet');
    const [ctaUrl, setCtaUrl] = useState(content?.cta_url ?? '');
    const [savingScheme, setSavingScheme] = useState(false);
    const [savingCtaUrl, setSavingCtaUrl] = useState(false);
    const [ctaUrlSaved, setCtaUrlSaved] = useState(false);
    const [panelOpen, setPanelOpen] = useState(true);
    const [contentSnapshots, setContentSnapshots] = useState([]); // up to 3 previous versions
    const [copiedSection, setCopiedSection] = useState(null);     // section key showing ✓
    const [reverting, setReverting] = useState(false);
    const prevContentRef = useRef(content);
    const isBusy = generating || loadingTemplate !== null || regeneratingSection !== null || reverting;

    // Track content changes to build history (only for preserveState requests)
    useEffect(() => {
        if (
            content &&
            prevContentRef.current &&
            JSON.stringify(content) !== JSON.stringify(prevContentRef.current)
        ) {
            setContentSnapshots((prev) => [prevContentRef.current, ...prev].slice(0, 3));
        }
        prevContentRef.current = content;
    }, [content]);

    const handleCopySection = (sectionKey) => {
        if (!content) return;
        const val = content[sectionKey];
        const text = Array.isArray(val) ? val.join('\n') : (val ?? '');
        navigator.clipboard.writeText(text).then(() => {
            setCopiedSection(sectionKey);
            setTimeout(() => setCopiedSection(null), 1800);
        });
    };

    const handleRevert = (snapshot) => {
        setReverting(true);
        router.patch(
            route('sales-pages.update-settings', page.id),
            { generated_content: snapshot },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setReverting(false),
                onSuccess: () => setContentSnapshots((prev) => prev.filter((s) => s !== snapshot)),
            }
        );
    };

    // Full generate from scratch (empty state — AI picks template + content)
    const handleAutoRegenerate = () => {
        setGenerating(true);
        router.post(route("sales-pages.generate", page.id), {}, {
            onFinish: () => setGenerating(false),
            onSuccess: () => setTemplate(page.template ?? "default"),
        });
    };

    const handleRegenerateWithTemplate = (tpl) => {
        setLoadingTemplate(tpl);
        setTemplate(tpl);
        router.post(
            route("sales-pages.generate", page.id),
            { forced_template: tpl },
            {
                preserveScroll: true,
                onFinish: () => setLoadingTemplate(null),
            }
        );
    };

    // Content exists: regenerate TEXT only — template & visual settings stay unchanged
    const handleRegenerateContent = () => {
        setGenerating(true);
        router.post(
            route("sales-pages.generate", page.id),
            { keep_template: true },
            {
                preserveScroll: true,
                onFinish: () => setGenerating(false),
            }
        );
    };

    // Content exists: instantly switch template (no AI, no content change)
    const handleSwitchTemplate = (tpl) => {
        setTemplate(tpl);
        router.patch(
            route('sales-pages.update-settings', page.id),
            { template: tpl },
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleRegenerateSection = (section) => {
        setRegeneratingSection(section);
        router.post(
            route("sales-pages.regenerate-section", page.id),
            { section },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setRegeneratingSection(null),
            }
        );
    };

    const handleColorSchemeChange = (scheme) => {
        setColorScheme(scheme);
        setSavingScheme(true);
        router.patch(
            route('sales-pages.update-settings', page.id),
            { color_scheme: scheme },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSavingScheme(false),
            }
        );
    };

    const handleRandomScheme = () => {
        const keys = SCHEME_OPTIONS.map((s) => s.key).filter((k) => k !== colorScheme);
        const random = keys[Math.floor(Math.random() * keys.length)];
        handleColorSchemeChange(random);
    };

    const handleSaveCtaUrl = () => {
        setSavingCtaUrl(true);
        router.patch(
            route('sales-pages.update-settings', page.id),
            { cta_url: ctaUrl },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setSavingCtaUrl(false);
                    setCtaUrlSaved(true);
                    setTimeout(() => setCtaUrlSaved(false), 2000);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            href={route("sales-pages.index")}
                            className="flex shrink-0 items-center justify-center rounded-sm border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:border-slate-600 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-white sm:text-xl">{page.product_name}</h1>
                            <div className="mt-0.5 flex items-center gap-2">
                                {content
                                    ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Konten siap</span>
                                    : <span className="text-xs text-slate-500">Belum ada konten — pilih template di bawah</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={route("sales-pages.edit", page.id)}
                            className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white sm:px-4 sm:py-2.5"
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit Data</span>
                        </Link>
                        {content && (
                            <a
                                href={route("sales-pages.export-html", page.id)}
                                className="flex items-center gap-2 rounded-sm bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 sm:px-4 sm:py-2.5"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export HTML</span>
                            </a>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={page.product_name} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-4 flex items-center gap-3 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                            <CheckCircle2 className="h-4 w-4 shrink-0" /> {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 flex items-center gap-3 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {flash.error}
                        </div>
                    )}

                    {!content ? (
                        /* ── Empty state ── */
                        <div className="flex flex-col items-center rounded-sm border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center sm:py-20">
                            <div className="flex h-20 w-20 items-center justify-center rounded-sm bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
                                <Sparkles className="h-9 w-9 text-violet-400" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-white">Pilih Gaya, Generate Sekarang</h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-400">
                                Pilih template yang sesuai produk Anda — AI akan menyesuaikan tone & warna secara otomatis.
                            </p>
                            <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-3">
                                {TEMPLATES.map((t) => {
                                    const Icon = t.icon;
                                    const isLoading = loadingTemplate === t.value;
                                    return (
                                        <button
                                            key={t.value}
                                            onClick={() => handleRegenerateWithTemplate(t.value)}
                                            disabled={isBusy}
                                            className="group flex flex-col items-center gap-2.5 rounded-sm border border-slate-700 bg-slate-800 px-3 py-5 text-center transition hover:border-violet-500/60 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isLoading
                                                ? <RefreshCw className="h-6 w-6 animate-spin text-violet-400" />
                                                : <Icon className="h-6 w-6 text-violet-400 transition group-hover:scale-110" />
                                            }
                                            <span className="text-sm font-bold text-white">{t.label}</span>
                                            <span className="text-[10px] leading-tight text-slate-500">{t.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-5 flex w-full max-w-lg items-center gap-3">
                                <div className="h-px flex-1 bg-slate-800" />
                                <span className="text-xs text-slate-600">atau biarkan AI yang memilih</span>
                                <div className="h-px flex-1 bg-slate-800" />
                            </div>
                            <button
                                onClick={handleAutoRegenerate}
                                disabled={isBusy}
                                className="mt-5 flex items-center gap-2 rounded-sm border border-violet-500/30 bg-violet-600/10 px-8 py-3 text-sm font-semibold text-violet-400 transition hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {generating
                                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Generating...</>
                                    : <><Wand2 className="h-4 w-4" /> Generate Otomatis (AI Pilih Template)</>
                                }
                            </button>
                        </div>
                    ) : (
                        /* ── Content exists: side-by-side layout ── */
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">

                            {/* Mobile-only: panel toggle bar */}
                            <div className="flex items-center justify-between rounded-sm border border-slate-800 bg-slate-900/80 px-4 py-2.5 lg:hidden">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                                    <span className="text-sm font-semibold text-white">Panel Kontrol AI</span>
                                </div>
                                <button
                                    onClick={() => setPanelOpen(!panelOpen)}
                                    className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
                                >
                                    {panelOpen
                                        ? <><ChevronLeft className="h-3.5 w-3.5" /><span>Sembunyikan</span></>
                                        : <><ChevronRight className="h-3.5 w-3.5" /><span>Tampilkan</span></>
                                    }
                                </button>
                            </div>

                            {/* ── Left Panel ─────────────────────────────────────────── */}
                            {/* Mobile: block/hidden; Desktop: width transition */}
                            <div className={`
                                w-full overflow-hidden
                                lg:shrink-0 lg:sticky lg:top-6 lg:self-start
                                lg:transition-[width] lg:duration-300 lg:ease-in-out
                                ${panelOpen ? 'block lg:w-[268px]' : 'hidden lg:block lg:w-0'}
                            `}>
                                <div className="w-full lg:w-[268px] lg:pr-3">
                                    <div className="overflow-hidden rounded-sm border border-slate-800 bg-slate-900 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto">

                                        {/* Panel header — desktop only */}
                                        <div className="hidden lg:flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Kontrol AI</span>
                                            </div>
                                            <button
                                                onClick={() => setPanelOpen(false)}
                                                className="rounded-sm p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300"
                                                title="Sembunyikan panel"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Section 1 — Template */}
                                        <div className="p-4">
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">Template</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {TEMPLATES.map((t) => {
                                                    const Icon = t.icon;
                                                    const isActive = template === t.value;
                                                    return (
                                                        <button
                                                            key={t.value}
                                                            onClick={() => handleSwitchTemplate(t.value)}
                                                            disabled={generating || regeneratingSection !== null}
                                                            title={t.hint}
                                                            className={`relative flex flex-col items-center gap-1.5 rounded-sm border p-2.5 transition disabled:cursor-not-allowed ${
                                                                isActive
                                                                    ? 'border-violet-500/60 bg-violet-600/10'
                                                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800 disabled:opacity-40'
                                                            }`}
                                                        >
                                                            {isActive && (
                                                                <span className="absolute right-1 top-1 text-[9px] font-black text-violet-400">✓</span>
                                                            )}
                                                            <Icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                                                            <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {/* Generate Ulang Konten — prominent CTA */}
                                            <button
                                                onClick={handleRegenerateContent}
                                                disabled={isBusy}
                                                title="Regenerasi teks & konten saja — template dan warna tidak berubah"
                                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-violet-500/40 bg-violet-600/10 px-3 py-2 text-xs font-semibold text-violet-400 transition hover:border-violet-500/70 hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {generating
                                                    ? <><RefreshCw className="h-3 w-3 animate-spin" /> Generating...</>
                                                    : <><Wand2 className="h-3 w-3" /> Generate Ulang Konten</>
                                                }
                                            </button>
                                        </div>

                                        <div className="border-t border-slate-800" />

                                        {/* Section 2 — Per-section regeneration + copy */}
                                        <div className="p-4">
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">Regenerasi &amp; Salin Bagian</p>
                                            <div className="flex flex-col gap-1.5">
                                                {SECTIONS.map((s) => {
                                                    const isLoading = regeneratingSection === s.key;
                                                    const isCopied = copiedSection === s.key;
                                                    return (
                                                        <div key={s.key} className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => handleRegenerateSection(s.key)}
                                                                disabled={isBusy}
                                                                className={`flex flex-1 items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed ${
                                                                    isLoading
                                                                        ? 'border-violet-500/60 bg-violet-600/15 text-violet-300'
                                                                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-white disabled:opacity-40'
                                                                }`}
                                                            >
                                                                {isLoading && <RefreshCw className="h-3 w-3 animate-spin shrink-0" />}
                                                                {s.label}
                                                            </button>
                                                            <button
                                                                onClick={() => handleCopySection(s.key)}
                                                                disabled={!content}
                                                                title={`Salin ${s.label}`}
                                                                className={`flex shrink-0 items-center justify-center rounded-sm border p-1 transition disabled:opacity-30 ${
                                                                    isCopied
                                                                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                                                                        : 'border-slate-700 bg-slate-800/60 text-slate-500 hover:border-slate-600 hover:text-white'
                                                                }`}
                                                            >
                                                                {isCopied
                                                                    ? <ClipboardCheck className="h-3 w-3" />
                                                                    : <Clipboard className="h-3 w-3" />
                                                                }
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-800" />

                                        {/* Section 3 — Color Scheme */}
                                        <div className="p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Warna Tema</p>
                                                <button
                                                    onClick={handleRandomScheme}
                                                    disabled={isBusy}
                                                    className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400 transition hover:border-slate-600 hover:text-white disabled:opacity-40"
                                                >
                                                    <Shuffle className="h-2.5 w-2.5" /> Acak
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {SCHEME_OPTIONS.map((sc) => (
                                                    <button
                                                        key={sc.key}
                                                        onClick={() => handleColorSchemeChange(sc.key)}
                                                        disabled={isBusy}
                                                        title={sc.label}
                                                        className={`flex flex-col items-center gap-1 rounded-sm border p-1.5 transition disabled:cursor-not-allowed ${
                                                            colorScheme === sc.key
                                                                ? 'border-white/30 bg-white/10'
                                                                : 'border-slate-700 bg-slate-800/60 hover:border-slate-600 disabled:opacity-40'
                                                        }`}
                                                    >
                                                        <span className="h-3 w-3 rounded-full" style={{ background: sc.color }} />
                                                        <span className={`text-[9px] font-medium ${colorScheme === sc.key ? 'text-white' : 'text-slate-500'}`}>{sc.label}</span>
                                                        {colorScheme === sc.key && savingScheme && (
                                                            <RefreshCw className="h-2.5 w-2.5 animate-spin text-slate-400" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-800" />

                                        {/* Section 4 — CTA URL */}
                                        <div className="p-4">
                                            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">Link Tombol CTA</p>
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="text"
                                                    value={ctaUrl}
                                                    onChange={(e) => setCtaUrl(e.target.value)}
                                                    placeholder="https://wa.me/628xxx..."
                                                    className="w-full rounded-sm border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition"
                                                />
                                                <button
                                                    onClick={handleSaveCtaUrl}
                                                    disabled={savingCtaUrl}
                                                    className={`flex w-full items-center justify-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                                                        ctaUrlSaved
                                                            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                                                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-violet-500/50 hover:text-violet-300'
                                                    }`}
                                                >
                                                    {savingCtaUrl
                                                        ? <RefreshCw className="h-3 w-3 animate-spin" />
                                                        : ctaUrlSaved
                                                            ? <><CheckCircle2 className="h-3 w-3" /><span>Tersimpan!</span></>
                                                            : <><Save className="h-3 w-3" /><span>Simpan Link</span></>
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        {/* Section 5 — Content History / Undo */}
                                        {contentSnapshots.length > 0 && (
                                            <>
                                                <div className="border-t border-slate-800" />
                                                <div className="p-4">
                                                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                                        <span className="flex items-center gap-1"><History className="h-3 w-3" /> Riwayat ({contentSnapshots.length})</span>
                                                    </p>
                                                    <div className="flex flex-col gap-1.5">
                                                        {contentSnapshots.map((snap, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleRevert(snap)}
                                                                disabled={isBusy}
                                                                className="flex w-full items-center gap-2 rounded-sm border border-slate-700 bg-slate-800/60 px-2.5 py-2 text-left text-[11px] text-slate-400 transition hover:border-violet-500/40 hover:text-white disabled:opacity-50"
                                                            >
                                                                <RotateCcw className={`h-3 w-3 shrink-0 text-violet-500 ${reverting ? 'animate-spin' : ''}`} />
                                                                <span className="truncate">
                                                                    {i === 0 ? 'Undo terakhir' : `Versi ${i + 1} lalu'`}
                                                                    {snap.headline && (
                                                                        <span className="ml-1 text-slate-600">— {snap.headline.slice(0, 30)}{snap.headline.length > 30 ? '…' : ''}</span>
                                                                    )}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* ── Right: toolbar + preview ────────────────────────────── */}
                            <div className="flex min-w-0 flex-1 flex-col gap-3">

                                {/* Desktop toolbar */}
                                <div className="hidden items-center justify-between lg:flex">
                                    <button
                                        onClick={() => setPanelOpen(!panelOpen)}
                                        className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
                                    >
                                        {panelOpen
                                            ? <><PanelLeftClose className="h-3.5 w-3.5" /><span>Sembunyikan Panel</span></>
                                            : <><PanelLeftOpen className="h-3.5 w-3.5" /><span>Tampilkan Panel</span></>
                                        }
                                    </button>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Preview Live
                                        </span>
                                        <span className="text-slate-700">·</span>
                                        <span className="capitalize text-slate-500">{template}</span>
                                        <span className="text-slate-700">·</span>
                                        <span className="capitalize text-slate-500">{colorScheme}</span>
                                    </div>
                                </div>

                                {/* Preview */}
                                <SalesPagePreview content={content} template={template} colorScheme={colorScheme} ctaUrl={ctaUrl} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
