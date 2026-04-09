<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['name', 'type', 'is_available', 'assigned_doctor_id'];

    public function doctor() { return $this->belongsTo(User::class, 'assigned_doctor_id'); }
    public function consultations() { return $this->hasMany(Consultation::class); }
}
