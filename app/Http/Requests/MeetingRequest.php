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
            'meeting_type' => ['required', 'string', 'max:255'],
            'meeting_mode' => ['required', Rule::in(['Offline', 'Online'])],
            'platform' => ['nullable', Rule::in(['Tatap Muka', 'Zoom', 'Google Meet', 'Microsoft Teams', 'Webex'])],
            'meeting_date_start' => ['required', 'date'],
            'meeting_date_end' => ['nullable', 'date', 'after_or_equal:meeting_date_start'],
            'start_time' => ['required'],
            'end_time' => ['nullable'],
            'location' => ['required', 'string', 'max:255'],
            'invitees' => ['required', 'array', 'min:1'],
            'invitees.*' => ['required', 'email'],
            'confidentiality' => ['required', Rule::in(['Biasa', 'Terbatas', 'Rahasia'])],
            'status' => ['required', Rule::in(['Terjadwal', 'Selesai', 'Dibatalkan'])],
            'attachment' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,xls,xlsx,jpg,png',
                'max:10240',
            ],
            'is_resend_email' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Perihal / Agenda rapat wajib diisi.',
            'meeting_type.required' => 'Jenis rapat audit wajib dipilih.',
            'meeting_date_start.required' => 'Tanggal mulai pelaksanaan rapat wajib diisi.',
            'meeting_date_end.after_or_equal' => 'Tanggal selesai rapat tidak boleh mendahului tanggal mulai.',
            'start_time.required' => 'Waktu mulai rapat wajib diisi.',
            'location.required' => 'Ruangan atau tautan online rapat wajib diisi.',
            'invitees.required' => 'Daftar undangan / peserta rapat minimal 1 orang.',
            'invitees.*.email' => 'Setiap alamat peserta harus berupa format email yang valid.',
            'attachment.mimes' => 'Format file materi harus berupa: pdf, doc, docx, xls, xlsx, jpg, atau png.',
            'attachment.max' => 'Ukuran file lampiran maksimal 10MB.',
        ];
    }
}
