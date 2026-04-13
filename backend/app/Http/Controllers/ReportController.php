<?php

namespace App\Http\Controllers;

use App\Models\TriageRecord;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $from = $request->query('from', now()->startOfDay());
        $to   = $request->query('to', now()->endOfDay());

        $byLevel = TriageRecord::select('triage_level', DB::raw('count(*) as total'))
            ->whereBetween('arrived_at', [$from, $to])
            ->groupBy('triage_level')
            ->orderBy('triage_level')
            ->get();

        $byStatus = TriageRecord::select('status', DB::raw('count(*) as total'))
            ->whereBetween('arrived_at', [$from, $to])
            ->groupBy('status')
            ->get();

        $avgWaitMinutes = TriageRecord::whereNotNull('attended_at')
            ->whereBetween('arrived_at', [$from, $to])
            ->select(DB::raw('AVG(EXTRACT(EPOCH FROM (attended_at - arrived_at))/60) as avg_minutes'))
            ->value('avg_minutes');

        $byDoctor = Consultation::select('doctor_id', DB::raw('count(*) as total_consultations'))
            ->with('doctor:id,name')
            ->whereBetween('started_at', [$from, $to])
            ->groupBy('doctor_id')
            ->get();

        return response()->json([
            'period'              => ['from' => $from, 'to' => $to],
            'by_triage_level'     => $byLevel,
            'by_status'           => $byStatus,
            'avg_wait_minutes'    => round($avgWaitMinutes, 1),
            'consultations_by_doctor' => $byDoctor,
        ]);
    }

    public function reclassifications(Request $request)
    {
        $from = $request->query('from', now()->startOfDay());
        $to   = $request->query('to', now()->endOfDay());

        $data = \App\Models\TriageHistory::with('triageRecord.patient', 'changedBy')
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($data);
    }
}
