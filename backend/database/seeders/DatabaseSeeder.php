<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use App\Models\Patient;
use App\Models\TriageRecord;
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
        $doctors = [
            User::create(['name' => 'Dr. Carlos Pérez',      'email' => 'doctor1@triage.com', 'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Ana Gómez',        'email' => 'doctor2@triage.com', 'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dr. Miguel Rodríguez',  'email' => 'doctor3@triage.com', 'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Laura Martínez',   'email' => 'doctor4@triage.com', 'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dr. Andrés Herrera',    'email' => 'doctor5@triage.com', 'password' => Hash::make('password'), 'role' => 'doctor']),
        ];

        // Enfermeros
        $nurses = [
            User::create(['name' => 'Enf. Luis Torres',      'email' => 'nurse1@triage.com', 'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. María Castillo',   'email' => 'nurse2@triage.com', 'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. Jorge Ramírez',    'email' => 'nurse3@triage.com', 'password' => Hash::make('password'), 'role' => 'nurse']),
        ];

        // Salas
        Room::create(['name' => 'Consultorio 1',       'type' => 'consultorio', 'assigned_doctor_id' => $doctors[0]->id]);
        Room::create(['name' => 'Consultorio 2',       'type' => 'consultorio', 'assigned_doctor_id' => $doctors[1]->id]);
        Room::create(['name' => 'Consultorio 3',       'type' => 'consultorio', 'assigned_doctor_id' => $doctors[2]->id]);
        Room::create(['name' => 'Consultorio 4',       'type' => 'consultorio', 'assigned_doctor_id' => $doctors[3]->id]);
        Room::create(['name' => 'Urgencias A',         'type' => 'urgencias',   'assigned_doctor_id' => $doctors[4]->id]);
        Room::create(['name' => 'Urgencias B',         'type' => 'urgencias']);
        Room::create(['name' => 'Trauma 1',            'type' => 'trauma']);
        Room::create(['name' => 'Trauma 2',            'type' => 'trauma']);
        Room::create(['name' => 'Reanimación',         'type' => 'urgencias']);

        // Pacientes con triage
        $patients = [
            ['name' => 'Juan Pablo Moreno',    'document' => '10234567', 'age' => 45, 'gender' => 'M', 'phone' => '3001234567', 'symptoms' => 'Dolor torácico intenso y dificultad para respirar',          'level' => 1, 'hr' => 110, 'sys' => 160, 'dia' => 100, 'temp' => 37.8, 'spo2' => 91],
            ['name' => 'María Fernanda López', 'document' => '20345678', 'age' => 32, 'gender' => 'F', 'phone' => '3012345678', 'symptoms' => 'Convulsiones repetidas, pérdida de consciencia',              'level' => 1, 'hr' => 130, 'sys' => 180, 'dia' => 110, 'temp' => 38.5, 'spo2' => 88],
            ['name' => 'Carlos Andrés Ruiz',   'document' => '30456789', 'age' => 58, 'gender' => 'M', 'phone' => '3023456789', 'symptoms' => 'Fractura expuesta en pierna derecha tras accidente',          'level' => 2, 'hr' => 95,  'sys' => 140, 'dia' => 90,  'temp' => 37.2, 'spo2' => 96],
            ['name' => 'Ana Lucía Vargas',     'document' => '40567890', 'age' => 27, 'gender' => 'F', 'phone' => '3034567890', 'symptoms' => 'Quemaduras en brazos y tórax, segundo grado',                 'level' => 2, 'hr' => 102, 'sys' => 130, 'dia' => 85,  'temp' => 38.1, 'spo2' => 94],
            ['name' => 'Pedro José Salcedo',   'document' => '50678901', 'age' => 63, 'gender' => 'M', 'phone' => '3045678901', 'symptoms' => 'Dolor abdominal severo, náuseas y vómito',                   'level' => 2, 'hr' => 88,  'sys' => 125, 'dia' => 80,  'temp' => 38.9, 'spo2' => 97],
            ['name' => 'Sofía Alejandra Ríos', 'document' => '60789012', 'age' => 19, 'gender' => 'F', 'phone' => '3056789012', 'symptoms' => 'Fiebre alta de 39.5°C, dolor de cabeza y rigidez de nuca',   'level' => 2, 'hr' => 105, 'sys' => 118, 'dia' => 75,  'temp' => 39.5, 'spo2' => 96],
            ['name' => 'Luis Eduardo Castro',  'document' => '70890123', 'age' => 41, 'gender' => 'M', 'phone' => '3067890123', 'symptoms' => 'Esguince de tobillo, dolor moderado al caminar',             'level' => 3, 'hr' => 78,  'sys' => 120, 'dia' => 78,  'temp' => 36.8, 'spo2' => 98],
            ['name' => 'Valentina Cruz',       'document' => '80901234', 'age' => 35, 'gender' => 'F', 'phone' => '3078901234', 'symptoms' => 'Infección urinaria, ardor y fiebre leve',                    'level' => 3, 'hr' => 82,  'sys' => 115, 'dia' => 72,  'temp' => 37.9, 'spo2' => 99],
            ['name' => 'Hernando Mejía',       'document' => '91012345', 'age' => 70, 'gender' => 'M', 'phone' => '3089012345', 'symptoms' => 'Mareo y debilidad general, paciente hipertenso conocido',    'level' => 3, 'hr' => 68,  'sys' => 155, 'dia' => 95,  'temp' => 36.5, 'spo2' => 97],
            ['name' => 'Camila Ortega',        'document' => '11123456', 'age' => 24, 'gender' => 'F', 'phone' => '3090123456', 'symptoms' => 'Dolor de garganta, tos seca y congestión nasal',             'level' => 4, 'hr' => 74,  'sys' => 112, 'dia' => 70,  'temp' => 37.4, 'spo2' => 99],
            ['name' => 'Ricardo Pinto',        'document' => '12234567', 'age' => 30, 'gender' => 'M', 'phone' => '3101234567', 'symptoms' => 'Herida cortante superficial en mano derecha',                'level' => 4, 'hr' => 76,  'sys' => 118, 'dia' => 74,  'temp' => 36.7, 'spo2' => 99],
            ['name' => 'Gloria Inés Suárez',   'document' => '13345678', 'age' => 52, 'gender' => 'F', 'phone' => '3112345678', 'symptoms' => 'Control de rutina, renovación de fórmula médica',            'level' => 5, 'hr' => 72,  'sys' => 110, 'dia' => 68,  'temp' => 36.6, 'spo2' => 99],
        ];

        foreach ($patients as $p) {
            $patient = Patient::create([
                'name'     => $p['name'],
                'document' => $p['document'],
                'age'      => $p['age'],
                'gender'   => $p['gender'],
                'phone'    => $p['phone'],
            ]);

            TriageRecord::create([
                'patient_id'         => $patient->id,
                'nurse_id'           => $nurses[array_rand($nurses)]->id,
                'triage_level'       => $p['level'],
                'symptoms'           => $p['symptoms'],
                'heart_rate'         => $p['hr'],
                'blood_pressure_sys' => $p['sys'],
                'blood_pressure_dia' => $p['dia'],
                'temperature'        => $p['temp'],
                'oxygen_saturation'  => $p['spo2'],
                'status'             => 'waiting',
                'arrived_at'         => now()->subMinutes(rand(5, 120)),
            ]);
        }
    }
}
