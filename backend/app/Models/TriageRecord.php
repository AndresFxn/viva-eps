<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TriageRecord extends Model
{
    protected $fillable = [
        'patient_id', 'nurse_id', 'triage_level', 'symptoms',
        'heart_rate', 'blood_pressure_sys', 'blood_pressure_dia',
        'temperature', 'oxygen_saturation', 'status', 'arrived_at', 'attended_at',
    ];

    protected $casts = ['arrived_at' => 'datetime', 'attended_at' => 'datetime'];

    public function patient() { return $this->belongsTo(Patient::class); }
    public function nurse() { return $this->belongsTo(User::class, 'nurse_id'); }
    public function consultation() { return $this->hasOne(Consultation::class); }
    public function history() { return $this->hasMany(TriageHistory::class); }

    /**
     * Score para la cola de prioridad:
     * mayor nivel de urgencia (1=crítico) + tiempo de espera acumulado
     */
    public function getPriorityScoreAttribute(): int
    {
        $minutesWaiting = now()->diffInMinutes($this->arrived_at);
        return (6 - $this->triage_level) * 1000 + $minutesWaiting;
    }
}
