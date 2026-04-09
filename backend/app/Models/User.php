<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isDoctor(): bool { return $this->role === 'doctor'; }
    public function isNurse(): bool { return $this->role === 'nurse'; }

    public function triageRecordsAsNurse() { return $this->hasMany(TriageRecord::class, 'nurse_id'); }
    public function consultations() { return $this->hasMany(Consultation::class, 'doctor_id'); }
    public function rooms() { return $this->hasMany(Room::class, 'assigned_doctor_id'); }
}
