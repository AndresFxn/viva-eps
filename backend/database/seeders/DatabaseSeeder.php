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
            User::create(['name' => 'Dr. Carlos Pérez',         'email' => 'doctor1@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Ana Gómez',           'email' => 'doctor2@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dr. Miguel Rodríguez',     'email' => 'doctor3@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Laura Martínez',      'email' => 'doctor4@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dr. Andrés Herrera',       'email' => 'doctor5@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Claudia Ospina',      'email' => 'doctor6@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dr. Felipe Montoya',       'email' => 'doctor7@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
            User::create(['name' => 'Dra. Natalia Restrepo',    'email' => 'doctor8@triage.com',  'password' => Hash::make('password'), 'role' => 'doctor']),
        ];

        // Enfermeros
        $nurses = [
            User::create(['name' => 'Enf. Luis Torres',         'email' => 'nurse1@triage.com',   'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. María Castillo',      'email' => 'nurse2@triage.com',   'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. Jorge Ramírez',       'email' => 'nurse3@triage.com',   'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. Sandra Morales',      'email' => 'nurse4@triage.com',   'password' => Hash::make('password'), 'role' => 'nurse']),
            User::create(['name' => 'Enf. Camilo Vargas',       'email' => 'nurse5@triage.com',   'password' => Hash::make('password'), 'role' => 'nurse']),
        ];

        // Salas
        Room::create(['name' => 'Consultorio 1',        'type' => 'consultorio', 'assigned_doctor_id' => $doctors[0]->id]);
        Room::create(['name' => 'Consultorio 2',        'type' => 'consultorio', 'assigned_doctor_id' => $doctors[1]->id]);
        Room::create(['name' => 'Consultorio 3',        'type' => 'consultorio', 'assigned_doctor_id' => $doctors[2]->id]);
        Room::create(['name' => 'Consultorio 4',        'type' => 'consultorio', 'assigned_doctor_id' => $doctors[3]->id]);
        Room::create(['name' => 'Consultorio 5',        'type' => 'consultorio', 'assigned_doctor_id' => $doctors[4]->id]);
        Room::create(['name' => 'Consultorio Pediatría','type' => 'consultorio', 'assigned_doctor_id' => $doctors[5]->id]);
        Room::create(['name' => 'Urgencias A',          'type' => 'urgencias',   'assigned_doctor_id' => $doctors[6]->id]);
        Room::create(['name' => 'Urgencias B',          'type' => 'urgencias',   'assigned_doctor_id' => $doctors[7]->id]);
        Room::create(['name' => 'Urgencias C',          'type' => 'urgencias']);
        Room::create(['name' => 'Trauma 1',             'type' => 'trauma']);
        Room::create(['name' => 'Trauma 2',             'type' => 'trauma']);
        Room::create(['name' => 'Reanimación',          'type' => 'urgencias']);

        // Pacientes
        $patients = [
            // Nivel 1 - Críticos
            ['name' => 'Juan Pablo Moreno',      'document' => '10234567', 'age' => 45, 'gender' => 'M', 'phone' => '3001234567', 'symptoms' => 'Dolor torácico intenso, irradiado al brazo izquierdo, diaforesis',         'level' => 1, 'hr' => 115, 'sys' => 165, 'dia' => 102, 'temp' => 37.8, 'spo2' => 90],
            ['name' => 'María Fernanda López',   'document' => '20345678', 'age' => 32, 'gender' => 'F', 'phone' => '3012345678', 'symptoms' => 'Convulsiones tónico-clónicas generalizadas, pérdida de consciencia',         'level' => 1, 'hr' => 132, 'sys' => 182, 'dia' => 112, 'temp' => 38.6, 'spo2' => 87],
            ['name' => 'Roberto Salinas',        'document' => '31234567', 'age' => 67, 'gender' => 'M', 'phone' => '3021234567', 'symptoms' => 'ACV isquémico, hemiplejia derecha, afasia',                                  'level' => 1, 'hr' => 98,  'sys' => 195, 'dia' => 118, 'temp' => 37.2, 'spo2' => 92],
            ['name' => 'Isabela Quintero',       'document' => '41234567', 'age' => 28, 'gender' => 'F', 'phone' => '3031234567', 'symptoms' => 'Anafilaxia severa tras picadura de abeja, edema de glotis',                  'level' => 1, 'hr' => 140, 'sys' => 80,  'dia' => 50,  'temp' => 37.0, 'spo2' => 85],

            // Nivel 2 - Emergencia
            ['name' => 'Carlos Andrés Ruiz',     'document' => '30456789', 'age' => 58, 'gender' => 'M', 'phone' => '3023456789', 'symptoms' => 'Fractura expuesta en tibia derecha tras accidente de tránsito',             'level' => 2, 'hr' => 96,  'sys' => 142, 'dia' => 91,  'temp' => 37.3, 'spo2' => 96],
            ['name' => 'Ana Lucía Vargas',       'document' => '40567890', 'age' => 27, 'gender' => 'F', 'phone' => '3034567890', 'symptoms' => 'Quemaduras segundo grado en brazos y tórax, 20% superficie corporal',       'level' => 2, 'hr' => 104, 'sys' => 132, 'dia' => 86,  'temp' => 38.2, 'spo2' => 94],
            ['name' => 'Pedro José Salcedo',     'document' => '50678901', 'age' => 63, 'gender' => 'M', 'phone' => '3045678901', 'symptoms' => 'Dolor abdominal severo en fosa ilíaca derecha, posible apendicitis',        'level' => 2, 'hr' => 90,  'sys' => 128, 'dia' => 82,  'temp' => 38.9, 'spo2' => 97],
            ['name' => 'Sofía Alejandra Ríos',   'document' => '60789012', 'age' => 19, 'gender' => 'F', 'phone' => '3056789012', 'symptoms' => 'Meningitis bacteriana sospechada, fiebre 39.5°C, rigidez de nuca',          'level' => 2, 'hr' => 108, 'sys' => 120, 'dia' => 76,  'temp' => 39.5, 'spo2' => 95],
            ['name' => 'Hernán Darío Cano',      'document' => '51234567', 'age' => 50, 'gender' => 'M', 'phone' => '3051234567', 'symptoms' => 'Hemoptisis masiva, tos con sangre abundante, antecedente de TBC',           'level' => 2, 'hr' => 112, 'sys' => 100, 'dia' => 65,  'temp' => 38.4, 'spo2' => 89],
            ['name' => 'Paola Andrea Suárez',    'document' => '61234567', 'age' => 35, 'gender' => 'F', 'phone' => '3061234567', 'symptoms' => 'Eclampsia, 36 semanas de gestación, presión arterial 170/110',              'level' => 2, 'hr' => 100, 'sys' => 170, 'dia' => 110, 'temp' => 37.8, 'spo2' => 96],

            // Nivel 3 - Urgente
            ['name' => 'Luis Eduardo Castro',    'document' => '70890123', 'age' => 41, 'gender' => 'M', 'phone' => '3067890123', 'symptoms' => 'Esguince grado II tobillo derecho, dolor moderado, leve edema',             'level' => 3, 'hr' => 79,  'sys' => 122, 'dia' => 79,  'temp' => 36.8, 'spo2' => 98],
            ['name' => 'Valentina Cruz',         'document' => '80901234', 'age' => 35, 'gender' => 'F', 'phone' => '3078901234', 'symptoms' => 'Infección urinaria complicada, fiebre 38°C, disuria intensa',               'level' => 3, 'hr' => 84,  'sys' => 116, 'dia' => 73,  'temp' => 38.0, 'spo2' => 99],
            ['name' => 'Hernando Mejía',         'document' => '91012345', 'age' => 70, 'gender' => 'M', 'phone' => '3089012345', 'symptoms' => 'Crisis hipertensiva, cefalea intensa, visión borrosa',                      'level' => 3, 'hr' => 70,  'sys' => 158, 'dia' => 97,  'temp' => 36.5, 'spo2' => 97],
            ['name' => 'Diana Marcela Parra',    'document' => '71234567', 'age' => 29, 'gender' => 'F', 'phone' => '3071234567', 'symptoms' => 'Crisis asmática moderada, sibilancias, uso de músculos accesorios',         'level' => 3, 'hr' => 102, 'sys' => 118, 'dia' => 74,  'temp' => 37.1, 'spo2' => 93],
            ['name' => 'Mauricio León',          'document' => '81234567', 'age' => 44, 'gender' => 'M', 'phone' => '3081234567', 'symptoms' => 'Cólico renal, dolor lumbar irradiado a ingle, hematuria',                   'level' => 3, 'hr' => 95,  'sys' => 135, 'dia' => 88,  'temp' => 37.4, 'spo2' => 98],
            ['name' => 'Lucía Fernández',        'document' => '91234567', 'age' => 55, 'gender' => 'F', 'phone' => '3091234567', 'symptoms' => 'Gastroenteritis aguda, deshidratación moderada, vómito persistente',        'level' => 3, 'hr' => 92,  'sys' => 105, 'dia' => 68,  'temp' => 38.3, 'spo2' => 97],

            // Nivel 4 - Menos urgente
            ['name' => 'Camila Ortega',          'document' => '11123456', 'age' => 24, 'gender' => 'F', 'phone' => '3090123456', 'symptoms' => 'Faringoamigdalitis, odinofagia, fiebre leve 37.8°C',                       'level' => 4, 'hr' => 75,  'sys' => 113, 'dia' => 71,  'temp' => 37.8, 'spo2' => 99],
            ['name' => 'Ricardo Pinto',          'document' => '12234567', 'age' => 30, 'gender' => 'M', 'phone' => '3101234567', 'symptoms' => 'Herida cortante superficial en mano derecha, requiere sutura',              'level' => 4, 'hr' => 77,  'sys' => 119, 'dia' => 75,  'temp' => 36.7, 'spo2' => 99],
            ['name' => 'Alejandro Ríos',         'document' => '13456789', 'age' => 22, 'gender' => 'M', 'phone' => '3111234567', 'symptoms' => 'Contusión en rodilla izquierda, dolor leve, sin deformidad',               'level' => 4, 'hr' => 72,  'sys' => 115, 'dia' => 72,  'temp' => 36.6, 'spo2' => 99],
            ['name' => 'Marcela Jiménez',        'document' => '14567890', 'age' => 38, 'gender' => 'F', 'phone' => '3121234567', 'symptoms' => 'Migraña con aura, cefalea pulsátil unilateral, fotofobia',                 'level' => 4, 'hr' => 80,  'sys' => 125, 'dia' => 80,  'temp' => 36.9, 'spo2' => 99],
            ['name' => 'Tomás Agudelo',          'document' => '15678901', 'age' => 8,  'gender' => 'M', 'phone' => '3131234567', 'symptoms' => 'Otitis media aguda, otalgia derecha, fiebre 38.2°C',                       'level' => 4, 'hr' => 98,  'sys' => 100, 'dia' => 62,  'temp' => 38.2, 'spo2' => 99],

            // Nivel 5 - No urgente
            ['name' => 'Gloria Inés Suárez',     'document' => '13345678', 'age' => 52, 'gender' => 'F', 'phone' => '3112345678', 'symptoms' => 'Control de rutina, renovación de fórmula médica para hipertensión',        'level' => 5, 'hr' => 72,  'sys' => 130, 'dia' => 82,  'temp' => 36.6, 'spo2' => 99],
            ['name' => 'Ernesto Palacio',        'document' => '16789012', 'age' => 60, 'gender' => 'M', 'phone' => '3141234567', 'symptoms' => 'Revisión de resultados de laboratorio, paciente diabético estable',        'level' => 5, 'hr' => 70,  'sys' => 128, 'dia' => 80,  'temp' => 36.5, 'spo2' => 99],
            ['name' => 'Pilar Echeverri',        'document' => '17890123', 'age' => 45, 'gender' => 'F', 'phone' => '3151234567', 'symptoms' => 'Solicitud de incapacidad médica, resfriado común leve',                    'level' => 5, 'hr' => 74,  'sys' => 110, 'dia' => 68,  'temp' => 37.1, 'spo2' => 99],
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
                'arrived_at'         => now()->subMinutes(rand(5, 180)),
            ]);
        }
    }
}
