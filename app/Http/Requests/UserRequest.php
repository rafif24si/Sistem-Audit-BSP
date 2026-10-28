<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'super_admin';
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isCreate = $this->isMethod('post');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => $isCreate
                ? ['required', 'string', Password::defaults()]
                : ['nullable', 'string', Password::defaults()],
            'role' => [
                'required',
                Rule::in(['super_admin', 'manager_spi', 'auditor', 'auditee']),
            ],
            'department_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap pengguna wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar oleh pengguna lain.',
            'password.required' => 'Kata sandi wajib diisi untuk pengguna baru.',
            'role.required' => 'Peran (Role) pengguna wajib dipilih.',
            'role.in' => 'Peran yang dipilih tidak valid.',
            'department_id.exists' => 'Departemen yang dipilih tidak terdaftar.',
        ];
    }
}
