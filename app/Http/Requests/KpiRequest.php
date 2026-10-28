<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KpiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => [
                'required',
                Rule::in([
                    'Operasional Audit',
                    'Kepatuhan & Tata Kelola',
                    'Administrasi & Pelaporan',
                    'Pengembangan SDM',
                ]),
            ],
            'target_value' => ['required', 'numeric', 'min:0'],
            'realization_value' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'period' => ['required', 'string', 'max:50'],
            'status' => [
                'required',
                Rule::in([
                    'Tercapai',
                    'Dalam Proses',
                    'Perlu Perhatian',
                    'Belum Tercapai',
                ]),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
            'order_index' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Nama indikator kinerja (KPI) wajib diisi.',
            'category.required' => 'Kategori indikator kinerja wajib dipilih.',
            'target_value.required' => 'Nilai target wajib diisi.',
            'realization_value.required' => 'Nilai realisasi capaian saat ini wajib diisi.',
            'unit.required' => 'Satuan ukuran indikator wajib diisi (misal %, Hari).',
            'period.required' => 'Periode capaian KPI wajib diisi (misal Tahun 2026).',
            'status.required' => 'Status capaian indikator wajib dipilih.',
        ];
    }
}
