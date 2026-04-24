<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Illuminate\Http\Response;

class ExportController extends Controller
{
    public function exportHtml(SalesPage $salesPage): Response
    {
        $this->authorize('view', $salesPage);

        if (! $salesPage->generated_content) {
            abort(404, 'Konten belum digenerate.');
        }

        $c        = $salesPage->generated_content;
        $template = $salesPage->template ?? 'default';
        $name     = e($salesPage->product_name);

        $html = match ($template) {
            'minimal' => $this->renderMinimal($c, $name),
            'bold'    => $this->renderBold($c, $name),
            default   => $this->renderDefault($c, $name),
        };

        $filename = str($salesPage->product_name)->slug() . '-sales-page.html';

        return response($html, 200, [
            'Content-Type'        => 'text/html; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /* ── Color scheme map (mirrors JS SCHEMES) ───────────── */
    private function scheme(array $c): array
    {
        static $map = [
            'violet' => [
                'hero'         => 'linear-gradient(135deg,#6d28d9,#4338ca,#1d4ed8)',
                'cta'          => 'linear-gradient(135deg,#7c3aed,#4338ca)',
                'ctaGlow'      => '0 20px 40px rgba(124,58,237,.3)',
                'pricing'      => 'linear-gradient(to right,#a78bfa,#818cf8)',
                'accent'       => '#a78bfa',
                'accentBg'     => 'rgba(139,92,246,.15)',
                'socialBg'     => 'linear-gradient(135deg,rgba(109,40,217,.25),rgba(67,56,202,.25))',
                'boldRadial'   => 'radial-gradient(ellipse at center,rgba(109,40,217,.15) 0%,transparent 70%)',
                'boldAccent'   => '#c084fc',
                'boldCta'      => '#7c3aed',
                'boldGlow'     => '0 20px 40px rgba(124,58,237,.3)',
                'boldBadgeBd'  => 'rgba(192,132,252,.4)',
                'boldBadgeBg'  => 'rgba(192,132,252,.1)',
                'boldAccentBg' => 'rgba(192,132,252,.15)',
                'minCta'       => '#4f46e5',
            ],
            'emerald' => [
                'hero'         => 'linear-gradient(135deg,#064e3b,#0f766e,#0c4a6e)',
                'cta'          => 'linear-gradient(135deg,#059669,#0891b2)',
                'ctaGlow'      => '0 20px 40px rgba(5,150,105,.3)',
                'pricing'      => 'linear-gradient(to right,#34d399,#22d3ee)',
                'accent'       => '#34d399',
                'accentBg'     => 'rgba(52,211,153,.15)',
                'socialBg'     => 'linear-gradient(135deg,rgba(6,78,59,.4),rgba(12,74,110,.4))',
                'boldRadial'   => 'radial-gradient(ellipse at center,rgba(5,150,105,.15) 0%,transparent 70%)',
                'boldAccent'   => '#34d399',
                'boldCta'      => '#059669',
                'boldGlow'     => '0 20px 40px rgba(5,150,105,.3)',
                'boldBadgeBd'  => 'rgba(52,211,153,.4)',
                'boldBadgeBg'  => 'rgba(52,211,153,.1)',
                'boldAccentBg' => 'rgba(52,211,153,.15)',
                'minCta'       => '#065f46',
            ],
            'rose' => [
                'hero'         => 'linear-gradient(135deg,#9f1239,#be185d,#6d28d9)',
                'cta'          => 'linear-gradient(135deg,#e11d48,#a21caf)',
                'ctaGlow'      => '0 20px 40px rgba(225,29,72,.3)',
                'pricing'      => 'linear-gradient(to right,#fb7185,#e879f9)',
                'accent'       => '#fb7185',
                'accentBg'     => 'rgba(251,113,133,.15)',
                'socialBg'     => 'linear-gradient(135deg,rgba(159,18,57,.3),rgba(109,40,217,.3))',
                'boldRadial'   => 'radial-gradient(ellipse at center,rgba(225,29,72,.15) 0%,transparent 70%)',
                'boldAccent'   => '#fb7185',
                'boldCta'      => '#e11d48',
                'boldGlow'     => '0 20px 40px rgba(225,29,72,.3)',
                'boldBadgeBd'  => 'rgba(251,113,133,.4)',
                'boldBadgeBg'  => 'rgba(251,113,133,.1)',
                'boldAccentBg' => 'rgba(251,113,133,.15)',
                'minCta'       => '#be185d',
            ],
            'amber' => [
                'hero'         => 'linear-gradient(135deg,#78350f,#b45309,#c2410c)',
                'cta'          => 'linear-gradient(135deg,#d97706,#ea580c)',
                'ctaGlow'      => '0 20px 40px rgba(217,119,6,.3)',
                'pricing'      => 'linear-gradient(to right,#fbbf24,#f97316)',
                'accent'       => '#fbbf24',
                'accentBg'     => 'rgba(251,191,36,.15)',
                'socialBg'     => 'linear-gradient(135deg,rgba(120,53,15,.4),rgba(194,65,12,.3))',
                'boldRadial'   => 'radial-gradient(ellipse at center,rgba(249,115,22,.15) 0%,transparent 70%)',
                'boldAccent'   => '#fbbf24',
                'boldCta'      => '#f59e0b',
                'boldGlow'     => '0 20px 40px rgba(249,115,22,.3)',
                'boldBadgeBd'  => 'rgba(251,191,36,.4)',
                'boldBadgeBg'  => 'rgba(251,191,36,.1)',
                'boldAccentBg' => 'rgba(251,191,36,.15)',
                'minCta'       => '#b45309',
            ],
            'sky' => [
                'hero'         => 'linear-gradient(135deg,#0c4a6e,#0369a1,#0e7490)',
                'cta'          => 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
                'ctaGlow'      => '0 20px 40px rgba(14,165,233,.3)',
                'pricing'      => 'linear-gradient(to right,#38bdf8,#34d399)',
                'accent'       => '#38bdf8',
                'accentBg'     => 'rgba(56,189,248,.15)',
                'socialBg'     => 'linear-gradient(135deg,rgba(12,74,110,.4),rgba(14,116,148,.4))',
                'boldRadial'   => 'radial-gradient(ellipse at center,rgba(14,165,233,.15) 0%,transparent 70%)',
                'boldAccent'   => '#38bdf8',
                'boldCta'      => '#0ea5e9',
                'boldGlow'     => '0 20px 40px rgba(14,165,233,.3)',
                'boldBadgeBd'  => 'rgba(56,189,248,.4)',
                'boldBadgeBg'  => 'rgba(56,189,248,.1)',
                'boldAccentBg' => 'rgba(56,189,248,.15)',
                'minCta'       => '#0369a1',
            ],
        ];

        $key = $c['color_scheme'] ?? 'violet';
        return $map[$key] ?? $map['violet'];
    }

    /* ── Shared <head> with Tailwind CDN + Lucide CDN ────── */
    private function head(string $title): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{$title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<style>*{-webkit-font-smoothing:antialiased;box-sizing:border-box}</style>
</head>
HTML;
    }

    /* ── Lucide init script ───────────────────────────────── */
    private function lucideInit(): string
    {
        return '<script>document.addEventListener("DOMContentLoaded",function(){if(typeof lucide!=="undefined")lucide.createIcons();});</script>';
    }

    /* ══════════════════════════════════════════════════════
     * DEFAULT template  — dark, gradient hero
     * ══════════════════════════════════════════════════════ */
    private function renderDefault(array $c, string $name): string
    {
        $s           = $this->scheme($c);
        $headline    = e($c['headline'] ?? '');
        $subHeadline = e($c['sub_headline'] ?? '');
        $description = e($c['description'] ?? '');
        $pricing     = e($c['pricing'] ?? '');
        $cta         = e($c['cta'] ?? 'Dapatkan Sekarang');
        $ctaHref     = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaHeroHref = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaTarget   = !empty($c['cta_url']) ? ' target="_blank" rel="noopener noreferrer"' : '';
        $socialProof = e($c['social_proof'] ?? '');

        $hero        = $s['hero'];
        $ctaGrad     = $s['cta'];
        $ctaGlow     = $s['ctaGlow'];
        $pricingGrad = $s['pricing'];
        $accent      = $s['accent'];
        $accentBg    = $s['accentBg'];
        $socialBg    = $s['socialBg'];
        $minCta      = $s['minCta'];

        /* Benefits */
        $benefitItems = '';
        foreach ($c['benefits'] ?? [] as $b) {
            $b = e($b);
            $benefitItems .= "<div class=\"flex items-start gap-4 rounded-sm border border-slate-700 bg-slate-800/40 p-5 transition hover:border-slate-600\">"
                . "<div class=\"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full\" style=\"background:{$accentBg};color:{$accent}\">"
                . "<i data-lucide=\"check\" style=\"width:.75rem;height:.75rem\"></i>"
                . "</div><p class=\"text-slate-300\">{$b}</p></div>";
        }

        /* Features */
        $featureItems = '';
        foreach ($c['features'] ?? [] as $f) {
            $f = e($f);
            $featureItems .= "<div class=\"rounded-sm border border-slate-700 bg-slate-800/40 p-5 text-center transition hover:border-slate-600\">"
                . "<div class=\"mb-3 flex justify-center\" style=\"color:{$accent}\">"
                . "<i data-lucide=\"zap\" style=\"width:1.75rem;height:1.75rem\"></i>"
                . "</div><p class=\"font-semibold text-slate-200\">{$f}</p></div>";
        }

        /* Sections */
        $benefitsSection = '';
        if ($benefitItems) {
            $benefitsSection = <<<HTML
<div class="border-t border-slate-800 bg-slate-900/60 px-8 py-14">
    <h2 class="mb-2 text-center text-xs font-bold uppercase tracking-widest" style="color:{$accent}">Yang Anda Dapatkan</h2>
    <h3 class="mb-10 text-center text-3xl font-black text-white">Manfaat Nyata</h3>
    <div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">{$benefitItems}</div>
</div>
HTML;
        }

        $featuresSection = '';
        if ($featureItems) {
            $featuresSection = <<<HTML
<div class="border-t border-slate-800 px-8 py-14">
    <h2 class="mb-2 text-center text-xs font-bold uppercase tracking-widest" style="color:{$accent}">Fitur</h2>
    <h3 class="mb-10 text-center text-3xl font-black text-white">Fitur Lengkap</h3>
    <div class="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">{$featureItems}</div>
</div>
HTML;
        }

        $socialSection = '';
        if ($socialProof) {
            $socialSection = <<<HTML
<div class="border-t border-slate-800 px-8 py-14 text-center" style="background:{$socialBg}">
    <div class="mb-4 flex justify-center" style="color:{$accent}">
        <i data-lucide="quote" style="width:2rem;height:2rem"></i>
    </div>
    <blockquote class="mx-auto max-w-2xl text-xl italic text-slate-300">{$socialProof}</blockquote>
</div>
HTML;
        }

        $head   = $this->head($name);
        $lucide = $this->lucideInit();

        return <<<HTML
{$head}
<body class="bg-slate-950 text-white">

<!-- Hero -->
<div class="relative overflow-hidden px-8 py-20 text-center">
    <div class="absolute inset-0" style="background:{$hero}"></div>
    <div class="absolute inset-0" style="background:radial-gradient(ellipse at top,rgba(255,255,255,.08) 0%,transparent 70%)"></div>
    <div class="relative z-10 mx-auto max-w-4xl">
        <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
            <i data-lucide="sparkles" style="width:.75rem;height:.75rem"></i> Sales Page
        </span>
        <h1 class="mt-6 font-black leading-tight text-white drop-shadow-lg" style="font-size:clamp(2rem,5vw,3.75rem)">{$headline}</h1>
        <p class="mx-auto mt-5 max-w-xl text-xl" style="color:rgba(255,255,255,.8)">{$subHeadline}</p>
        <a href="{$ctaHeroHref}"{$ctaTarget} class="mt-10 inline-flex items-center gap-2 rounded-sm bg-white px-10 py-4 text-lg font-black shadow-2xl transition hover:opacity-90" style="color:{$minCta}">
            {$cta} <i data-lucide="arrow-right" style="width:1.125rem;height:1.125rem"></i>
        </a>
    </div>
</div>

<!-- Description -->
<div class="bg-slate-950 px-8 py-14">
    <p class="mx-auto max-w-2xl text-center text-lg leading-relaxed text-slate-300">{$description}</p>
</div>

{$benefitsSection}
{$featuresSection}
{$socialSection}

<!-- Pricing / CTA -->
<div class="border-t border-slate-800 bg-slate-950 px-8 py-20 text-center" id="pricing">
    <p class="text-sm font-semibold uppercase tracking-widest text-slate-500">Harga Spesial</p>
    <div class="mt-3 font-black" style="font-size:clamp(2.5rem,6vw,3.75rem);background:{$pricingGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">{$pricing}</div>
    <a href="{$ctaHref}"{$ctaTarget} class="mt-8 inline-flex items-center gap-2 rounded-sm px-12 py-5 text-xl font-black text-white transition hover:opacity-90" style="background:{$ctaGrad};box-shadow:{$ctaGlow}">
        {$cta} <i data-lucide="arrow-right" style="width:1.125rem;height:1.125rem"></i>
    </a>
</div>

{$lucide}
</body></html>
HTML;
    }

    /* ══════════════════════════════════════════════════════
     * MINIMAL template  — light, clean card
     * ══════════════════════════════════════════════════════ */
    private function renderMinimal(array $c, string $name): string
    {
        $s           = $this->scheme($c);
        $headline    = e($c['headline'] ?? '');
        $subHeadline = e($c['sub_headline'] ?? '');
        $description = e($c['description'] ?? '');
        $pricing     = e($c['pricing'] ?? '');
        $cta         = e($c['cta'] ?? 'Dapatkan Sekarang');
        $ctaHref     = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaHeroHref = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaTarget   = !empty($c['cta_url']) ? ' target="_blank" rel="noopener noreferrer"' : '';
        $socialProof = e($c['social_proof'] ?? '');
        $minCta      = $s['minCta'];

        /* Benefits — numbered circles */
        $benefitItems = '';
        $idx = 0;
        foreach ($c['benefits'] ?? [] as $b) {
            $b = e($b);
            $idx++;
            $benefitItems .= "<li class=\"flex items-start gap-4\">"
                . "<span class=\"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white\" style=\"background:{$minCta}\">{$idx}</span>"
                . "<p class=\"text-gray-700\">{$b}</p></li>";
        }

        /* Features — dash list */
        $featureItems = '';
        foreach ($c['features'] ?? [] as $f) {
            $f = e($f);
            $featureItems .= "<div class=\"flex items-center gap-3 text-gray-700\">"
                . "<i data-lucide=\"minus\" style=\"width:.875rem;height:.875rem;color:#d1d5db\"></i>"
                . "<span class=\"font-medium\">{$f}</span></div>";
        }

        $benefitsSection = '';
        if ($benefitItems) {
            $benefitsSection = <<<HTML
<div class="border-t border-gray-100 bg-gray-50 px-12 py-12">
    <h2 class="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Manfaat</h2>
    <h3 class="mb-8 text-2xl font-black text-gray-900">Yang Anda Dapatkan</h3>
    <ul class="max-w-xl space-y-4">{$benefitItems}</ul>
</div>
HTML;
        }

        $featuresSection = '';
        if ($featureItems) {
            $featuresSection = <<<HTML
<div class="border-t border-gray-100 px-12 py-12">
    <h2 class="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Fitur</h2>
    <h3 class="mb-8 text-2xl font-black text-gray-900">Semua Yang Anda Butuhkan</h3>
    <div class="grid max-w-xl gap-3 md:grid-cols-2">{$featureItems}</div>
</div>
HTML;
        }

        $socialSection = '';
        if ($socialProof) {
            $socialSection = <<<HTML
<div class="border-t border-gray-100 px-12 py-12 text-center">
    <div class="mb-4 flex justify-center text-gray-300">
        <i data-lucide="quote" style="width:2rem;height:2rem"></i>
    </div>
    <blockquote class="mx-auto max-w-lg text-lg italic text-gray-500">{$socialProof}</blockquote>
</div>
HTML;
        }

        $head   = $this->head($name);
        $lucide = $this->lucideInit();

        return <<<HTML
{$head}
<body class="bg-gray-100 text-gray-900">
<div class="mx-auto my-8 max-w-3xl overflow-hidden rounded-sm bg-white shadow-xl">

<!-- Hero -->
<div class="px-12 py-20 text-center">
    <span class="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">{$pricing}</span>
    <h1 class="mx-auto mt-6 max-w-3xl font-black leading-tight tracking-tight text-gray-900" style="font-size:clamp(2rem,5vw,3.75rem)">{$headline}</h1>
    <p class="mx-auto mt-6 max-w-xl text-xl text-gray-500">{$subHeadline}</p>
    <div class="mt-10 flex items-center justify-center gap-4">
        <a href="{$ctaHeroHref}"{$ctaTarget} class="rounded-sm px-10 py-4 text-base font-black text-white shadow-lg transition hover:opacity-90" style="background:{$minCta}">{$cta}</a>
        <span class="text-sm text-gray-400">Tidak ada risiko</span>
    </div>
</div>
<hr class="mx-12 border-gray-100">

<!-- Description -->
<div class="px-12 py-12">
    <p class="mx-auto max-w-xl text-center text-lg leading-relaxed text-gray-600">{$description}</p>
</div>

{$benefitsSection}
{$featuresSection}
{$socialSection}

<!-- Pricing / CTA -->
<div class="border-t border-gray-100 bg-gray-50 px-12 py-14 text-center" id="pricing">
    <p class="text-sm uppercase tracking-widest text-gray-400">Investasi Anda</p>
    <div class="mt-2 font-black text-gray-900" style="font-size:clamp(2rem,5vw,3rem)">{$pricing}</div>
    <a href="{$ctaHref}"{$ctaTarget} class="mt-6 inline-flex items-center gap-2 rounded-sm px-12 py-4 text-lg font-black text-white shadow-lg transition hover:opacity-90" style="background:{$minCta}">
        {$cta} <i data-lucide="arrow-right" style="width:1rem;height:1rem"></i>
    </a>
    <p class="mt-4 text-xs text-gray-400">Garansi uang kembali 30 hari</p>
</div>

</div>
{$lucide}
</body></html>
HTML;
    }

    /* ══════════════════════════════════════════════════════
     * BOLD template  — dark, high-contrast, dramatic
     * ══════════════════════════════════════════════════════ */
    private function renderBold(array $c, string $name): string
    {
        $s           = $this->scheme($c);
        $headline    = $c['headline'] ?? '';
        $subHeadline = e($c['sub_headline'] ?? '');
        $description = e($c['description'] ?? '');
        $pricing     = e($c['pricing'] ?? '');
        $cta         = e($c['cta'] ?? 'Dapatkan Sekarang');
        $ctaHref     = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaHeroHref = !empty($c['cta_url']) ? e($c['cta_url']) : 'javascript:void(0)';
        $ctaTarget   = !empty($c['cta_url']) ? ' target="_blank" rel="noopener noreferrer"' : '';
        $socialProof = e($c['social_proof'] ?? '');

        $boldAccent   = $s['boldAccent'];
        $boldCta      = $s['boldCta'];
        $boldGlow     = $s['boldGlow'];
        $boldRadial   = $s['boldRadial'];
        $boldBadgeBd  = $s['boldBadgeBd'];
        $boldBadgeBg  = $s['boldBadgeBg'];
        $boldAccentBg = $s['boldAccentBg'];

        /* Alternating word colour for headline (mirrors JSX) */
        $words        = explode(' ', $headline);
        $headlineHtml = '';
        foreach ($words as $i => $w) {
            $w = e($w);
            if ($i % 3 === 2) {
                $headlineHtml .= " <span style=\"color:{$boldAccent}\">{$w}</span>";
            } else {
                $headlineHtml .= " {$w}";
            }
        }

        /* Benefits */
        $benefitItems = '';
        foreach ($c['benefits'] ?? [] as $b) {
            $b = e($b);
            $benefitItems .= "<div class=\"flex items-start gap-4 rounded-sm border border-gray-700 bg-gray-800/40 p-5 transition hover:border-gray-600\">"
                . "<div class=\"flex h-8 w-8 shrink-0 items-center justify-center rounded-sm\" style=\"background:{$boldAccentBg};color:{$boldAccent}\">"
                . "<i data-lucide=\"check\" style=\"width:.875rem;height:.875rem\"></i>"
                . "</div><p class=\"text-gray-300\">{$b}</p></div>";
        }

        /* Features */
        $featureItems = '';
        foreach ($c['features'] ?? [] as $f) {
            $f = e($f);
            $featureItems .= "<div class=\"rounded-sm border border-gray-700 bg-gray-800/40 p-6 text-center transition hover:border-gray-600\">"
                . "<div class=\"mb-3 flex justify-center\" style=\"color:{$boldAccent}\">"
                . "<i data-lucide=\"zap\" style=\"width:2rem;height:2rem\"></i>"
                . "</div><p class=\"font-bold text-gray-200\">{$f}</p></div>";
        }

        $benefitsSection = '';
        if ($benefitItems) {
            $benefitsSection = <<<HTML
<div class="border-t border-gray-800 bg-gray-900/50 px-8 py-14">
    <h2 class="mb-2 text-center text-xs font-black uppercase tracking-widest" style="color:{$boldAccent}">Kenapa Pilih Kami?</h2>
    <h3 class="mb-10 text-center text-4xl font-black uppercase text-white">Manfaat</h3>
    <div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">{$benefitItems}</div>
</div>
HTML;
        }

        $featuresSection = '';
        if ($featureItems) {
            $featuresSection = <<<HTML
<div class="border-t border-gray-800 px-8 py-14">
    <h2 class="mb-2 text-center text-xs font-black uppercase tracking-widest" style="color:{$boldAccent}">Apa yang Anda Dapat</h2>
    <h3 class="mb-10 text-center text-4xl font-black uppercase text-white">Fitur</h3>
    <div class="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">{$featureItems}</div>
</div>
HTML;
        }

        $socialSection = '';
        if ($socialProof) {
            $socialSection = <<<HTML
<div class="border-t border-gray-800 bg-gray-900/50 px-8 py-14 text-center">
    <div class="mb-0 flex justify-center" style="color:{$boldAccent};opacity:.3">
        <i data-lucide="quote" style="width:3rem;height:3rem"></i>
    </div>
    <blockquote class="-mt-2 mx-auto max-w-2xl text-2xl font-bold italic text-gray-300">{$socialProof}</blockquote>
</div>
HTML;
        }

        $head   = $this->head($name);
        $lucide = $this->lucideInit();

        return <<<HTML
{$head}
<body class="bg-gray-950 text-white" style="border-top:4px solid {$boldAccent}">

<!-- Hero -->
<div class="relative overflow-hidden px-8 py-24 text-center" style="background:#030712">
    <div class="absolute inset-0" style="background:{$boldRadial}"></div>
    <div class="relative z-10 mx-auto max-w-5xl">
        <span class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest" style="border:1px solid {$boldBadgeBd};background:{$boldBadgeBg};color:{$boldAccent}">
            <i data-lucide="flame" style="width:.75rem;height:.75rem"></i> Penawaran Eksklusif
        </span>
        <h1 class="mx-auto mt-6 max-w-4xl font-black leading-none tracking-tight text-white" style="font-size:clamp(2rem,6vw,4.5rem)">{$headlineHtml}</h1>
        <p class="mx-auto mt-6 max-w-xl text-xl text-gray-400">{$subHeadline}</p>
        <a href="{$ctaHeroHref}"{$ctaTarget} class="mt-12 inline-flex items-center gap-3 rounded-sm px-12 py-5 text-xl font-black text-white transition hover:opacity-90" style="background:{$boldCta};box-shadow:{$boldGlow}">
            {$cta} <i data-lucide="arrow-right" style="width:1.125rem;height:1.125rem"></i>
        </a>
    </div>
</div>

<!-- Description -->
<div class="border-t border-gray-800 bg-gray-950 px-8 py-12">
    <p class="mx-auto max-w-2xl text-center text-lg leading-relaxed text-gray-400">{$description}</p>
</div>

{$benefitsSection}
{$featuresSection}
{$socialSection}

<!-- Pricing / CTA -->
<div class="border-t border-gray-800 bg-gray-950 px-8 py-20 text-center" id="pricing">
    <p class="text-sm font-black uppercase tracking-widest text-gray-500">Harga Hari Ini</p>
    <div class="mt-3 font-black" style="font-size:clamp(2.5rem,6vw,3.75rem);color:{$boldAccent}">{$pricing}</div>
    <a href="{$ctaHref}"{$ctaTarget} class="mt-10 inline-flex items-center gap-3 rounded-sm px-14 py-5 text-xl font-black text-white transition hover:opacity-90" style="background:{$boldCta};box-shadow:{$boldGlow}">
        {$cta} <i data-lucide="arrow-right" style="width:1.125rem;height:1.125rem"></i>
    </a>
</div>

{$lucide}
</body></html>
HTML;
    }
}
