<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFollowUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'followup_status' => [
                'required',
                Rule::in(['not_required', 'pending', 'in_progress', 'completed']),
            ],
            'followup_notes' => ['nullable', 'string'],
            'followup_due_date' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'followup_status.required' => 'Status tindak lanjut wajib dipilih.',
        ];
    }
}
