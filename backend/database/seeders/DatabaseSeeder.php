<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Administrador',
            'email'    => 'admin@triage.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Doctores
        $doctor1 = User::create([
            'name'     => 'Dr. Carlos Pérez',
            'email'    => 'doctor1@triage.com',
            'password' => Hash::make('password'),
            'role'     => 'doctor',
        ]);

        $doctor2 = User::create([
            'name'     => 'Dra. Ana Gómez',
            'email'    => 'doctor2@triage.com',
            'password' => Hash::make('password'),
            'role'     => 'doctor',
        ]);

        // Enfermero
        User::create([
            'name'     => 'Enf. Luis Torres',
            'email'    => 'nurse1@triage.com',
            'password' => Hash::make('password'),
            'role'     => 'nurse',
        ]);

        // Salas
        Room::create(['name' => 'Consultorio 1', 'type' => 'consultorio', 'assigned_doctor_id' => $doctor1->id]);
        Room::create(['name' => 'Consultorio 2', 'type' => 'consultorio', 'assigned_doctor_id' => $doctor2->id]);
        Room::create(['name' => 'Urgencias A',   'type' => 'urgencias']);
        Room::create(['name' => 'Trauma 1',      'type' => 'trauma']);
    }
}
