<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = ['triage_record_id', 'doctor_id', 'room_id', 'started_at', 'ended_at', 'diagnosis', 'treatment'];

    protected $casts = ['started_at' => 'datetime', 'ended_at' => 'datetime'];

    public function triageRecord() { return $this->belongsTo(TriageRecord::class); }
    public function doctor() { return $this->belongsTo(User::class, 'doctor_id'); }
    public function room() { return $this->belongsTo(Room::class); }
}
