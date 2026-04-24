/* ── Color Schemes ──────────────────────────────────────────
 * Each scheme drives hero gradient, CTA, accent labels, and
 * template-specific accent colors. AI picks the scheme.
 * ─────────────────────────────────────────────────────────── */
const SCHEMES = {
    violet: {
        hero:         'linear-gradient(135deg,#6d28d9,#4338ca,#1d4ed8)',
        cta:          'linear-gradient(135deg,#7c3aed,#4338ca)',
        ctaGlow:      '0 20px 40px rgba(124,58,237,.3)',
        pricing:      'linear-gradient(to right,#a78bfa,#818cf8)',
        accent:       '#a78bfa',
        accentBg:     'rgba(139,92,246,.15)',
        socialBg:     'linear-gradient(135deg,rgba(109,40,217,.25),rgba(67,56,202,.25))',
        boldRadial:   'radial-gradient(ellipse at center,rgba(109,40,217,.15) 0%,transparent 70%)',
        boldAccent:   '#c084fc',
        boldCta:      '#7c3aed',
        boldGlow:     '0 20px 40px rgba(124,58,237,.3)',
        boldBadgeBd:  'rgba(192,132,252,.4)',
        boldBadgeBg:  'rgba(192,132,252,.1)',
        boldAccentBg: 'rgba(192,132,252,.15)',
        minCta:       '#4f46e5',
    },
    emerald: {
        hero:         'linear-gradient(135deg,#064e3b,#0f766e,#0c4a6e)',
        cta:          'linear-gradient(135deg,#059669,#0891b2)',
        ctaGlow:      '0 20px 40px rgba(5,150,105,.3)',
        pricing:      'linear-gradient(to right,#34d399,#22d3ee)',
        accent:       '#34d399',
        accentBg:     'rgba(52,211,153,.15)',
        socialBg:     'linear-gradient(135deg,rgba(6,78,59,.4),rgba(12,74,110,.4))',
        boldRadial:   'radial-gradient(ellipse at center,rgba(5,150,105,.15) 0%,transparent 70%)',
        boldAccent:   '#34d399',
        boldCta:      '#059669',
        boldGlow:     '0 20px 40px rgba(5,150,105,.3)',
        boldBadgeBd:  'rgba(52,211,153,.4)',
        boldBadgeBg:  'rgba(52,211,153,.1)',
        boldAccentBg: 'rgba(52,211,153,.15)',
        minCta:       '#065f46',
    },
    rose: {
        hero:         'linear-gradient(135deg,#9f1239,#be185d,#6d28d9)',
        cta:          'linear-gradient(135deg,#e11d48,#a21caf)',
        ctaGlow:      '0 20px 40px rgba(225,29,72,.3)',
        pricing:      'linear-gradient(to right,#fb7185,#e879f9)',
        accent:       '#fb7185',
        accentBg:     'rgba(251,113,133,.15)',
        socialBg:     'linear-gradient(135deg,rgba(159,18,57,.3),rgba(109,40,217,.3))',
        boldRadial:   'radial-gradient(ellipse at center,rgba(225,29,72,.15) 0%,transparent 70%)',
        boldAccent:   '#fb7185',
        boldCta:      '#e11d48',
        boldGlow:     '0 20px 40px rgba(225,29,72,.3)',
        boldBadgeBd:  'rgba(251,113,133,.4)',
        boldBadgeBg:  'rgba(251,113,133,.1)',
        boldAccentBg: 'rgba(251,113,133,.15)',
        minCta:       '#be185d',
    },
    amber: {
        hero:         'linear-gradient(135deg,#78350f,#b45309,#c2410c)',
        cta:          'linear-gradient(135deg,#d97706,#ea580c)',
        ctaGlow:      '0 20px 40px rgba(217,119,6,.3)',
        pricing:      'linear-gradient(to right,#fbbf24,#f97316)',
        accent:       '#fbbf24',
        accentBg:     'rgba(251,191,36,.15)',
        socialBg:     'linear-gradient(135deg,rgba(120,53,15,.4),rgba(194,65,12,.3))',
        boldRadial:   'radial-gradient(ellipse at center,rgba(249,115,22,.15) 0%,transparent 70%)',
        boldAccent:   '#fbbf24',
        boldCta:      '#f59e0b',
        boldGlow:     '0 20px 40px rgba(249,115,22,.3)',
        boldBadgeBd:  'rgba(251,191,36,.4)',
        boldBadgeBg:  'rgba(251,191,36,.1)',
        boldAccentBg: 'rgba(251,191,36,.15)',
        minCta:       '#b45309',
    },
    sky: {
        hero:         'linear-gradient(135deg,#0c4a6e,#0369a1,#0e7490)',
        cta:          'linear-gradient(135deg,#0ea5e9,#06b6d4)',
        ctaGlow:      '0 20px 40px rgba(14,165,233,.3)',
        pricing:      'linear-gradient(to right,#38bdf8,#34d399)',
        accent:       '#38bdf8',
        accentBg:     'rgba(56,189,248,.15)',
        socialBg:     'linear-gradient(135deg,rgba(12,74,110,.4),rgba(14,116,148,.4))',
        boldRadial:   'radial-gradient(ellipse at center,rgba(14,165,233,.15) 0%,transparent 70%)',
        boldAccent:   '#38bdf8',
        boldCta:      '#0ea5e9',
        boldGlow:     '0 20px 40px rgba(14,165,233,.3)',
        boldBadgeBd:  'rgba(56,189,248,.4)',
        boldBadgeBg:  'rgba(56,189,248,.1)',
        boldAccentBg: 'rgba(56,189,248,.15)',
        minCta:       '#0369a1',
    },
};

