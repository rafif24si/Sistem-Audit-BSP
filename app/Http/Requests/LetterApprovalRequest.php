<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LetterApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'approval_status' => ['required', Rule::in(['approved', 'rejected'])],
            'approval_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'approval_status.required' => 'Keputusan persetujuan wajib dipilih.',
            'approval_status.in' => 'Status persetujuan harus Disetujui atau Ditolak.',
            'approval_notes.max' => 'Catatan persetujuan maksimal 1000 karakter.',
        ];
    }
}
