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
            [
                'name' => 'Super Admin SPI',
                'email' => 'admin@bsp.co.id',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'Manager SPI',
                'email' => 'manager.spi@bsp.co.id',
                'password' => Hash::make('password'),
                'role' => 'manager_spi',
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'Auditor SPI',
                'email' => 'auditor.spi@bsp.co.id',
                'password' => Hash::make('password'),
                'role' => 'auditor',
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'PIC QHSE (Auditee)',
                'email' => 'auditee.qhse@bsp.co.id',
                'password' => Hash::make('password'),
                'role' => 'auditee',
                'department_id' => $qhseDept?->id,
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
