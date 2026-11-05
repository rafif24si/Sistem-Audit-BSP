<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MeetingRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'super_admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $roomId = $this->route('meeting_room')?->id ?? $this->route('meeting_room');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('meeting_rooms', 'name')
                    ->ignore($roomId)
                    ->whereNull('deleted_at'),
            ],
            'capacity' => [
                'nullable',
                'integer',
                'min:1',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama ruangan rapat wajib diisi.',
            'name.unique' => 'Nama ruangan rapat ini sudah terdaftar.',
            'capacity.integer' => 'Kapasitas harus berupa angka bulat positif.',
            'capacity.min' => 'Kapasitas minimal 1 orang.',
            'capacity.max' => 'Kapasitas maksimal 1000 orang.',
        ];
    }
}

