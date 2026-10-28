<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $spiDept = Department::where('code', 'SPI')->first();
        $qhseDept = Department::where('code', 'QHSE')->first();

        $users = [
            // 1. Super Admin
            [
                'name' => 'Super Administrator SPI',
                'email' => 'superadmin@bsp.com',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'department_id' => $spiDept?->id,
            ],
            // 2. Manager SPI (Pimpinan Audit)
            [
                'name' => 'Bambang Irawan (Kepala SPI)',
                'email' => 'manager@bsp.com',
                'password' => Hash::make('password'),
                'role' => 'manager_spi',
                'department_id' => $spiDept?->id,
            ],
            // 3. Auditor (Staf Auditor SPI)
            [
                'name' => 'Rendra Pratama (Auditor SPI)',
                'email' => 'auditor@bsp.com',
                'password' => Hash::make('password'),
                'role' => 'auditor',
                'department_id' => $spiDept?->id,
            ],
            // 4. Auditee QHSE
            [
                'name' => 'Ahmad Fauzi (PIC QHSE)',
                'email' => 'auditee.qhse@bsp.com',
                'password' => Hash::make('password'),
                'role' => 'auditee',
                'department_id' => $qhseDept?->id,
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
