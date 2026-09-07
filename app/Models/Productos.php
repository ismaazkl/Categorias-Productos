<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Productos extends Model
{
    use HasFactory;

    protected $table = 'Productos';

    protected $fillable = [
        'grupo_id',
        'cat',
        'nombre',
        'descripcion',
        'precio',
        'marca',
        'completed',
    ];

    public function grupo()
    {
        return $this->belongsTo(Grupos::class, 'grupo_id');
    }
}