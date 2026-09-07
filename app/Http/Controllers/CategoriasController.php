<?php

namespace App\Http\Controllers;

use App\Models\Grupos;
use App\Models\Productos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class CategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Categorias/Index', [
            'productos' => Productos::with('grupo')->latest()->get(),
            'grupos' => Grupos::orderBy('grupo')->get(),
            'categorias' => Grupos::orderBy('grupo')->get()->map(function ($g) {
                return [
                    'id' => $g->id,
                    'nombre' => $g->grupo,
                    'descripcion' => $g->descripcion,
                ];
            })->values(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grupo_id' => ['nullable', 'exists:grupos,id'],
            'cat' => ['nullable', 'string', 'max:255'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'precio' => ['nullable', 'numeric', 'min:0'],
            'marca' => ['nullable', 'string', 'max:255'],
            'completed' => ['boolean'],
        ]);

        if (empty($validated['cat']) && !empty($validated['grupo_id'])) {
            $grupo = Grupos::find($validated['grupo_id']);
            $validated['cat'] = $grupo?->grupo ?? '';
        }

        if (empty($validated['cat'])) {
            $validated['cat'] = '';
        }

        Productos::create($validated);

        return redirect()->route('categorias.index')->with('success', 'Producto guardado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Actualiza un grupo (tratado aquí como "categoría")
        $grupo = Grupos::findOrFail($id);
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $grupo->update([
            'grupo' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
        ]);

        return redirect()->route('categorias.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
    // Elimina un grupo (tratado como categoría)
    $grupo = Grupos::findOrFail($id);
    $grupo->delete();
    return redirect()->route('categorias.index');
    }
}
