<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;
use App\Services\AIService;
use Illuminate\Http\Request;
use RuntimeException;

class GenerateController extends Controller
{
    public function __construct(private AIService $aiService) {}

    public function generate(Request $request, SalesPage $salesPage)
    {
        $this->authorize('update', $salesPage);

        $forcedTemplate = null;
        if ($request->has('forced_template') &&
            in_array($request->input('forced_template'), ['default', 'minimal', 'bold'])) {
            $forcedTemplate = $request->input('forced_template');
        }

        // When keep_template=true: regenerate content only, preserve template + visual settings
        $keepTemplate = $request->boolean('keep_template', false);
        if ($keepTemplate && ! $forcedTemplate) {
            $forcedTemplate = $salesPage->template ?? null;
        }

        // Preserve user-set settings (cta_url, color_scheme) when only regenerating content
        $existingSettings = [];
        if ($keepTemplate && $salesPage->generated_content) {
            $existing = $salesPage->generated_content;
            foreach (['cta_url', 'color_scheme'] as $key) {
                if (! empty($existing[$key])) {
                    $existingSettings[$key] = $existing[$key];
                }
            }
        }

        try {
            $content = $this->aiService->generateSalesPage($salesPage->input_data, $forcedTemplate);

            // Merge preserved settings back (overrides AI choices for these fields)
            if ($existingSettings) {
                $content = array_merge($content, $existingSettings);
            }

            // Use forced template if provided; otherwise use AI-chosen template
            $aiTemplate = $forcedTemplate;
            if (! $aiTemplate && isset($content['template']) && in_array($content['template'], ['default', 'minimal', 'bold'])) {
                $aiTemplate = $content['template'];
            }
            unset($content['template']);

            $updateData = [
                'generated_content' => $content,
                'status'            => 'generated',
            ];
            // Only update template column when NOT in keep_template mode
            if ($aiTemplate && ! $keepTemplate) {
                $updateData['template'] = $aiTemplate;
            }

            $salesPage->update($updateData);
        } catch (RuntimeException $e) {
            return back()->withErrors(['ai' => 'Gagal generate konten: ' . $e->getMessage()]);
        }

        return redirect()->route('sales-pages.show', $salesPage->id)
            ->with('success', 'Sales page berhasil digenerate!');
    }

    public function regenerateSection(Request $request, SalesPage $salesPage)
    {
        $this->authorize('update', $salesPage);

        $request->validate([
            'section' => 'required|in:headline,sub_headline,description,benefits,features,social_proof,cta',
        ]);

        $section = $request->input('section');

        if (! $salesPage->generated_content) {
            return back()->withErrors(['ai' => 'Generate halaman terlebih dahulu sebelum meregenerasi bagian.']);
        }

        try {
            $newValue = $this->aiService->regenerateSection(
                $section,
                $salesPage->input_data,
                $salesPage->generated_content
            );

            if ($newValue !== null) {
                $content           = $salesPage->generated_content;
                $content[$section] = $newValue;
                $salesPage->update(['generated_content' => $content]);
            }
        } catch (RuntimeException $e) {
            return back()->withErrors(['ai' => 'Gagal regenerate bagian: ' . $e->getMessage()]);
        }

        $labels = [
            'headline'    => 'Judul',
            'sub_headline'=> 'Sub-judul',
            'description' => 'Deskripsi',
            'benefits'    => 'Manfaat',
            'features'    => 'Fitur',
            'social_proof'=> 'Bukti Sosial',
            'cta'         => 'CTA',
        ];

        return back()->with('success', 'Bagian "' . ($labels[$section] ?? $section) . '" berhasil di-regenerate!');
    }
}

