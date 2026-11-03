<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KpiCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kpiCategoryId = $this->route('kpi_category')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kpi_categories', 'name')->ignore($kpiCategoryId)->whereNull('deleted_at'),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori KPI wajib diisi.',
            'name.unique' => 'Nama kategori KPI sudah terdaftar di sistem.',
        ];
    }
}

