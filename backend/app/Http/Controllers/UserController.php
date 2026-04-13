<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::whereIn('role', ['doctor', 'nurse'])->orderBy('role')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:doctor,nurse',
        ]);

        $data['password'] = Hash::make($data['password']);
        return response()->json(User::create($data), 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role'     => 'sometimes|in:doctor,nurse',
        ]);

        if (isset($data['password'])) $data['password'] = Hash::make($data['password']);
        $user->update($data);
        return response()->json($user->fresh());
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
