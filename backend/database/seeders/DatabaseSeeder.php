<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use App\Models\Patient;
use App\Models\TriageRecord;
use App\Models\Consultation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create(['name' => 'Administrador', 'email' => 'admin@triage.com', 'password' => Hash::make('password'), 'role' => 'admin']);

        $doctors = collect([
            ['Dr. Carlos Pérez',          'doctor1@triage.com'],
            ['Dra. Ana Gómez',            'doctor2@triage.com'],
            ['Dr. Miguel Rodríguez',      'doctor3@triage.com'],
            ['Dra. Laura Martínez',       'doctor4@triage.com'],
            ['Dr. Andrés Herrera',        'doctor5@triage.com'],
            ['Dra. Claudia Ospina',       'doctor6@triage.com'],
            ['Dr. Felipe Montoya',        'doctor7@triage.com'],
            ['Dra. Natalia Restrepo',     'doctor8@triage.com'],
            ['Dr. Sebastián Arango',      'doctor9@triage.com'],
            ['Dra. Juliana Cárdenas',     'doctor10@triage.com'],
            ['Dr. Camilo Estrada',        'doctor11@triage.com'],
            ['Dra. Marcela Giraldo',      'doctor12@triage.com'],
            ['Dr. Iván Zapata',           'doctor13@triage.com'],
            ['Dra. Paola Henao',          'doctor14@triage.com'],
            ['Dr. Rodrigo Salazar',       'doctor15@triage.com'],
            ['Dra. Verónica Muñoz',       'doctor16@triage.com'],
            ['Dr. Gustavo Ríos',          'doctor17@triage.com'],
            ['Dra. Carolina Bermúdez',    'doctor18@triage.com'],
            ['Dr. Alejandro Mora',        'doctor19@triage.com'],
            ['Dra. Ximena Pedraza',       'doctor20@triage.com'],
        ])->map(fn($d) => User::create(['name' => $d[0], 'email' => $d[1], 'password' => Hash::make('password'), 'role' => 'doctor']));

        $nurses = collect([
            ['Enf. Luis Torres',       'nurse1@triage.com'],
            ['Enf. María Castillo',    'nurse2@triage.com'],
            ['Enf. Jorge Ramírez',     'nurse3@triage.com'],
            ['Enf. Sandra Morales',    'nurse4@triage.com'],
            ['Enf. Camilo Vargas',     'nurse5@triage.com'],
            ['Enf. Patricia Lozano',   'nurse6@triage.com'],
            ['Enf. Andrés Nieto',      'nurse7@triage.com'],
        ])->map(fn($n) => User::create(['name' => $n[0], 'email' => $n[1], 'password' => Hash::make('password'), 'role' => 'nurse']));

        $rooms = collect([
            ['Consultorio 1',           'consultorio', $doctors[0]->id],
            ['Consultorio 2',           'consultorio', $doctors[1]->id],
            ['Consultorio 3',           'consultorio', $doctors[2]->id],
            ['Consultorio 4',           'consultorio', $doctors[3]->id],
            ['Consultorio 5',           'consultorio', $doctors[4]->id],
            ['Consultorio Pediatría',   'consultorio', $doctors[5]->id],
            ['Consultorio Geriatría',   'consultorio', $doctors[6]->id],
            ['Urgencias A',             'urgencias',   $doctors[7]->id],
            ['Urgencias B',             'urgencias',   $doctors[8]->id],
            ['Urgencias C',             'urgencias',   $doctors[9]->id],
            ['Urgencias Pediátricas',   'urgencias',   $doctors[10]->id],
            ['Trauma 1',                'trauma',      $doctors[11]->id],
            ['Trauma 2',                'trauma',      $doctors[12]->id],
            ['Trauma 3',                'trauma',      null],
            ['Reanimación 1',           'urgencias',   $doctors[13]->id],
            ['Reanimación 2',           'urgencias',   null],
            ['Quirófano 1',             'quirofano',   $doctors[14]->id],
            ['Quirófano 2',             'quirofano',   $doctors[15]->id],
            ['Quirófano 3',             'quirofano',   null],
            ['UCI',                     'urgencias',   $doctors[16]->id],
        ])->map(fn($r) => Room::create(['name' => $r[0], 'type' => $r[1], 'assigned_doctor_id' => $r[2]]));

        $patientsData = [
            ['Juan Pablo Moreno',       '10234567', 45, 'M', '3001234567', 'Dolor torácico irradiado al brazo izquierdo, diaforesis, posible IAM',                    1, 115, 165, 102, 37.8, 90, 'waiting',     120],
            ['María Fernanda López',    '20345678', 32, 'F', '3012345678', 'Convulsiones tónico-clónicas generalizadas, pérdida de consciencia',                      1, 132, 182, 112, 38.6, 87, 'waiting',     95],
            ['Roberto Salinas',         '31234567', 67, 'M', '3021234567', 'ACV isquémico, hemiplejia derecha, afasia motora',                                        1, 98,  195, 118, 37.2, 92, 'waiting',     40],
            ['Isabela Quintero',        '41234567', 28, 'F', '3031234567', 'Anafilaxia severa tras picadura de abeja, edema de glotis, estridor',                     1, 140, 80,  50,  37.0, 85, 'waiting',     15],
            ['Ernesto Palomino',        '51111111', 72, 'M', '3041111111', 'Paro cardiorrespiratorio recuperado, arritmia ventricular',                               1, 42,  70,  40,  36.2, 82, 'in_attention',10],
            ['Sofía Bermúdez',          '61111111', 24, 'F', '3051111111', 'Intoxicación por benzodiacepinas, Glasgow 8, bradipnea',                                  1, 52,  90,  55,  36.8, 88, 'in_attention',20],

            ['Carlos Andrés Ruiz',      '30456789', 58, 'M', '3023456789', 'Fractura expuesta tibia derecha, accidente de tránsito, sangrado activo',                 2, 96,  142, 91,  37.3, 96, 'waiting',     75],
            ['Ana Lucía Vargas',        '40567890', 27, 'F', '3034567890', 'Quemaduras segundo grado en brazos y tórax, 20% superficie corporal',                    2, 104, 132, 86,  38.2, 94, 'waiting',     60],
            ['Pedro José Salcedo',      '50678901', 63, 'M', '3045678901', 'Dolor abdominal severo fosa ilíaca derecha, fiebre, posible apendicitis',                 2, 90,  128, 82,  38.9, 97, 'waiting',     90],
            ['Sofía Alejandra Ríos',    '60789012', 19, 'F', '3056789012', 'Meningitis bacteriana sospechada, fiebre 39.5°C, rigidez de nuca, petequias',            2, 108, 120, 76,  39.5, 95, 'waiting',     50],
            ['Hernán Darío Cano',       '51234567', 50, 'M', '3051234567', 'Hemoptisis masiva, tos con sangre abundante, antecedente de TBC pulmonar',               2, 112, 100, 65,  38.4, 89, 'in_attention',35],
            ['Paola Andrea Suárez',     '61234567', 35, 'F', '3061234567', 'Eclampsia, 36 semanas gestación, PA 170/110, edema generalizado',                        2, 100, 170, 110, 37.8, 96, 'in_attention',25],
            ['Tomás Guerrero',          '71111111', 48, 'M', '3071111111', 'Trauma craneoencefálico moderado, pérdida de consciencia 5 min, vómito',                 2, 88,  145, 92,  37.5, 95, 'waiting',     45],
            ['Valentina Ospina',        '81111111', 31, 'F', '3081111111', 'Neumotórax espontáneo, dolor pleurítico, disnea progresiva',                              2, 118, 105, 68,  37.1, 91, 'waiting',     30],

            ['Luis Eduardo Castro',     '70890123', 41, 'M', '3067890123', 'Esguince grado II tobillo derecho, dolor moderado, leve edema periarticular',            3, 79,  122, 79,  36.8, 98, 'waiting',     110],
            ['Valentina Cruz',          '80901234', 35, 'F', '3078901234', 'Infección urinaria complicada, fiebre 38°C, disuria intensa, escalofríos',               3, 84,  116, 73,  38.0, 99, 'waiting',     100],
            ['Hernando Mejía',          '91012345', 70, 'M', '3089012345', 'Crisis hipertensiva, cefalea intensa, visión borrosa, PA 158/97',                        3, 70,  158, 97,  36.5, 97, 'waiting',     130],
            ['Diana Marcela Parra',     '71234567', 29, 'F', '3071234567', 'Crisis asmática moderada, sibilancias, uso de músculos accesorios',                      3, 102, 118, 74,  37.1, 93, 'in_attention',55],
            ['Mauricio León',           '81234567', 44, 'M', '3081234567', 'Cólico renal, dolor lumbar irradiado a ingle, hematuria macroscópica',                   3, 95,  135, 88,  37.4, 98, 'waiting',     85],
            ['Lucía Fernández',         '91234567', 55, 'F', '3091234567', 'Gastroenteritis aguda, deshidratación moderada, vómito persistente x6h',                 3, 92,  105, 68,  38.3, 97, 'waiting',     70],
            ['Nicolás Arboleda',        '91111111', 36, 'M', '3091111111', 'Celulitis en pierna izquierda, eritema, calor local, fiebre 38.1°C',                     3, 86,  120, 76,  38.1, 98, 'waiting',     95],
            ['Adriana Molina',          '10111111', 42, 'F', '3101111111', 'Lumbalgia aguda incapacitante, contractura muscular severa, sin déficit neurológico',     3, 78,  118, 75,  36.7, 99, 'waiting',     115],
            ['Felipe Cardona',          '11111112', 26, 'M', '3111111112', 'Fractura de clavícula derecha, caída de bicicleta, dolor intenso',                       3, 82,  125, 80,  36.9, 98, 'waiting',     80],
            ['Daniela Ríos',            '12111111', 22, 'F', '3121111111', 'Reacción alérgica moderada, urticaria generalizada, prurito intenso',                    3, 90,  112, 70,  37.2, 98, 'waiting',     65],

            ['Camila Ortega',           '11123456', 24, 'F', '3090123456', 'Faringoamigdalitis, odinofagia intensa, fiebre leve 37.8°C',                             4, 75,  113, 71,  37.8, 99, 'waiting',     150],
            ['Ricardo Pinto',           '12234567', 30, 'M', '3101234567', 'Herida cortante superficial mano derecha, requiere sutura, sangrado controlado',         4, 77,  119, 75,  36.7, 99, 'waiting',     140],
            ['Alejandro Ríos',          '13456789', 22, 'M', '3111234567', 'Contusión rodilla izquierda, dolor leve, sin deformidad ni inestabilidad',               4, 72,  115, 72,  36.6, 99, 'waiting',     160],
            ['Marcela Jiménez',         '14567890', 38, 'F', '3121234567', 'Migraña con aura, cefalea pulsátil unilateral, fotofobia, náuseas',                      4, 80,  125, 80,  36.9, 99, 'waiting',     170],
            ['Tomás Agudelo',           '15678901', 8,  'M', '3131234567', 'Otitis media aguda, otalgia derecha, fiebre 38.2°C, irritabilidad',                      4, 98,  100, 62,  38.2, 99, 'waiting',     145],
            ['Beatriz Londoño',         '13111111', 60, 'F', '3131111111', 'Conjuntivitis bacteriana bilateral, secreción purulenta, fotofobia leve',                 4, 74,  122, 78,  36.8, 99, 'waiting',     180],
            ['Samuel Peña',             '14111111', 17, 'M', '3141111111', 'Esguince de muñeca derecha, caída jugando fútbol, dolor moderado',                       4, 76,  114, 72,  36.6, 99, 'waiting',     155],
            ['Natalia Gómez',           '15111111', 33, 'F', '3151111111', 'Dolor dental agudo, absceso periapical, fiebre leve',                                    4, 80,  118, 74,  37.5, 99, 'waiting',     165],

            ['Gloria Inés Suárez',      '13345678', 52, 'F', '3112345678', 'Control rutina, renovación fórmula médica para hipertensión arterial',                   5, 72,  130, 82,  36.6, 99, 'waiting',     200],
            ['Ernesto Palacio',         '16789012', 60, 'M', '3141234567', 'Revisión resultados laboratorio, paciente diabético estable',                            5, 70,  128, 80,  36.5, 99, 'waiting',     210],
            ['Pilar Echeverri',         '17890123', 45, 'F', '3151234567', 'Solicitud incapacidad médica, resfriado común leve, sin fiebre',                         5, 74,  110, 68,  37.1, 99, 'waiting',     220],
            ['Jorge Esteban Rueda',     '16111111', 38, 'M', '3161111111', 'Revisión de herida postquirúrgica, cicatrización normal',                                5, 72,  115, 72,  36.7, 99, 'waiting',     230],
            ['Amparo Villegas',         '17111111', 55, 'F', '3171111111', 'Solicitud de exámenes preventivos, paciente asintomática',                               5, 70,  120, 76,  36.6, 99, 'waiting',     240],

            ['Rodrigo Castaño',         '18111111', 53, 'M', '3181111111', 'Infarto agudo de miocardio, trombolisis exitosa, estable',                               1, 88,  130, 85,  37.0, 96, 'attended',    300],
            ['Liliana Montoya',         '19111111', 44, 'F', '3191111111', 'Apendicitis aguda, llevada a cirugía, evolución satisfactoria',                          2, 82,  118, 74,  36.8, 98, 'attended',    280],
            ['Andrés Felipe Torres',    '20111111', 29, 'M', '3201111111', 'Fractura de radio distal, reducción e inmovilización, alta con analgesia',               3, 76,  120, 76,  36.7, 99, 'attended',    260],
            ['Carmen Rosa Díaz',        '21111111', 67, 'F', '3211111111', 'Neumonía adquirida en comunidad, antibioticoterapia iniciada, hospitalizada',            2, 94,  110, 70,  38.8, 93, 'attended',    320],
            ['Julián Estrada',          '22111111', 35, 'M', '3221111111', 'Cólico biliar, ecografía confirma colelitiasis, manejo médico',                          3, 88,  125, 80,  37.3, 98, 'attended',    250],
            ['Patricia Salcedo',        '23111111', 48, 'F', '3231111111', 'Crisis de pánico, manejo ansiolítico, psicoeducación, alta',                             4, 102, 140, 90,  37.0, 99, 'attended',    200],
            ['Héctor Muñoz',            '24111111', 61, 'M', '3241111111', 'EPOC exacerbado, broncodilatadores, mejoría clínica, hospitalizado',                     2, 100, 135, 88,  37.6, 88, 'attended',    340],
            ['Susana Arbeláez',         '25111111', 26, 'F', '3251111111', 'Gastritis aguda, manejo con IBP y antiespasmódicos, alta',                               4, 78,  112, 70,  36.8, 99, 'attended',    190],
            ['Manuel Giraldo',          '26111111', 40, 'M', '3261111111', 'Trauma ocular por cuerpo extraño, extracción exitosa, colirio antibiótico',              3, 80,  118, 74,  36.7, 99, 'attended',    210],
            ['Rosa Elena Vargas',       '27111111', 72, 'F', '3271111111', 'Caída con fractura de cadera, cirugía programada, en espera de quirófano',               2, 86,  138, 88,  37.2, 97, 'attended',    360],
        ];

        foreach ($patientsData as $p) {
            $patient = Patient::create([
                'name'     => $p[0],
                'document' => $p[1],
                'age'      => $p[2],
                'gender'   => $p[3],
                'phone'    => $p[4],
            ]);

            $arrivedAt = now()->subMinutes($p[13]);
            $attendedAt = in_array($p[12], ['attended', 'in_attention']) ? $arrivedAt->copy()->addMinutes(rand(10, 40)) : null;

            $triage = TriageRecord::create([
                'patient_id'         => $patient->id,
                'nurse_id'           => $nurses->random()->id,
                'triage_level'       => $p[6],
                'symptoms'           => $p[5],
                'heart_rate'         => $p[7],
                'blood_pressure_sys' => $p[8],
                'blood_pressure_dia' => $p[9],
                'temperature'        => $p[10],
                'oxygen_saturation'  => $p[11],
                'status'             => $p[12],
                'arrived_at'         => $arrivedAt,
                'attended_at'        => $attendedAt,
            ]);

            if ($p[12] === 'attended') {
                Consultation::create([
                    'triage_record_id' => $triage->id,
                    'doctor_id'        => $doctors->random()->id,
                    'room_id'          => $rooms->random()->id,
                    'started_at'       => $attendedAt,
                    'ended_at'         => $attendedAt->copy()->addMinutes(rand(20, 60)),
                    'diagnosis'        => 'Diagnóstico confirmado según cuadro clínico. Tratamiento instaurado.',
                    'treatment'        => 'Manejo farmacológico y seguimiento ambulatorio indicado.',
                ]);
            }

            if ($p[12] === 'in_attention') {
                $room = Room::where('is_available', true)->first();
                if ($room) {
                    $room->update(['is_available' => false]);
                    Consultation::create([
                        'triage_record_id' => $triage->id,
                        'doctor_id'        => $room->assigned_doctor_id ?? $doctors->random()->id,
                        'room_id'          => $room->id,
                        'started_at'       => $attendedAt,
                        'ended_at'         => null,
                        'diagnosis'        => null,
                        'treatment'        => null,
                    ]);
                }
            }
        }
    }
}
