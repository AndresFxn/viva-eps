<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\TriageRecord;
use App\Models\Room;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index()
    {
        return Consultation::with('triageRecord.patient', 'doctor', 'room')
            ->orderByDesc('started_at')
            ->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'triage_record_id' => 'required|exists:triage_records,id',
            'doctor_id'        => 'required|exists:users,id',
            'room_id'          => 'required|exists:rooms,id',
        ]);

        Room::where('id', $data['room_id'])->update(['is_available' => false]);
        TriageRecord::where('id', $data['triage_record_id'])->update([
            'status'      => 'in_attention',
            'attended_at' => now(),
        ]);

        $data['started_at'] = now();
        $consultation = Consultation::create($data);

        return response()->json($consultation->load('triageRecord.patient', 'doctor', 'room'), 201);
    }

    public function show(Consultation $consultation)
    {
        return $consultation->load('triageRecord.patient', 'doctor', 'room');
    }

    public function finish(Request $request, Consultation $consultation)
    {
        $data = $request->validate([
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
        ]);

        $consultation->update([
            'ended_at'  => now(),
            'diagnosis' => $data['diagnosis'],
            'treatment' => $data['treatment'],
        ]);

        Room::where('id', $consultation->room_id)->update(['is_available' => true]);
        TriageRecord::where('id', $consultation->triage_record_id)->update(['status' => 'attended']);

        return response()->json($consultation->fresh()->load('triageRecord.patient', 'doctor', 'room'));
    }

    public function destroy(Consultation $consultation)
    {
        $consultation->delete();
        return response()->json(null, 204);
    }
}
