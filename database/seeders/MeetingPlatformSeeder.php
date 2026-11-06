<?php

namespace Database\Seeders;

use App\Models\MeetingPlatform;
use Illuminate\Database\Seeder;

class MeetingPlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = [
            ['name' => 'Zoom Meeting', 'is_active' => true],
            ['name' => 'Google Meet', 'is_active' => true],
            ['name' => 'Microsoft Teams', 'is_active' => true],
            ['name' => 'Webex', 'is_active' => true],
        ];

        foreach ($platforms as $platform) {
            MeetingPlatform::firstOrCreate(
                ['name' => $platform['name']],
                $platform
            );
        }
    }
}

