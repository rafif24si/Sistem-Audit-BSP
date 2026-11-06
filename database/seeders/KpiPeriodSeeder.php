<?php

namespace Database\Seeders;

use App\Models\Kpi;
use App\Models\KpiPeriod;
use Illuminate\Database\Seeder;

class KpiPeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $periods = [
            ['year' => '2024', 'is_active' => false],
            ['year' => '2025', 'is_active' => false],
            ['year' => '2026', 'is_active' => true],
        ];

        foreach ($periods as $p) {
            KpiPeriod::firstOrCreate(
                ['year' => $p['year']],
                $p
            );
        }

        // Hubungkan KPI yang ada dengan periode aktif 2026
        $activePeriod = KpiPeriod::where('year', '2026')->first();
        if ($activePeriod) {
            Kpi::whereNull('kpi_period_id')->update([
                'kpi_period_id' => $activePeriod->id,
            ]);
        }
    }
}

