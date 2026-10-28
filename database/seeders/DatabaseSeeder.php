<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Departemen
        $this->call([
            DepartmentSeeder::class,
        ]);

        $spiDept = Department::where('code', 'SPI')->first();
        $qhseDept = Department::where('code', 'QHSE')->first();

        // 2. Buat 4 Akun Default untuk Keperluan Testing
        $defaultUsers = [
            [
                'name' => 'Super Administrator SPI',
                'email' => 'superadmin@bsp.com',
                'role' => 'super_admin',
                'password' => Hash::make('password'),
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'Bambang Irawan (Manager SPI)',
                'email' => 'manager@bsp.com',
                'role' => 'manager_spi',
                'password' => Hash::make('password'),
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'Rendra Pratama (Auditor SPI)',
                'email' => 'auditor@bsp.com',
                'role' => 'auditor',
                'password' => Hash::make('password'),
                'department_id' => $spiDept?->id,
            ],
            [
                'name' => 'Ahmad Fauzi (PIC QHSE)',
                'email' => 'auditee.qhse@bsp.com',
                'role' => 'auditee',
                'password' => Hash::make('password'),
                'department_id' => $qhseDept?->id,
            ],
        ];

        foreach ($defaultUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // 3. Seed data demo pendukung
        $this->call([
            DemoDataSeeder::class,
        ]);
    }
}
