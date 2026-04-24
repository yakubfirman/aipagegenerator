<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class AIService
{
    private string $apiKey;
    private string $apiUrl;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.xai.key');
        $this->apiUrl = config('services.xai.url');
        $this->model  = config('services.xai.model');
    }

    public function generateSalesPage(array $inputData, ?string $forcedTemplate = null): array
    {
        $prompt = $this->buildPrompt($inputData, $forcedTemplate);

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post("{$this->apiUrl}/chat/completions", [
                'model'       => $this->model,
                'temperature' => 0.7,
                'messages'    => [
                    [
                        'role'    => 'system',
                        'content' => 'You are an expert copywriter and marketing specialist. Always respond with valid JSON only, no markdown, no extra text.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('AI API request failed: ' . $response->body());
        }

        $content = $response->json('choices.0.message.content');

        $parsed = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException('Failed to parse AI response as JSON.');
        }

        return $parsed;
    }

    /**
     * Regenerate a single section of an existing sales page.
     */
    public function regenerateSection(string $section, array $inputData, array $currentContent): mixed
    {
        $prompt = $this->buildSectionPrompt($section, $inputData, $currentContent);

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post("{$this->apiUrl}/chat/completions", [
                'model'       => $this->model,
                'temperature' => 0.8,
                'messages'    => [
                    [
                        'role'    => 'system',
                        'content' => 'You are an expert copywriter. Always respond with valid JSON only, no markdown, no extra text.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('AI API request failed: ' . $response->body());
        }

        $raw    = $response->json('choices.0.message.content');
        $parsed = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! isset($parsed['value'])) {
            throw new RuntimeException('Failed to parse AI section response.');
        }

        return $parsed['value'];
    }

    private function buildPrompt(array $data, ?string $forcedTemplate = null): string
    {
        $features = $data['features'] ?? '';
        $usp      = $data['unique_selling_points'] ?? '-';

        $toneGuides = [
            'default' => 'Use a PREMIUM and SOPHISTICATED tone. Writing should feel authoritative, elegant, and aspirational. Emphasize excellence, transformation, and prestige.',
            'minimal' => 'Use a CLEAN and PROFESSIONAL tone. Writing should be clear, trustworthy, and concise - no hype, no exaggeration. Focus on clarity of value. Great for B2B, services, courses.',
            'bold'    => 'Use a HIGH-ENERGY and URGENT tone. Writing should be intense, impactful, and action-driving. Use power words, create FOMO, and push immediate action. Great for fitness, events, and launches.',
        ];

        if ($forcedTemplate) {
            $toneGuide    = $toneGuides[$forcedTemplate] ?? '';
            $templateJson = '"template": "' . $forcedTemplate . '"';
            $templateNote = 'IMPORTANT TONE: ' . $toneGuide;
        } else {
            $templateJson = '"template": "choose the best layout style for this product: default (dark gradient hero - great for tech, software, premium products), minimal (clean light card layout - great for consultants, books, courses, professional services), bold (high-contrast dark dramatic - great for fitness, events, urgent offers, youth products)"';
            $templateNote = 'Adapt tone naturally to the product and chosen template.';
        }

        $price   = $data['price'];
        $name    = $data['product_name'];
        $desc    = $data['description'];
        $target  = $data['target_audience'];

        return <<<PROMPT
Create a complete sales page for the following product/service.
{$templateNote}
Return ONLY a valid JSON object (no markdown fences) with these exact keys:

{
  "headline": "A compelling, benefit-driven main headline (max 12 words)",
  "sub_headline": "A supporting sub-headline that expands on the headline (max 20 words)",
  "description": "A persuasive 2-3 sentence product/service description",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5", "feature 6"],
  "social_proof": "A realistic-sounding customer testimonial quote (1-2 sentences)",
  "pricing": "{$price}",
  "cta": "A strong call-to-action button text (max 6 words)",
  "color_scheme": "choose one that best fits the product brand and category: violet (tech/software/digital/professional), emerald (health/wellness/finance/eco), rose (beauty/fashion/lifestyle/feminine), amber (food/education/creative/warm), sky (travel/services/hospitality/fresh)",
  {$templateJson}
}

Product/Service Details:
- Name: {$name}
- Description: {$desc}
- Key Features: {$features}
- Target Audience: {$target}
- Price: {$price}
- Unique Selling Points: {$usp}

Write everything in Indonesian (Bahasa Indonesia). Make it persuasive and professional.
PROMPT;
    }

    private function buildSectionPrompt(string $section, array $inputData, array $currentContent): string
    {
        $product  = $inputData['product_name'] ?? '';
        $desc     = $inputData['description'] ?? '';
        $features = $inputData['features'] ?? '';
        $audience = $inputData['target_audience'] ?? '';
        $price    = $inputData['price'] ?? '';
        $usp      = $inputData['unique_selling_points'] ?? '-';

        $instructions = [
            'headline'     => 'Write a NEW, different, and compelling benefit-driven main headline (max 12 words). Return JSON: {"value": "your headline here"}',
            'sub_headline' => 'Write a NEW supporting sub-headline that expands on the main message (max 20 words). Return JSON: {"value": "your sub-headline here"}',
            'description'  => 'Write a NEW persuasive 2-3 sentence product/service description. Return JSON: {"value": "your description here"}',
            'benefits'     => 'Write 5 NEW compelling customer benefits (short power phrases). Return JSON: {"value": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"]}',
            'features'     => 'Write 6 NEW product/service features. Return JSON: {"value": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5", "feature 6"]}',
            'social_proof' => 'Write a NEW realistic-sounding customer testimonial quote (1-2 sentences, include a fictional customer name). Return JSON: {"value": "testimonial here - Customer Name"}',
            'cta'          => 'Write a NEW strong and urgent call-to-action button text (max 6 words). Return JSON: {"value": "CTA text here"}',
        ];

        $instruction = $instructions[$section] ?? '';

        return <<<PROMPT
You are an expert Indonesian copywriter. Regenerate ONLY the "{$section}" section.
{$instruction}

Product/Service Context:
- Name: {$product}
- Description: {$desc}
- Key Features: {$features}
- Target Audience: {$audience}
- Price: {$price}
- Unique Selling Points: {$usp}

Write in Indonesian (Bahasa Indonesia). Make it different from the current version. Return ONLY valid JSON, no markdown, no extra text.
PROMPT;
    }
}