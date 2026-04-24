<?php

namespace App\Policies;

use App\Models\SalesPage;
use App\Models\User;

class SalesPagePolicy
{
    public function view(User $user, SalesPage $salesPage): bool
    {
        return (int) $user->id === (int) $salesPage->user_id;
    }

    public function update(User $user, SalesPage $salesPage): bool
    {
        return (int) $user->id === (int) $salesPage->user_id;
    }

    public function delete(User $user, SalesPage $salesPage): bool
    {
        return (int) $user->id === (int) $salesPage->user_id;
    }
}
