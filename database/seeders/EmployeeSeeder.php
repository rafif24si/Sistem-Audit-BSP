<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $deptMap = Department::pluck('id', 'code')->toArray();

        $employees = [
            [
                'name' => 'Bambang Irawan',
                'email' => 'bambang.irawan@bsp.co.id',
                'department_code' => 'SPI',
            ],
            [
                'name' => 'Siti Rahmawati',
                'email' => 'siti.rahmawati@bsp.co.id',
                'department_code' => 'SPI',
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@bsp.co.id',
                'department_code' => 'QHSE',
            ],
            [
                'name' => 'Hendra Saputra',
                'email' => 'hendra.saputra@bsp.co.id',
                'department_code' => 'OPS',
            ],
            [
                'name' => 'Dewi Kartika',
                'email' => 'dewi.kartika@bsp.co.id',
                'department_code' => 'FIN',
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky.pratama@bsp.co.id',
                'department_code' => 'SCM',
            ],
            [
                'name' => 'Rahmat Hidayat',
                'email' => 'rahmat.hidayat@bsp.co.id',
                'department_code' => 'IT',
            ],
            [
                'name' => 'Maya Kusuma',
                'email' => 'maya.kusuma@bsp.co.id',
                'department_code' => 'HR',
            ],
        ];

        foreach ($employees as $emp) {
            $deptId = $deptMap[$emp['department_code']] ?? null;
            Employee::firstOrCreate(
                ['email' => $emp['email']],
                [
                    'name' => $emp['name'],
                    'email' => $emp['email'],
                    'department_id' => $deptId,
                ]
            );
        }
    }
}

