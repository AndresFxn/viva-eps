<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TriageController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

// Autenticación pública
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Dashboard en tiempo real
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Pacientes
    Route::apiResource('patients', PatientController::class);

    // Triage
    Route::get('/triage',                              [TriageController::class, 'index']);
    Route::post('/triage',                             [TriageController::class, 'store']);
    Route::get('/triage/{triageRecord}',               [TriageController::class, 'show']);
    Route::delete('/triage/{triageRecord}',            [TriageController::class, 'destroy']);
    Route::patch('/triage/{triageRecord}/reclassify',  [TriageController::class, 'reclassify']);
    Route::patch('/triage/{triageRecord}/status',      [TriageController::class, 'updateStatus']);

    // Consultas
    Route::apiResource('consultations', ConsultationController::class)->except(['update']);
    Route::patch('/consultations/{consultation}/finish', [ConsultationController::class, 'finish']);

    // Salas (solo admin)
    Route::apiResource('rooms', RoomController::class);

    // Reportes (solo admin/doctor)
    Route::get('/reports/summary',           [ReportController::class, 'summary']);
    Route::get('/reports/reclassifications', [ReportController::class, 'reclassifications']);
});
