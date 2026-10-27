<?php

namespace App\Http\Requests;

use App\Models\MasterDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MasterDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $documentId = $this->route('master_document')?->id ?? $this->route('document')?->id;

        return [
            'document_number' => [
                'required',
                'string',
                'max:100',
                function ($attribute, $value, $fail) use ($documentId) {
                    $existing = MasterDocument::where('document_number', $value)
                        ->when($documentId, fn ($q) => $q->where('id', '!=', $documentId))
                        ->first();

                    if ($existing && $existing->version === $this->input('version')) {
                        $fail("Dokumen dengan nomor {$value} versi {$existing->version} sudah terdaftar.");
                    }
                },
            ],
            'title' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'document_type' => ['required', Rule::in(['MAN', 'SOP', 'WI', 'FORM'])],
            'version' => ['required', 'string', 'max:10'],
            'effective_date' => ['required', 'date'],
            'expired_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
            'control_status' => ['required', Rule::in(['TERKENDALI', 'TIDAK_TERKENDALI', 'KADALUARSA'])],
            'confidentiality' => ['required', Rule::in(['Biasa', 'Terbatas', 'Rahasia', 'Sangat Rahasia'])],
            'file' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'file',
                'mimes:pdf,doc,docx,xls,xlsx,jpg,png',
                'max:10240',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'document_number.required' => 'Nomor dokumen wajib diisi.',
            'title.required' => 'Judul dokumen wajib diisi.',
            'department_id.required' => 'Departemen pemilik dokumen wajib dipilih.',
            'document_type.required' => 'Tipe dokumen master wajib dipilih.',
            'effective_date.required' => 'Tanggal berlaku dokumen wajib diisi.',
            'file.required' => 'File lampiran dokumen wajib diunggah.',
            'file.mimes' => 'Format file harus berupa: pdf, doc, docx, xls, xlsx, jpg, atau png.',
            'file.max' => 'Ukuran file dokumen maksimal 10MB.',
        ];
    }
}
