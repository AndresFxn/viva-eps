<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        return Patient::with('latestTriage')->orderBy('name')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'document' => 'required|string|unique:patients',
            'age'      => 'required|integer|min:0|max:150',
            'gender'   => 'required|in:M,F,otro',
            'phone'    => 'nullable|string',
            'notes'    => 'nullable|string',
        ]);

        return response()->json(Patient::create($data), 201);
    }

    public function show(Patient $patient)
    {
        return $patient->load('triageRecords.nurse', 'triageRecords.consultation');
    }

    public function update(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'age'    => 'sometimes|integer|min:0|max:150',
            'gender' => 'sometimes|in:M,F,otro',
            'phone'  => 'nullable|string',
            'notes'  => 'nullable|string',
        ]);

        $patient->update($data);
        return response()->json($patient);
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json(null, 204);
    }
}
