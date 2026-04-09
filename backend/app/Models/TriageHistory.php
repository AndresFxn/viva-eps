<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TriageHistory extends Model
{
    protected $fillable = ['triage_record_id', 'changed_by', 'previous_level', 'new_level', 'reason'];

    public function triageRecord() { return $this->belongsTo(TriageRecord::class); }
    public function changedBy() { return $this->belongsTo(User::class, 'changed_by'); }
}