function getScheme(content) {
    return SCHEMES[content?.color_scheme] ?? SCHEMES.violet;
}

/* ── Main export ──────────────────────────────────────────── */
/* ── CTA Link helper ──────────────────────────────────────── */
function CtaLink({ href, style, className, children }) {
    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" style={style} className={className}>
                {children}
            </a>
        );
    }
    return <button style={style} className={className}>{children}</button>;
}

/* ── Main export ──────────────────────────────────────────── */
export default function SalesPagePreview({ content, template = 'default', colorScheme, ctaUrl }) {
    if (!content) return null;
    const mergedContent = {
        ...content,
        ...(colorScheme ? { color_scheme: colorScheme } : {}),
        ...(ctaUrl !== undefined ? { cta_url: ctaUrl } : {}),
    };
    if (template === 'minimal') return <MinimalTemplate content={mergedContent} />;
    if (template === 'bold')    return <BoldTemplate content={mergedContent} />;
    return <DefaultTemplate content={mergedContent} />;
}

/* ── DEFAULT ─────────────────────────────────────────────── */
function DefaultTemplate({ content }) {
    const s = getScheme(content);
    return (
        <div className="overflow-hidden rounded-sm bg-slate-950 shadow-2xl ring-1 ring-white/5">
            {/* Hero */}
            <div className="relative overflow-hidden px-8 py-20 text-center">
                <div className="absolute inset-0" style={{ background: s.hero }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top,rgba(255,255,255,.08) 0%,transparent 70%)' }} />
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                        ✦ Sales Page
                    </span>
                    <h1 className="mt-6 text-5xl font-black leading-tight text-white drop-shadow-lg lg:text-6xl">
                        {content.headline}
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-xl text-white/80">
                        {content.sub_headline}
                    </p>
                    <CtaLink
                        href={content.cta_url}
                        className="mt-10 inline-flex items-center gap-2 rounded-sm bg-white px-10 py-4 text-lg font-black shadow-2xl shadow-black/30 transition hover:scale-105"
                        style={{ color: s.minCta }}
                    >
                        {content.cta} <span>→</span>
                    </CtaLink>
                </div>
            </div>

            {/* Description */}
            <div className="px-8 py-12">
                <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-slate-300">
                    {content.description}
                </p>
            </div>

            {/* Benefits */}
            {content.benefits?.length > 0 && (
                <div className="border-t border-slate-800 bg-slate-900/60 px-8 py-12">
                    <h2 className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: s.accent }}>Yang Anda Dapatkan</h2>
                    <h3 className="mb-10 text-center text-3xl font-black text-white">Manfaat Nyata</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {content.benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-4 rounded-sm border border-slate-700/60 bg-slate-800/40 p-5 backdrop-blur-sm transition hover:border-slate-500/40">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black" style={{ background: s.accentBg, color: s.accent }}>✓</div>
                                <p className="text-slate-300">{b}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            {content.features?.length > 0 && (
                <div className="border-t border-slate-800 px-8 py-12">
                    <h2 className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: s.accent }}>Fitur</h2>
                    <h3 className="mb-10 text-center text-3xl font-black text-white">Fitur Lengkap</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {content.features.map((f, i) => (
                            <div key={i} className="rounded-sm border border-slate-700/60 bg-slate-800/40 p-5 text-center transition hover:border-slate-500/40">
                                <div className="mb-3 text-3xl">⚡</div>
                                <p className="font-semibold text-slate-200">{f}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Proof */}
            {content.social_proof && (
                <div className="border-t border-slate-800 px-8 py-12 text-center" style={{ background: s.socialBg }}>
                    <div className="mb-4 text-3xl" style={{ color: s.accent }}>"</div>
                    <blockquote className="mx-auto max-w-2xl text-xl italic text-slate-300">
                        {content.social_proof}
                    </blockquote>
                </div>
            )}

            {/* CTA */}
            <div className="border-t border-slate-800 px-8 py-16 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Harga Spesial</p>
                <div className="mt-3 text-6xl font-black" style={{
                    background: s.pricing,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    {content.pricing}
                </div>
                <CtaLink
                    href={content.cta_url}
                    className="mt-8 inline-flex items-center gap-2 rounded-sm px-12 py-5 text-xl font-black text-white transition hover:scale-105 hover:opacity-90"
                    style={{ background: s.cta, boxShadow: s.ctaGlow }}
                >
                    {content.cta} <span>→</span>
                </CtaLink>
            </div>
        </div>
    );
}

/* ── MINIMAL ─────────────────────────────────────────────── */
function MinimalTemplate({ content }) {
    const s = getScheme(content);
    return (
        <div className="overflow-hidden rounded-sm bg-white shadow-xl ring-1 ring-black/5">
            {/* Hero */}
            <div className="px-12 py-20 text-center">
                <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {content.pricing}
                </span>
                <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight text-gray-900 lg:text-6xl">
                    {content.headline}
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-xl text-gray-500">{content.sub_headline}</p>
                <div className="mt-10 flex items-center justify-center gap-4">
                    <CtaLink
                        href={content.cta_url}
                        className="rounded-sm px-10 py-4 text-base font-black text-white shadow-lg transition hover:scale-105 hover:opacity-90"
                        style={{ background: s.minCta }}
                    >
                        {content.cta}
                    </CtaLink>
                    <span className="text-sm text-gray-400">Tidak ada risiko</span>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-12 h-px bg-gray-100" />

            {/* Description */}
            <div className="px-12 py-12">
                <p className="mx-auto max-w-xl text-center text-lg leading-relaxed text-gray-600">{content.description}</p>
            </div>

            {/* Benefits */}
            {content.benefits?.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 px-12 py-12">
                    <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Manfaat</h2>
                    <h3 className="mb-8 text-2xl font-black text-gray-900">Yang Anda Dapatkan</h3>
                    <ul className="space-y-4">
                        {content.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <span
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                                    style={{ background: s.minCta }}
                                >
                                    {i + 1}
                                </span>
                                <p className="text-gray-700">{b}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Features */}
            {content.features?.length > 0 && (
                <div className="border-t border-gray-100 px-12 py-12">
                    <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Fitur</h2>
                    <h3 className="mb-8 text-2xl font-black text-gray-900">Semua Yang Anda Butuhkan</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {content.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-700">
                                <span className="text-gray-300">—</span>
                                <span className="font-medium">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Proof */}
            {content.social_proof && (
                <div className="border-t border-gray-100 px-12 py-12 text-center">
                    <svg className="mx-auto mb-4 h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <blockquote className="mx-auto max-w-lg text-lg italic text-gray-500">
                        {content.social_proof}
                    </blockquote>
                </div>
            )}

            {/* CTA */}
            <div className="border-t border-gray-100 bg-gray-50 px-12 py-14 text-center">
                <p className="text-sm uppercase tracking-widest text-gray-400">Investasi Anda</p>
                <div className="mt-2 text-5xl font-black text-gray-900">{content.pricing}</div>
                <CtaLink
                    href={content.cta_url}
                    className="mt-6 rounded-sm px-12 py-4 text-lg font-black text-white shadow-lg transition hover:scale-105 hover:opacity-90"
                    style={{ background: s.minCta }}
                >
                    {content.cta}
                </CtaLink>
                <p className="mt-4 text-xs text-gray-400">Garansi uang kembali 30 hari</p>
            </div>
        </div>
    );
}

/* ── BOLD ────────────────────────────────────────────────── */
function BoldTemplate({ content }) {
    const s = getScheme(content);
    return (
        <div
            className="overflow-hidden rounded-sm bg-gray-950 text-white shadow-2xl"
            style={{ border: `1px solid ${s.boldBadgeBd}` }}
        >
            {/* Hero */}
            <div className="relative overflow-hidden px-8 py-24 text-center">
                <div className="absolute inset-0" style={{ background: s.boldRadial }} />
                <div className="relative z-10">
                    <span
                        className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest"
                        style={{ border: `1px solid ${s.boldBadgeBd}`, background: s.boldBadgeBg, color: s.boldAccent }}
                    >
                        🔥 Penawaran Eksklusif
                    </span>
                    <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-none tracking-tight lg:text-7xl">
                        {content.headline.split(' ').map((word, i) =>
                            i % 3 === 2
                                ? <span key={i} style={{ color: s.boldAccent }}> {word} </span>
                                : <span key={i}> {word} </span>
                        )}
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-xl text-gray-400">{content.sub_headline}</p>
                    <CtaLink
                        href={content.cta_url}
                        className="mt-12 inline-flex items-center gap-3 rounded-sm px-12 py-5 text-xl font-black text-white transition hover:scale-105 hover:opacity-90"
                        style={{ background: s.boldCta, boxShadow: s.boldGlow }}
                    >
                        {content.cta} <span className="text-2xl">→</span>
                    </CtaLink>
                </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-800 px-8 py-12">
                <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-gray-400">{content.description}</p>
            </div>

            {/* Benefits */}
            {content.benefits?.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-900/50 px-8 py-14">
                    <h2 className="mb-2 text-center text-xs font-black uppercase tracking-widest" style={{ color: s.boldAccent }}>Kenapa Pilih Kami?</h2>
                    <h3 className="mb-10 text-center text-4xl font-black uppercase text-white">Manfaat</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {content.benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-4 rounded-sm border border-gray-700/60 bg-gray-800/40 p-5 transition hover:border-gray-500/40">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-black"
                                    style={{ background: s.boldAccentBg, color: s.boldAccent }}
                                >✓</div>
                                <p className="text-gray-300">{b}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            {content.features?.length > 0 && (
                <div className="border-t border-gray-800 px-8 py-14">
                    <h2 className="mb-2 text-center text-xs font-black uppercase tracking-widest" style={{ color: s.boldAccent }}>Apa yang Anda Dapat</h2>
                    <h3 className="mb-10 text-center text-4xl font-black uppercase text-white">Fitur</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {content.features.map((f, i) => (
                            <div key={i} className="rounded-sm border border-gray-700/60 bg-gray-800/40 p-6 text-center transition hover:border-gray-500/40">
                                <div className="mb-3 text-4xl">⚡</div>
                                <p className="font-bold text-gray-200">{f}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Proof */}
            {content.social_proof && (
                <div className="border-t border-gray-800 bg-gray-900/50 px-8 py-14 text-center">
                    <div className="mb-0 text-5xl" style={{ color: s.boldAccent, opacity: 0.3 }}>"</div>
                    <blockquote className="-mt-2 mx-auto max-w-2xl text-2xl font-bold italic text-gray-300">
                        {content.social_proof}
                    </blockquote>
                </div>
            )}

            {/* CTA */}
            <div className="border-t border-gray-800 px-8 py-20 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-gray-500">Harga Hari Ini</p>
                <div className="mt-3 text-6xl font-black" style={{ color: s.boldAccent }}>{content.pricing}</div>
                <CtaLink
                    href={content.cta_url}
                    className="mt-10 inline-flex items-center gap-3 rounded-sm px-14 py-5 text-xl font-black text-white transition hover:scale-105 hover:opacity-90"
                    style={{ background: s.boldCta, boxShadow: s.boldGlow }}
                >
                    {content.cta} <span className="text-2xl">→</span>
                </CtaLink>
            </div>
        </div>
    );
}
