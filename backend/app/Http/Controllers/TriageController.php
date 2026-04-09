<?php

namespace App\Http\Controllers;

use App\Models\TriageRecord;
use App\Models\TriageHistory;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    // Cola de prioridad: waiting ordenados por score dinámico
    public function index()
    {
        $records = TriageRecord::with('patient', 'nurse')
            ->where('status', 'waiting')
            ->get()
            ->sortByDesc('priority_score')
            ->values();

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id'          => 'required|exists:patients,id',
            'triage_level'        => 'required|integer|between:1,5',
            'symptoms'            => 'required|string',
            'heart_rate'          => 'nullable|integer',
            'blood_pressure_sys'  => 'nullable|integer',
            'blood_pressure_dia'  => 'nullable|integer',
            'temperature'         => 'nullable|numeric',
            'oxygen_saturation'   => 'nullable|integer',
        ]);

        $data['nurse_id']    = $request->user()->id;
        $data['arrived_at']  = now();
        $data['status']      = 'waiting';

        $record = TriageRecord::create($data);

        return response()->json($record->load('patient', 'nurse'), 201);
    }

    public function show(TriageRecord $triageRecord)
    {
        return $triageRecord->load('patient', 'nurse', 'consultation.doctor', 'consultation.room', 'history.changedBy');
    }

    // Reclasificación: cambia nivel y registra en historial
    public function reclassify(Request $request, TriageRecord $triageRecord)
    {
        $data = $request->validate([
            'triage_level' => 'required|integer|between:1,5',
            'reason'       => 'required|string',
        ]);

        TriageHistory::create([
            'triage_record_id' => $triageRecord->id,
            'changed_by'       => $request->user()->id,
            'previous_level'   => $triageRecord->triage_level,
            'new_level'        => $data['triage_level'],
            'reason'           => $data['reason'],
        ]);

        $triageRecord->update(['triage_level' => $data['triage_level']]);

        return response()->json($triageRecord->fresh()->load('history.changedBy'));
    }

    // Cambiar estado del paciente
    public function updateStatus(Request $request, TriageRecord $triageRecord)
    {
        $data = $request->validate([
            'status' => 'required|in:waiting,in_attention,attended,transferred,discharged',
        ]);

        if ($data['status'] === 'in_attention' && !$triageRecord->attended_at) {
            $triageRecord->attended_at = now();
        }

        $triageRecord->update($data);

        return response()->json($triageRecord);
    }

    public function destroy(TriageRecord $triageRecord)
    {
        $triageRecord->delete();
        return response()->json(null, 204);
    }
}
