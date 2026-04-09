<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = ['name', 'document', 'age', 'gender', 'phone', 'notes'];

    public function triageRecords() { return $this->hasMany(TriageRecord::class); }
    public function latestTriage() { return $this->hasOne(TriageRecord::class)->latestOfMany(); }
}
