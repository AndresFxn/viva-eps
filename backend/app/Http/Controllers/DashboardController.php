<?php

namespace App\Http\Controllers;

use App\Models\TriageRecord;
use App\Models\Room;
use App\Models\Consultation;

class DashboardController extends Controller
{
    public function index()
    {
        $queue = TriageRecord::with('patient', 'nurse')
            ->where('status', 'waiting')
            ->get()
            ->sortByDesc('priority_score')
            ->values();

        $inAttention = TriageRecord::with('patient', 'consultation.doctor', 'consultation.room')
            ->where('status', 'in_attention')
            ->get();

        $rooms = Room::with('doctor')->get();

        $today = now()->startOfDay();
        $stats = [
            'waiting'      => $queue->count(),
            'in_attention' => $inAttention->count(),
            'attended_today' => TriageRecord::where('status', 'attended')
                ->whereDate('attended_at', today())->count(),
            'critical'     => $queue->where('triage_level', 1)->count(),
        ];

        return response()->json([
            'queue'        => $queue,
            'in_attention' => $inAttention,
            'rooms'        => $rooms,
            'stats'        => $stats,
        ]);
    }
}
