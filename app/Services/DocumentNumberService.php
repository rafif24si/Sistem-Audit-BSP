<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Letter;
use App\Models\MasterDocument;
use Carbon\Carbon;

class DocumentNumberService
{
    /**
     * Convert integer month to Roman numeral.
     */
    public static function getRomanMonth(int $month): string
    {
        $map = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];

        return $map[$month] ?? 'I';
    }

    /**
     * Generate Outgoing Letter Number according to SPI PT BSP rules:
     * - Standard Outgoing: [No.Urut]/SPI/[Kode Jenis]/[Bulan Romawi]/[Tahun] (e.g., 001/SPI/ST/X/2026)
     * - Audit Report (LHA): [No.Urut]/LHA-SPI/[Bulan Romawi]/[Tahun]
     */
    public static function generateLetterNumber(string $letterTypeCode, ?Carbon $date = null): string
    {
        $date = $date ?? Carbon::now();
        $year = $date->year;
        $romanMonth = self::getRomanMonth($date->month);

        // Count outgoing letters created this year
        $count = Letter::whereYear('letter_date', $year)
            ->where('direction', 'outgoing')
            ->count();

        $sequence = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        if (in_array(strtoupper($letterTypeCode), ['LHA', 'LAP'])) {
            return "{$sequence}/LHA-SPI/{$romanMonth}/{$year}";
        }

        $code = strtoupper($letterTypeCode);
        return "{$sequence}/SPI/{$code}/{$romanMonth}/{$year}";
    }

    /**
     * Generate Master Document Number:
     * Format: [Kode Dept]-BSP/[Tipe]/[No.Urut] (e.g. QHSE-BSP/SOP/001)
     */
    public static function generateMasterDocumentNumber(int $departmentId, string $documentType): string
    {
        $department = Department::find($departmentId);
        $deptCode = $department ? $department->code : 'SPI';
        $type = strtoupper($documentType);

        $count = MasterDocument::where('department_id', $departmentId)
            ->where('document_type', $type)
            ->count();

        $sequence = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        return "{$deptCode}-BSP/{$type}/{$sequence}";
    }
}
