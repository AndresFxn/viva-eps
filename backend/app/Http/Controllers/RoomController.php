<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return Room::with('doctor')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:100',
            'type'               => 'required|in:consultorio,urgencias,trauma,quirofano,uci',
            'assigned_doctor_id' => 'nullable|exists:users,id',
        ]);

        return response()->json(Room::create($data), 201);
    }

    public function show(Room $room)
    {
        return $room->load('doctor', 'consultations.triageRecord.patient');
    }

    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'name'               => 'sometimes|string|max:100',
            'type'               => 'sometimes|in:consultorio,urgencias,trauma,quirofano,uci',
            'is_available'       => 'sometimes|boolean',
            'assigned_doctor_id' => 'nullable|exists:users,id',
        ]);

        $room->update($data);
        return response()->json($room->fresh()->load('doctor'));
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return response()->json(null, 204);
    }
}
