<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesPage extends Model
{
    protected $fillable = [
        'user_id',
        'product_name',
        'input_data',
        'generated_content',
        'template',
        'status',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'input_data' => 'array',
        'generated_content' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
