<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'code' => 'SPI',
                'name' => 'Internal Audit (SPI)',
            ],
            [
                'code' => 'QHSE',
                'name' => 'Quality, Health, Safety & Environment',
            ],
            [
                'code' => 'FIN&ICT',
                'name' => 'Finance & Information Communication Technology',
            ],
            [
                'code' => 'HCM',
                'name' => 'Human Capital Management',
            ],
            [
                'code' => 'SCM',
                'name' => 'Supply Chain Management',
            ],
            [
                'code' => 'OPS',
                'name' => 'Operations',
            ],
            [
                'code' => 'CORSEC',
                'name' => 'Corporate Secretary',
            ],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['code' => $dept['code']],
                ['name' => $dept['name']]
            );
        }
    }
}
