<?php

namespace App\Http\Controllers;

use App\Models\Grupos;
use App\Models\Productos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;


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
    
    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, string $id)
    {
        $producto = Productos::findOrFail($id);
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

        $producto->update($validated);

        return redirect()->route('categorias.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $producto = Productos::findOrFail($id);
        $producto->delete();

        return redirect()->route('categorias.index')
            ->with('success', 'Producto eliminado correctamente.');
    }
    public function generarPdf()
    {
        $productos = Productos::with('grupo')->latest()->get();
        
        $totalProducto = $productos->count();
        $precioPromedio = $productos->avg('precio');
        $precioTotal = $productos->sum('precio');
        
        $totalProducto = $totalProducto + $precioPromedio;
        $pdf = Pdf::loadView('pdf.productos', compact(
            'productos',
            'totalProducto',
            'precioPromedio',
            'precioTotal',

        ));
        // Descargar PDF
        return $pdf->download('reporte_productos_' . date('Y-m-d') . '.pdf');
    }

}
