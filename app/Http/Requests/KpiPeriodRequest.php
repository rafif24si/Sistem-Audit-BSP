<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KpiPeriodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'super_admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $periodId = $this->route('kpi_period')?->id ?? $this->route('kpi_period');

        return [
            'year' => [
                'required',
                'digits:4',
                Rule::unique('kpi_periods', 'year')
                    ->ignore($periodId)
                    ->whereNull('deleted_at'),
            ],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'year.required' => 'Tahun periode KPI wajib diisi.',
            'year.digits' => 'Tahun periode KPI harus berupa 4 digit angka (contoh: 2026).',
            'year.unique' => 'Tahun periode KPI ini sudah terdaftar.',
            'is_active.boolean' => 'Status aktif harus bernilai boolean.',
        ];
    }
}

