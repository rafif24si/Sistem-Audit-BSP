<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $letterId = $this->route('letter')?->id;

        return [
            'agenda_number' => ['nullable', 'string', 'max:100'],
            'letter_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('letters', 'letter_number')->ignore($letterId),
            ],
            'scope' => ['required', Rule::in(['internal', 'external'])],
            'direction' => ['required', Rule::in(['incoming', 'outgoing'])],
            'letter_type_code' => [
                'nullable',
                Rule::in(['ST', 'PA', 'DT', 'KF', 'TL', 'KS', 'KP', 'UM', 'LHA', 'LAP']),
            ],
            'subject' => ['required', 'string', 'max:255'],
            'sender' => ['required', 'string', 'max:255'],
            'recipient' => ['required', 'string', 'max:255'],
            'recipient_department_id' => ['nullable', 'exists:departments,id'],
            'letter_date' => ['required', 'date'],
            'received_date' => ['nullable', 'date'],
            'confidentiality' => ['required', Rule::in(['Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'])],
            'followup_status' => [
                'nullable',
                Rule::in(['not_required', 'pending', 'in_progress', 'completed']),
            ],
            'followup_notes' => ['nullable', 'string'],
            'followup_due_date' => ['nullable', 'date'],
            'file' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,xls,xlsx,jpg,png',
                'max:10240',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'letter_number.required' => 'Nomor surat resmi wajib diisi.',
            'letter_number.unique' => 'Nomor surat sudah terdaftar di sistem.',
            'subject.required' => 'Perihal surat wajib diisi.',
            'sender.required' => 'Asal surat / pengirim wajib diisi.',
            'recipient.required' => 'Tujuan surat / penerima wajib diisi.',
            'letter_date.required' => 'Tanggal surat wajib diisi.',
            'file.mimes' => 'Format file lampiran harus berupa: pdf, doc, docx, xls, xlsx, jpg, atau png.',
            'file.max' => 'Ukuran file lampiran maksimal 10MB.',
        ];
    }
}
