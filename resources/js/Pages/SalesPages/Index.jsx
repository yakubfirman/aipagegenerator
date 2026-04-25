import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, Eye, Pencil, Trash2, FileText, CheckCircle2, Clock,
    Monitor, Layers, Zap, Search, SlidersHorizontal, Copy,
    LayoutGrid, List, X, ChevronDown,
} from 'lucide-react';

const TEMPLATE_META = {
    default: { label: 'Default',  icon: Monitor, color: 'text-violet-400',  bg: 'bg-violet-500/10',  bar: 'from-violet-500 to-indigo-500' },
    minimal: { label: 'Minimal',  icon: Layers,  color: 'text-slate-300',   bg: 'bg-slate-700/40',   bar: 'from-slate-500 to-slate-400' },
    bold:    { label: 'Bold',     icon: Zap,     color: 'text-orange-400',  bg: 'bg-orange-500/10',  bar: 'from-orange-500 to-rose-500' },
};

const SORT_OPTIONS = [
    { value: 'newest',  label: 'Terbaru' },
    { value: 'oldest',  label: 'Terlama' },
    { value: 'name',    label: 'Nama A–Z' },
];

export default function Index({ pages }) {
    const [search, setSearch]         = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTemplate, setFilterTemplate] = useState('all');
    const [sort, setSort]             = useState('newest');
    const [viewMode, setViewMode]     = useState('grid'); // grid | list
    const [duplicating, setDuplicating] = useState(null);
    const [sortOpen, setSortOpen]     = useState(false);

    const handleDelete = (id) => {
        if (confirm('Hapus halaman ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('sales-pages.destroy', id));
        }
    };

    const handleDuplicate = (id) => {
        setDuplicating(id);
        router.post(route('sales-pages.duplicate', id), {}, {
            onFinish: () => setDuplicating(null),
        });
    };

    const filtered = useMemo(() => {
        let result = [...pages];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((p) =>
                p.product_name.toLowerCase().includes(q) ||
                (p.generated_content?.headline ?? '').toLowerCase().includes(q)
            );
        }
        if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus);
        if (filterTemplate !== 'all') result = result.filter((p) => (p.template ?? 'default') === filterTemplate);
        if (sort === 'oldest') result = [...result].reverse();
        if (sort === 'name')   result = [...result].sort((a, b) => a.product_name.localeCompare(b.product_name));
        return result;
    }, [pages, search, filterStatus, filterTemplate, sort]);

    const generatedCount = pages.filter((p) => p.status === 'generated').length;
    const hasFilters = search || filterStatus !== 'all' || filterTemplate !== 'all';
    const clearFilters = () => { setSearch(''); setFilterStatus('all'); setFilterTemplate('all'); };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Sales Pages Saya</h1>
                        <p className="mt-0.5 text-sm text-slate-400">
                            {pages.length} halaman &nbsp;·&nbsp;
                            <span className="text-emerald-400">{generatedCount} generated</span>
                            {pages.length - generatedCount > 0 && (
                                <span className="text-amber-400"> · {pages.length - generatedCount} draft</span>
                            )}
                        </p>
                    </div>
                    <Link
                        href={route('sales-pages.create')}
                        className="flex w-fit items-center gap-2 rounded-sm bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 hover:scale-105"
                    >
                        <Plus className="h-4 w-4" /> Buat Baru
                    </Link>
                </div>
            }
        >
            <Head title="Sales Pages" />

            <div className="py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {pages.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-slate-700 bg-slate-900/50 px-4 py-20 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-slate-800">
                                <FileText className="h-7 w-7 text-slate-500" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">Belum ada sales page</h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-400">Buat sales page pertama Anda dan generate konten dengan AI dalam hitungan detik.</p>
                            <Link href={route('sales-pages.create')} className="mt-6 flex items-center gap-2 rounded-sm bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 hover:scale-105">
                                <Plus className="h-4 w-4" /> Buat Sales Page Pertama
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* ── Toolbar ──────────────────────────────── */}
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama produk atau headline..."
                                        className="w-full rounded-sm border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition"
                                    />
                                    {search && (
                                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Filters */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Status filter */}
                                    <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 p-1">
                                        {[['all', 'Semua'], ['generated', 'Done'], ['draft', 'Draft']].map(([val, lbl]) => (
                                            <button key={val} onClick={() => setFilterStatus(val)}
                                                className={`rounded-sm px-2.5 py-1 text-xs font-medium transition ${filterStatus === val ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                                {lbl}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Template filter */}
                                    <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 p-1">
                                        {[['all', 'Template'], ['default', 'Default'], ['minimal', 'Minimal'], ['bold', 'Bold']].map(([val, lbl]) => (
                                            <button key={val} onClick={() => setFilterTemplate(val)}
                                                className={`rounded-sm px-2.5 py-1 text-xs font-medium transition ${filterTemplate === val ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                                {lbl}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort */}
                                    <div className="relative">
                                        <button onClick={() => setSortOpen(!sortOpen)}
                                            className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition">
                                            <SlidersHorizontal className="h-3.5 w-3.5" />
                                            {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                                            <ChevronDown className="h-3 w-3" />
                                        </button>
                                        {sortOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                                                <div className="absolute right-0 z-20 mt-1 w-36 rounded-sm border border-slate-700 bg-slate-900 py-1 shadow-xl">
                                                    {SORT_OPTIONS.map((o) => (
                                                        <button key={o.value} onClick={() => { setSort(o.value); setSortOpen(false); }}
                                                            className={`flex w-full items-center px-3 py-2 text-xs transition ${sort === o.value ? 'text-violet-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                                            {o.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* View mode toggle */}
                                    <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 p-1">
                                        <button onClick={() => setViewMode('grid')}
                                            className={`rounded-sm p-1.5 transition ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`} title="Grid">
                                            <LayoutGrid className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => setViewMode('list')}
                                            className={`rounded-sm p-1.5 transition ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`} title="List">
                                            <List className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active filters badge */}
                            {hasFilters && (
                                <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                                    <span>{filtered.length} dari {pages.length} halaman</span>
                                    <button onClick={clearFilters} className="flex items-center gap-1 rounded-full border border-slate-700 px-2 py-0.5 text-slate-500 hover:text-white transition">
                                        <X className="h-3 w-3" /> Reset filter
                                    </button>
                                </div>
                            )}

                            {/* No results */}
                            {filtered.length === 0 && (
                                <div className="flex flex-col items-center rounded-sm border border-dashed border-slate-700 py-12 text-center">
                                    <Search className="h-8 w-8 text-slate-700" />
                                    <p className="mt-3 text-sm font-medium text-slate-500">Tidak ada hasil ditemukan</p>
                                    <button onClick={clearFilters} className="mt-2 text-xs text-violet-400 hover:text-violet-300">Reset filter</button>
                                </div>
                            )}

                            {/* ── Grid view ────────────────────────────── */}
                            {viewMode === 'grid' && filtered.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {filtered.map((page) => {
                                        const tpl = TEMPLATE_META[page.template] ?? TEMPLATE_META.default;
                                        const TplIcon = tpl.icon;
                                        const isGenerated = page.status === 'generated';
                                        const headline = page.generated_content?.headline;
                                        return (
                                            <div key={page.id} className="group flex flex-col overflow-hidden rounded-sm border border-slate-800 bg-slate-900 transition hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                                                <div className={`h-1 w-full bg-gradient-to-r ${isGenerated ? tpl.bar : 'bg-slate-800'}`} />
                                                <div className="flex flex-1 flex-col p-5">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-slate-700 ${tpl.bg}`}>
                                                            <TplIcon className={`h-4 w-4 ${tpl.color}`} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="truncate font-bold text-white">{page.product_name}</h3>
                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                {new Date(page.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${isGenerated ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                            {isGenerated ? <><CheckCircle2 className="h-3 w-3" />Done</> : <><Clock className="h-3 w-3" />Draft</>}
                                                        </span>
                                                    </div>
                                                    {(headline || page.generated_content?.description) && (
                                                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                            {headline ? <span className="text-violet-400">"{headline}"</span> : page.generated_content.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-3">
                                                        <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium ${tpl.bg} ${tpl.color}`}>
                                                            <TplIcon className="h-3 w-3" /> {tpl.label}
                                                        </span>
                                                    </div>
                                                    <div className="mt-auto flex gap-2 border-t border-slate-800 pt-4">
                                                        <Link href={route('sales-pages.show', page.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-violet-600/15 px-3 py-2 text-xs font-medium text-violet-400 transition hover:bg-violet-600/25">
                                                            <Eye className="h-3.5 w-3.5" /> Lihat
                                                        </Link>
                                                        <Link href={route('sales-pages.edit', page.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700">
                                                            <Pencil className="h-3.5 w-3.5" /> Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDuplicate(page.id)}
                                                            disabled={duplicating === page.id}
                                                            title="Duplikasi"
                                                            className="flex items-center justify-center rounded-sm bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(page.id)} title="Hapus" className="flex items-center justify-center rounded-sm bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── List view ────────────────────────────── */}
                            {viewMode === 'list' && filtered.length > 0 && (
                                <div className="overflow-hidden rounded-sm border border-slate-800 bg-slate-900">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-slate-800">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Produk</th>
                                                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:table-cell">Template</th>
                                                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 md:table-cell">Tanggal</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {filtered.map((page) => {
                                                const tpl = TEMPLATE_META[page.template] ?? TEMPLATE_META.default;
                                                const TplIcon = tpl.icon;
                                                const isGenerated = page.status === 'generated';
                                                return (
                                                    <tr key={page.id} className="group transition hover:bg-slate-800/30">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-sm ${tpl.bg} sm:flex`}>
                                                                    <TplIcon className={`h-3.5 w-3.5 ${tpl.color}`} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-medium text-white max-w-[180px] sm:max-w-xs">{page.product_name}</p>
                                                                    {page.generated_content?.headline && (
                                                                        <p className="truncate text-xs text-violet-400/70 max-w-[180px] sm:max-w-xs">"{page.generated_content.headline}"</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="hidden px-4 py-3 sm:table-cell">
                                                            <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium ${tpl.bg} ${tpl.color}`}>
                                                                <TplIcon className="h-3 w-3" /> {tpl.label}
                                                            </span>
                                                        </td>
                                                        <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
                                                            {new Date(page.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`flex items-center gap-1 text-xs font-medium w-fit ${isGenerated ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                                {isGenerated ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                                {isGenerated ? 'Done' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Link href={route('sales-pages.show', page.id)} className="rounded-sm border border-slate-700 bg-slate-800/60 p-1.5 text-slate-400 transition hover:text-white" title="Lihat">
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </Link>
                                                                <Link href={route('sales-pages.edit', page.id)} className="rounded-sm border border-slate-700 bg-slate-800/60 p-1.5 text-slate-400 transition hover:text-white" title="Edit">
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </Link>
                                                                <button onClick={() => handleDuplicate(page.id)} disabled={duplicating === page.id} className="rounded-sm border border-slate-700 bg-slate-800/60 p-1.5 text-slate-400 transition hover:text-white disabled:opacity-50" title="Duplikasi">
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button onClick={() => handleDelete(page.id)} className="rounded-sm border border-red-500/20 bg-red-500/5 p-1.5 text-red-400 transition hover:bg-red-500/15" title="Hapus">
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}