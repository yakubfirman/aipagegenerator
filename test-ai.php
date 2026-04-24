<?php
require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\AIService;

echo "Testing AI Service...\n";

try {
    $service = new AIService();
    $result = $service->generateSalesPage([
        'product_name'          => 'Kursus Laravel',
        'description'           => 'Kursus online belajar Laravel dari dasar hingga mahir',
        'features'              => 'Video HD, Sertifikat, Akses Seumur Hidup',
        'target_audience'       => 'Programmer pemula dan menengah',
        'price'                 => 'Rp 299.000',
        'unique_selling_points' => 'Mentor berpengalaman, komunitas aktif',
    ]);

    echo "SUCCESS!\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
