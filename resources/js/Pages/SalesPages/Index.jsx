import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash2, FileText, CheckCircle2, Clock, Sparkles, Monitor, Layers, Zap } from 'lucide-react';

const TEMPLATE_META = {
    default: { label: 'Default',  icon: Monitor, color: 'text-violet-400',  bg: 'bg-violet-500/10',  bar: 'from-violet-500 to-indigo-500' },
    minimal: { label: 'Minimal',  icon: Layers,  color: 'text-slate-300',   bg: 'bg-slate-700/40',   bar: 'from-slate-500 to-slate-400' },
    bold:    { label: 'Bold',     icon: Zap,     color: 'text-orange-400',  bg: 'bg-orange-500/10',  bar: 'from-orange-500 to-rose-500' },
};

export default function Index({ pages }) {
    const handleDelete = (id) => {
        if (confirm('Hapus halaman ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('sales-pages.destroy', id));
        }
    };

    const generatedCount = pages.filter((p) => p.status === 'generated').length;

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
                        className="flex w-fit items-center gap-2 rounded-sm bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
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
                        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-slate-700 bg-slate-900/50 px-4 py-20 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-slate-800">
                                <FileText className="h-7 w-7 text-slate-500" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">Belum ada sales page</h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-400">
                                Buat sales page pertama Anda dan generate konten dengan AI dalam hitungan detik.
                            </p>
                            <Link
                                href={route('sales-pages.create')}
                                className="mt-6 flex items-center gap-2 rounded-sm bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                            >
                                <Plus className="h-4 w-4" /> Buat Sales Page Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {pages.map((page) => {
                                const tpl = TEMPLATE_META[page.template] ?? TEMPLATE_META.default;
                                const TplIcon = tpl.icon;
                                const isGenerated = page.status === 'generated';
                                const headline = page.generated_content?.headline;
                                return (
                                    <div
                                        key={page.id}
                                        className="group flex flex-col overflow-hidden rounded-sm border border-slate-800 bg-slate-900 transition hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
                                    >
                                        {/* Gradient top bar */}
                                        <div className={`h-1 w-full bg-gradient-to-r ${isGenerated ? tpl.bar : 'bg-slate-800'}`} />

                                        <div className="flex flex-1 flex-col p-5">
                                            {/* Title row */}
                                            <div className="flex items-start gap-3">
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-slate-700 ${tpl.bg}`}>
                                                    <TplIcon className={`h-4 w-4 ${tpl.color}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-bold text-white">{page.product_name}</h3>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {new Date(page.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                                                    isGenerated ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                    {isGenerated
                                                        ? <><CheckCircle2 className="h-3 w-3" /> Done</>
                                                        : <><Clock className="h-3 w-3" /> Draft</>}
                                                </span>
                                            </div>

                                            {/* AI headline or description excerpt */}
                                            {(headline || page.input_data?.description) && (
                                                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                    {headline
                                                        ? <><span className="text-violet-400">"{headline}"</span></>
                                                        : page.input_data.description
                                                    }
                                                </p>
                                            )}

                                            {/* Template chip */}
                                            <div className="mt-3">
                                                <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium ${tpl.bg} ${tpl.color}`}>
                                                    <TplIcon className="h-3 w-3" /> {tpl.label}
                                                </span>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="mt-auto flex gap-2 border-t border-slate-800 pt-4">
                                                <Link
                                                    href={route('sales-pages.show', page.id)}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-violet-600/15 px-3 py-2 text-xs font-medium text-violet-400 transition hover:bg-violet-600/25"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Lihat
                                                </Link>
                                                <Link
                                                    href={route('sales-pages.edit', page.id)}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page.id)}
                                                    title="Hapus"
                                                    className="flex items-center justify-center rounded-sm bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
