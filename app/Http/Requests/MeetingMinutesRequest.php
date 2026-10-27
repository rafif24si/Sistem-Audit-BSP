<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MeetingMinutesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'discussion_points' => ['required', 'string'],
            'decisions' => ['required', 'string'],
            'status' => ['required', Rule::in(['Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'])],
        ];
    }

    public function messages(): array
    {
        return [
            'discussion_points.required' => 'Poin-poin pembahasan rapat wajib diisi.',
            'decisions.required' => 'Hasil keputusan / kesimpulan rapat wajib diisi.',
            'status.required' => 'Status rapat wajib dipilih.',
        ];
    }
}
