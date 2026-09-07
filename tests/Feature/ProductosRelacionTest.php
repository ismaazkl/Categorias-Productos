<?php

use App\Models\Grupos;
use App\Models\Productos;

it('guarda un producto asociado a un grupo y lo expone en la vista', function () {
    $grupo = Grupos::create([
        'grupo' => 'Bebidas',
        'descripcion' => 'Grupo de bebidas',
    ]);

    $response = $this->post('/categorias', [
        'grupo_id' => $grupo->id,
        'cat' => $grupo->grupo,
        'nombre' => 'Coca Cola',
        'descripcion' => 'Gaseosa',
        'precio' => 25.5,
        'marca' => 'Coca-Cola',
        'completed' => true,
    ]);

    $response->assertRedirect('/categorias');

    $producto = Productos::where('nombre', 'Coca Cola')->firstOrFail();
    expect($producto->grupo_id)->toBe($grupo->id)
        ->and($producto->grupo->grupo)->toBe('Bebidas');

    $this->get('/categorias')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Categorias/Index')
            ->has('productos.0.grupo')
            ->where('productos.0.grupo.grupo', 'Bebidas')
        );
});
