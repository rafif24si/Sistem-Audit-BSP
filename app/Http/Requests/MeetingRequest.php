<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'meeting_type' => [
                'required',
                Rule::in(['Entry Meeting', 'Exit Meeting', 'Rapat Internal SPI', 'Rapat Pimpinan']),
            ],
            'meeting_mode' => ['required', Rule::in(['Offline', 'Online'])],
            'platform' => ['nullable', Rule::in(['Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams'])],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['nullable'],
            'location' => ['required', 'string', 'max:255'],
            'invitees' => ['required', 'array', 'min:1'],
            'confidentiality' => ['required', Rule::in(['Biasa', 'Terbatas', 'Rahasia'])],
            'status' => ['required', Rule::in(['Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'])],
            'attachment' => [
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
            'title.required' => 'Perihal / Agenda rapat wajib diisi.',
            'meeting_type.required' => 'Jenis rapat audit wajib dipilih.',
            'meeting_date.required' => 'Tanggal pelaksanaan rapat wajib diisi.',
            'start_time.required' => 'Waktu mulai rapat wajib diisi.',
            'location.required' => 'Ruangan atau tautan online rapat wajib diisi.',
            'invitees.required' => 'Daftar undangan / peserta rapat minimal 1 orang.',
            'attachment.mimes' => 'Format file materi harus berupa: pdf, doc, docx, xls, xlsx, jpg, atau png.',
            'attachment.max' => 'Ukuran file lampiran maksimal 10MB.',
        ];
    }
}
