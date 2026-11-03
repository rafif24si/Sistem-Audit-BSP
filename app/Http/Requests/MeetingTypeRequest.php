<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MeetingTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $meetingTypeId = $this->route('meeting_type')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('meeting_types', 'name')->ignore($meetingTypeId)->whereNull('deleted_at'),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama jenis rapat audit wajib diisi.',
            'name.unique' => 'Nama jenis rapat sudah terdaftar di sistem.',
        ];
    }
}

