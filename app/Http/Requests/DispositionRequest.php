<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DispositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'letter_id' => ['required', 'exists:letters,id'],
            'to_user_id' => ['required', 'exists:users,id'],
            'urgency' => ['required', Rule::in(['Biasa', 'Segera', 'Kilat'])],
            'instruction' => [
                'required',
                Rule::in([
                    'Untuk Diketahui',
                    'Ditindaklanjuti',
                    'Dibalas',
                    'Dikoordinasikan',
                    'DipelaJari',
                    'Diarsipkan',
                ]),
            ],
            'notes' => ['nullable', 'string'],
            'due_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'letter_id.required' => 'Surat yang akan didisposisikan wajib dipilih.',
            'to_user_id.required' => 'Auditor / staf penerima disposisi wajib dipilih.',
            'urgency.required' => 'Derajat urgensi disposisi wajib dipilih.',
            'instruction.required' => 'Instruksi pimpinan wajib dipilih.',
            'due_date.required' => 'Tenggat waktu penyelesaian disposisi wajib diisi.',
        ];
    }
}
