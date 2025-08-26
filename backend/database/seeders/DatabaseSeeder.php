<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'addinakhairinisa05@gmail.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => Carbon::now(),
        ]);
    }
}
