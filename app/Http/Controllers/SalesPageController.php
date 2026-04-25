<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesPageController extends Controller
{
    public function index(): Response
    {
        $pages = auth()->user()->salesPages()
            ->latest()
            ->get(['id', 'product_name', 'template', 'status', 'created_at', 'generated_content']);

        return Inertia::render('SalesPages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SalesPages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name'        => 'required|string|max:255',
            'description'         => 'required|string',
            'features'            => 'required|string',
            'target_audience'     => 'required|string',
            'price'               => 'required|string',
            'unique_selling_points' => 'nullable|string',
        ]);

        $page = auth()->user()->salesPages()->create([
            'product_name' => $validated['product_name'],
            'input_data'   => $validated,
            'status'       => 'draft',
        ]);

        return redirect()->route('sales-pages.show', $page->id);
    }

    public function show(SalesPage $salesPage): Response
    {
        $this->authorize('view', $salesPage);

        return Inertia::render('SalesPages/Show', [
            'page' => $salesPage,
        ]);
    }

    public function edit(SalesPage $salesPage): Response
    {
        $this->authorize('update', $salesPage);

        return Inertia::render('SalesPages/Edit', [
            'page' => $salesPage,
        ]);
    }

    public function update(Request $request, SalesPage $salesPage)
    {
        $this->authorize('update', $salesPage);

        $validated = $request->validate([
            'product_name'          => 'required|string|max:255',
            'description'           => 'required|string',
            'features'              => 'required|string',
            'target_audience'       => 'required|string',
            'price'                 => 'required|string',
            'unique_selling_points' => 'nullable|string',
            'template'              => 'nullable|in:default,minimal,bold',
        ]);

        $salesPage->update([
            'product_name'      => $validated['product_name'],
            'input_data'        => $validated,
            'template'          => $validated['template'] ?? $salesPage->template,
            'generated_content' => array_key_exists('template', $validated) && count($validated) === 1
                                    ? $salesPage->generated_content  // hanya ganti template, jangan reset
                                    : null,
            'status'            => array_key_exists('template', $validated) && count($validated) === 1
                                    ? $salesPage->status
                                    : 'draft',
        ]);

        return redirect()->route('sales-pages.show', $salesPage->id);
    }

    public function destroy(SalesPage $salesPage)
    {
        $this->authorize('delete', $salesPage);
        $salesPage->delete();

        return redirect()->route('sales-pages.index');
    }

    public function updateSettings(Request $request, SalesPage $salesPage)
    {
        $this->authorize('update', $salesPage);

        $validated = $request->validate([
            'cta_url'          => 'nullable|string|max:500',
            'color_scheme'     => 'nullable|in:violet,emerald,rose,amber,sky',
            'template'         => 'nullable|in:default,minimal,bold',
            'generated_content'=> 'nullable|array',
        ]);

        // Handle full content revert (undo)
        if (!empty($validated['generated_content'])) {
            $salesPage->update(['generated_content' => $validated['generated_content']]);
            return back()->with('success', 'Konten dikembalikan ke versi sebelumnya.');
        }

        $updateData = [];

        // Handle template column update (instant switch — no content change)
        if (!empty($validated['template'])) {
            $updateData['template'] = $validated['template'];
        }

        // Handle generated_content fields (cta_url, color_scheme)
        $content = $salesPage->generated_content ?? [];

        if (array_key_exists('cta_url', $validated)) {
            $content['cta_url'] = $validated['cta_url'] ?: null;
        }
        if (!empty($validated['color_scheme'])) {
            $content['color_scheme'] = $validated['color_scheme'];
        }

        if (!empty($updateData) || $content !== ($salesPage->generated_content ?? [])) {
            $updateData['generated_content'] = $content;
        }

        if (!empty($updateData)) {
            $salesPage->update($updateData);
        }

        return back()->with('success', 'Pengaturan disimpan.');
    }

    public function duplicate(SalesPage $salesPage)
    {
        $this->authorize('view', $salesPage);

        $clone = auth()->user()->salesPages()->create([
            'product_name'      => $salesPage->product_name . ' (Salinan)',
            'input_data'        => $salesPage->input_data,
            'template'          => $salesPage->template,
            'generated_content' => $salesPage->generated_content,
            'status'            => $salesPage->status,
        ]);

        return redirect()
            ->route('sales-pages.show', $clone->id)
            ->with('success', 'Halaman berhasil diduplikasi.');
    }
}
