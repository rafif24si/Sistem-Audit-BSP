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
            'category' => ['required', 'string', 'max:255'],
            'target_value' => ['required', 'numeric', 'min:0'],
            'realization_value' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'kpi_period_id' => ['required', 'exists:kpi_periods,id'],
            'polarity' => ['required', Rule::in(['positive', 'negative'])],
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
            'evidence' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx,jpg,png', 'max:10240'],
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
            'kpi_period_id.required' => 'Tahun periode capaian KPI wajib dipilih.',
            'kpi_period_id.exists' => 'Periode KPI yang dipilih tidak valid.',
            'polarity.required' => 'Polaritas pergerakan target KPI wajib ditentukan.',
            'status.required' => 'Status capaian indikator wajib dipilih.',
            'evidence.mimes' => 'Format file bukti harus berupa pdf, doc, docx, xls, xlsx, jpg, atau png.',
            'evidence.max' => 'Ukuran file bukti tidak boleh melebihi 10MB.',
        ];
    }
}
