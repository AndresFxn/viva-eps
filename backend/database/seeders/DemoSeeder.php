<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use App\Models\Patient;
use App\Models\TriageRecord;
use App\Models\TriageHistory;
use App\Models\Consultation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // ── Usuarios adicionales ──────────────────────────────────────────
        $doctor3 = User::firstOrCreate(['email' => 'doctor3@triage.com'], [
            'name' => 'Dr. Andrés Morales', 'password' => Hash::make('password'), 'role' => 'doctor',
        ]);
        $nurse2 = User::firstOrCreate(['email' => 'nurse2@triage.com'], [
            'name' => 'Enf. María Castillo', 'password' => Hash::make('password'), 'role' => 'nurse',
        ]);
        $nurse3 = User::firstOrCreate(['email' => 'nurse3@triage.com'], [
            'name' => 'Enf. Jorge Ramírez', 'password' => Hash::make('password'), 'role' => 'nurse',
        ]);

        // Obtener usuarios existentes
        $nurse1  = User::where('email', 'nurse1@triage.com')->first();
        $doctor1 = User::where('email', 'doctor1@triage.com')->first();
        $doctor2 = User::where('email', 'doctor2@triage.com')->first();

        // ── Sala adicional ────────────────────────────────────────────────
        Room::create(['name' => 'Urgencias B', 'type' => 'urgencias', 'assigned_doctor_id' => $doctor3->id]);

        $rooms = Room::all();

        // ── Pacientes ─────────────────────────────────────────────────────
        $pacientes = [
            ['name' => 'Carlos Mendoza',    'document' => '10234567', 'age' => 45, 'gender' => 'M'],
            ['name' => 'Laura Jiménez',     'document' => '20345678', 'age' => 32, 'gender' => 'F'],
            ['name' => 'Pedro Suárez',      'document' => '30456789', 'age' => 67, 'gender' => 'M'],
            ['name' => 'Ana Rodríguez',     'document' => '40567890', 'age' => 28, 'gender' => 'F'],
            ['name' => 'Miguel Torres',     'document' => '50678901', 'age' => 54, 'gender' => 'M'],
            ['name' => 'Sofía Vargas',      'document' => '60789012', 'age' => 19, 'gender' => 'F'],
            ['name' => 'Roberto Herrera',   'document' => '70890123', 'age' => 72, 'gender' => 'M'],
            ['name' => 'Valentina Cruz',    'document' => '80901234', 'age' => 41, 'gender' => 'F'],
            ['name' => 'Diego Martínez',    'document' => '91012345', 'age' => 35, 'gender' => 'M'],
            ['name' => 'Camila Flores',     'document' => '11123456', 'age' => 23, 'gender' => 'F'],
            ['name' => 'Ernesto Gómez',     'document' => '12234567', 'age' => 58, 'gender' => 'M'],
            ['name' => 'Patricia Lozano',   'document' => '13345678', 'age' => 47, 'gender' => 'F'],
            ['name' => 'Julián Peña',       'document' => '14456789', 'age' => 29, 'gender' => 'M'],
            ['name' => 'Isabella Mora',     'document' => '15567890', 'age' => 63, 'gender' => 'F'],
            ['name' => 'Sebastián Ríos',    'document' => '16678901', 'age' => 38, 'gender' => 'M'],
        ];

        $patients = collect($pacientes)->map(fn($p) => Patient::create($p));

        // ── Triage records ────────────────────────────────────────────────
        // Nivel 1 - Crítico (en atención inmediata)
        $t1 = TriageRecord::create([
            'patient_id' => $patients[0]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 1, 'symptoms' => 'Dolor torácico severo, dificultad respiratoria, sudoración fría',
            'heart_rate' => 118, 'blood_pressure_sys' => 85, 'blood_pressure_dia' => 50,
            'temperature' => 36.8, 'oxygen_saturation' => 88,
            'status' => 'in_attention', 'arrived_at' => now()->subMinutes(12), 'attended_at' => now()->subMinutes(8),
        ]);

        // Nivel 1 - Crítico (esperando, llegó hace 5 min - reclasificado)
        $t2 = TriageRecord::create([
            'patient_id' => $patients[1]->id, 'nurse_id' => $nurse2->id,
            'triage_level' => 1, 'symptoms' => 'Pérdida de consciencia momentánea, convulsiones',
            'heart_rate' => 140, 'blood_pressure_sys' => 200, 'blood_pressure_dia' => 110,
            'temperature' => 38.5, 'oxygen_saturation' => 91,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(5),
        ]);

        // Historial: llegó como nivel 2, empeoró a nivel 1
        TriageHistory::create([
            'triage_record_id' => $t2->id, 'changed_by' => $nurse2->id,
            'previous_level' => 2, 'new_level' => 1,
            'reason' => 'Paciente presentó convulsiones en sala de espera, se eleva a crítico',
        ]);

        // Nivel 2 - Urgente (esperando)
        $t3 = TriageRecord::create([
            'patient_id' => $patients[2]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 2, 'symptoms' => 'Fractura expuesta en pierna derecha, sangrado activo',
            'heart_rate' => 105, 'blood_pressure_sys' => 100, 'blood_pressure_dia' => 65,
            'temperature' => 37.2, 'oxygen_saturation' => 96,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(18),
        ]);

        // Nivel 2 - Urgente (en atención)
        $t4 = TriageRecord::create([
            'patient_id' => $patients[3]->id, 'nurse_id' => $nurse3->id,
            'triage_level' => 2, 'symptoms' => 'Quemaduras de segundo grado en brazos y tórax',
            'heart_rate' => 98, 'blood_pressure_sys' => 110, 'blood_pressure_dia' => 70,
            'temperature' => 37.8, 'oxygen_saturation' => 95,
            'status' => 'in_attention', 'arrived_at' => now()->subMinutes(25), 'attended_at' => now()->subMinutes(15),
        ]);

        // Nivel 3 - Moderado (esperando, lleva mucho tiempo → sube en cola)
        $t5 = TriageRecord::create([
            'patient_id' => $patients[4]->id, 'nurse_id' => $nurse2->id,
            'triage_level' => 3, 'symptoms' => 'Dolor abdominal moderado, náuseas y vómito',
            'heart_rate' => 88, 'blood_pressure_sys' => 125, 'blood_pressure_dia' => 80,
            'temperature' => 37.5, 'oxygen_saturation' => 98,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(55),
        ]);

        // Nivel 3 - Moderado (esperando)
        $t6 = TriageRecord::create([
            'patient_id' => $patients[5]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 3, 'symptoms' => 'Esguince de tobillo, dolor al caminar',
            'heart_rate' => 82, 'blood_pressure_sys' => 118, 'blood_pressure_dia' => 75,
            'temperature' => 36.9, 'oxygen_saturation' => 99,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(30),
        ]);

        // Nivel 3 - Moderado (reclasificado de 4 a 3)
        $t7 = TriageRecord::create([
            'patient_id' => $patients[6]->id, 'nurse_id' => $nurse3->id,
            'triage_level' => 3, 'symptoms' => 'Cefalea intensa, mareos, visión borrosa',
            'heart_rate' => 92, 'blood_pressure_sys' => 155, 'blood_pressure_dia' => 95,
            'temperature' => 37.1, 'oxygen_saturation' => 97,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(40),
        ]);

        TriageHistory::create([
            'triage_record_id' => $t7->id, 'changed_by' => $nurse3->id,
            'previous_level' => 4, 'new_level' => 3,
            'reason' => 'Presión arterial elevada 155/95, se reclasifica a urgente moderado',
        ]);

        // Nivel 4 - Leve (esperando)
        $t8 = TriageRecord::create([
            'patient_id' => $patients[7]->id, 'nurse_id' => $nurse2->id,
            'triage_level' => 4, 'symptoms' => 'Herida cortante superficial en mano, requiere sutura',
            'heart_rate' => 78, 'blood_pressure_sys' => 120, 'blood_pressure_dia' => 78,
            'temperature' => 36.7, 'oxygen_saturation' => 99,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(20),
        ]);

        // Nivel 4 - Leve (esperando)
        $t9 = TriageRecord::create([
            'patient_id' => $patients[8]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 4, 'symptoms' => 'Fiebre 38.2°C, dolor de garganta, malestar general',
            'heart_rate' => 90, 'blood_pressure_sys' => 115, 'blood_pressure_dia' => 72,
            'temperature' => 38.2, 'oxygen_saturation' => 98,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(15),
        ]);

        // Nivel 5 - No urgente (esperando)
        $t10 = TriageRecord::create([
            'patient_id' => $patients[9]->id, 'nurse_id' => $nurse3->id,
            'triage_level' => 5, 'symptoms' => 'Revisión de resultados de exámenes, control rutinario',
            'heart_rate' => 72, 'blood_pressure_sys' => 118, 'blood_pressure_dia' => 76,
            'temperature' => 36.5, 'oxygen_saturation' => 99,
            'status' => 'waiting', 'arrived_at' => now()->subMinutes(10),
        ]);

        // ── Pacientes ya atendidos (historial del turno) ──────────────────
        $t11 = TriageRecord::create([
            'patient_id' => $patients[10]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 2, 'symptoms' => 'Infarto agudo de miocardio confirmado',
            'heart_rate' => 55, 'blood_pressure_sys' => 90, 'blood_pressure_dia' => 60,
            'temperature' => 36.3, 'oxygen_saturation' => 87,
            'status' => 'attended', 'arrived_at' => now()->subHours(3), 'attended_at' => now()->subHours(3)->addMinutes(3),
        ]);

        $t12 = TriageRecord::create([
            'patient_id' => $patients[11]->id, 'nurse_id' => $nurse2->id,
            'triage_level' => 3, 'symptoms' => 'Apendicitis aguda, dolor en fosa ilíaca derecha',
            'heart_rate' => 95, 'blood_pressure_sys' => 130, 'blood_pressure_dia' => 85,
            'temperature' => 38.8, 'oxygen_saturation' => 96,
            'status' => 'attended', 'arrived_at' => now()->subHours(2), 'attended_at' => now()->subHours(2)->addMinutes(20),
        ]);

        $t13 = TriageRecord::create([
            'patient_id' => $patients[12]->id, 'nurse_id' => $nurse3->id,
            'triage_level' => 4, 'symptoms' => 'Contusión en rodilla por caída',
            'heart_rate' => 80, 'blood_pressure_sys' => 122, 'blood_pressure_dia' => 79,
            'temperature' => 36.6, 'oxygen_saturation' => 99,
            'status' => 'attended', 'arrived_at' => now()->subHours(1)->subMinutes(30), 'attended_at' => now()->subHours(1)->subMinutes(10),
        ]);

        $t14 = TriageRecord::create([
            'patient_id' => $patients[13]->id, 'nurse_id' => $nurse1->id,
            'triage_level' => 5, 'symptoms' => 'Dolor de cabeza leve, solicita analgésico',
            'heart_rate' => 70, 'blood_pressure_sys' => 116, 'blood_pressure_dia' => 74,
            'temperature' => 36.4, 'oxygen_saturation' => 99,
            'status' => 'attended', 'arrived_at' => now()->subHours(1), 'attended_at' => now()->subMinutes(45),
        ]);

        // ── Consultas activas ─────────────────────────────────────────────
        $room1 = $rooms->where('name', 'Consultorio 1')->first();
        $room2 = $rooms->where('name', 'Consultorio 2')->first();
        $roomU = $rooms->where('name', 'Urgencias A')->first();
        $roomUB = $rooms->where('name', 'Urgencias B')->first();

        // Consulta activa - t1 (crítico)
        Consultation::create([
            'triage_record_id' => $t1->id, 'doctor_id' => $doctor1->id,
            'room_id' => $roomU->id, 'started_at' => now()->subMinutes(8),
        ]);
        $roomU->update(['is_available' => false]);

        // Consulta activa - t4 (quemaduras)
        Consultation::create([
            'triage_record_id' => $t4->id, 'doctor_id' => $doctor2->id,
            'room_id' => $roomUB->id, 'started_at' => now()->subMinutes(15),
        ]);
        $roomUB->update(['is_available' => false]);

        // ── Consultas finalizadas ─────────────────────────────────────────
        Consultation::create([
            'triage_record_id' => $t11->id, 'doctor_id' => $doctor1->id,
            'room_id' => $room1->id, 'started_at' => now()->subHours(3)->addMinutes(3),
            'ended_at' => now()->subHours(2)->subMinutes(30),
            'diagnosis' => 'Infarto agudo de miocardio (IAM). Derivado a UCI.',
            'treatment' => 'Aspirina 300mg, nitroglicerina sublingual, traslado a UCI cardiológica.',
        ]);

        Consultation::create([
            'triage_record_id' => $t12->id, 'doctor_id' => $doctor2->id,
            'room_id' => $room2->id, 'started_at' => now()->subHours(2)->addMinutes(20),
            'ended_at' => now()->subHours(1)->subMinutes(30),
            'diagnosis' => 'Apendicitis aguda. Requiere intervención quirúrgica.',
            'treatment' => 'Antibióticos IV, preparación para cirugía de urgencia.',
        ]);

        Consultation::create([
            'triage_record_id' => $t13->id, 'doctor_id' => $doctor3->id,
            'room_id' => $room1->id, 'started_at' => now()->subHours(1)->subMinutes(10),
            'ended_at' => now()->subMinutes(40),
            'diagnosis' => 'Contusión de rodilla sin fractura.',
            'treatment' => 'Reposo, hielo local, ibuprofeno 400mg cada 8h.',
        ]);

        Consultation::create([
            'triage_record_id' => $t14->id, 'doctor_id' => $doctor3->id,
            'room_id' => $room2->id, 'started_at' => now()->subMinutes(45),
            'ended_at' => now()->subMinutes(20),
            'diagnosis' => 'Cefalea tensional.',
            'treatment' => 'Paracetamol 500mg, reposo, hidratación.',
        ]);
    }
}
