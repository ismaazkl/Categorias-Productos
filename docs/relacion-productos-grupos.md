# Relación entre productos y grupos

## Objetivo

El objetivo es que cada producto tenga un grupo asociado, y que cuando se muestre la lista de productos se vea el nombre del grupo que está guardado en la tabla `grupos`.

Esto mejora mucho la lógica del proyecto porque en vez de guardar un texto cualquiera en `cat`, ahora el sistema trabaja con una relación real entre tablas. Eso permite:

- evitar datos repetidos o inconsistentes
- reutilizar los grupos ya creados
- mostrar información ordenada y correcta
- poder filtrar, editar o consultar productos por grupo

Antes de este cambio, un producto solo tenía un campo `cat` como texto libre, y la vista lo mostraba sin conocer si ese valor existía realmente en la tabla de grupos.

---

## Qué problema había antes

En el proyecto existían dos modelos separados:

- `Grupos`: representa los grupos creados por el usuario
- `Productos`: representa los productos del sistema

Sin embargo, la relación entre ambos no estaba definida. El producto no tenía una referencia directa a `grupos`; solo tenía un campo `cat` con texto.

Eso significa que el sistema no entendía algo como:

- este producto pertenece al grupo “Bebidas”
- este producto pertenece al grupo “Limpieza”

Y cuando se mostraba en la vista, el valor dependía únicamente de un texto suelto, no de una fila real de la base de datos.

---

## ¿Qué es una relación en Laravel?

Laravel usa Eloquent para trabajar con relaciones entre modelos.

Una relación hace que un modelo pueda “preguntar” a otro modelo por sus datos relacionados.

Por ejemplo:

- un producto pertenece a un grupo
- un grupo tiene muchos productos

Eso se expresa así:

```php
public function grupo()
{
    return $this->belongsTo(Grupos::class, 'grupo_id');
}
```

### Explicación de esa línea:

- `belongsTo` significa: “este modelo pertenece a otro”
- `Grupos::class` indica la clase del modelo relacionado
- `'grupo_id'` indica la columna que guarda la referencia

En otras palabras: cada producto guarda el id de su grupo y Laravel sabe cómo obtener ese grupo.

---

## ¿Qué es una llave foránea?

Una llave foránea es una columna que apunta a la clave primaria de otra tabla.

En este caso:

- `grupos.id` es la clave primaria
- `productos.grupo_id` es la llave foránea

Esto hace que la base de datos sepa que un producto pertenece a un grupo concreto.

Por ejemplo:

```php
grupo_id = 3
```

significa:

- el producto está asociado al grupo con id 3
- ese grupo puede ser “Ropa”, “Bebidas”, etc.

La clave foránea se crea en la migración:

```php
$table->foreignId('grupo_id')->nullable()->constrained('grupos')->onDelete('set null');
```

### Explicación:

- `foreignId('grupo_id')`: crea la columna `grupo_id`
- `constrained('grupos')`: dice que esa columna apunta a la tabla `grupos`
- `onDelete('set null')`: si se elimina un grupo, el producto queda con `grupo_id = null` en lugar de romper la base de datos

---

## Archivos importantes y su función

### 1) Migración de la base de datos

Archivo:
- [database/migrations/2026_08_26_120000_add_grupo_id_to_productos_table.php](../database/migrations/2026_08_26_120000_add_grupo_id_to_productos_table.php)

Función:

- agrega la columna `grupo_id` a la tabla `Productos`
- crea la relación real con `grupos`

Código base:

```php
Schema::table('Productos', function (Blueprint $table) {
    if (!Schema::hasColumn('Productos', 'grupo_id')) {
        $table->foreignId('grupo_id')->nullable()->after('cat')->constrained('grupos')->onDelete('set null');
    }
});
```

### 2) Modelo de Producto

Archivo:
- [app/Models/Productos.php](../app/Models/Productos.php)

Función:

- representa un producto
- define la relación con el grupo

Código clave:

```php
public function grupo()
{
    return $this->belongsTo(Grupos::class, 'grupo_id');
}
```

Esto significa: “un producto pertenece a un grupo”.

---

### 3) Modelo de Grupo

Archivo:
- [app/Models/Grupos.php](../app/Models/Grupos.php)

Función:

- representa un grupo
- define la relación inversa

Código clave:

```php
public function productos()
{
    return $this->hasMany(Productos::class, 'grupo_id');
}
```

Esto significa: “un grupo puede tener muchos productos”.

El sentido de la relación es inverso:

- desde producto se dice “pertenece a un grupo”
- desde grupo se dice “tiene muchos productos”

---

### 4) Controlador

Archivo:
- [app/Http/Controllers/CategoriasController.php](../app/Http/Controllers/CategoriasController.php)

Función:

- preparar los datos que la vista va a mostrar
- traer los productos con su grupo relacionado

Código clave:

```php
'productos' => Productos::with('grupo')->latest()->get(),
'grupos' => Grupos::orderBy('grupo')->get(),
```

### ¿Qué hace `with('grupo')`?

`with('grupo')` hace una carga eager loading.

Es decir, en lugar de consultar cada producto por separado, Laravel trae juntos los datos del grupo relacionado.

Esto mejora rendimiento y permite que la vista reciba este objeto:

```json
{
  "id": 1,
  "nombre": "Coca Cola",
  "grupo": {
    "id": 2,
    "grupo": "Bebidas"
  }
}
```

Eso es exactamente lo que la vista necesita para mostrar el nombre del grupo.

---

### 5) Vista del listado

Archivo:
- [resources/js/pages/Categorias/Index.tsx](../resources/js/pages/Categorias/Index.tsx)

Función:

- renderizar la lista de productos en React / Inertia
- mostrar la columna de categoría

La parte más importante es esta:

```tsx
<td className="p-4 font-medium text-gray-900">
    {producto.grupo?.grupo ?? producto.cat ?? 'Sin grupo'}
</td>
```

### Explicación:

- `producto.grupo?.grupo` intenta leer el nombre del grupo si existe
- `??` significa “si el valor anterior es nulo o indefinido, usa el siguiente”
- `producto.cat` sirve como respaldo para compatibilidad con datos antiguos
- `'Sin grupo'` es un texto por defecto si no existe relación

Es decir, lo que se muestra en pantalla es el nombre real del grupo siempre que exista.

---

### 6) Selector para crear productos con grupo

La vista también incluye un formulario con un `select` para elegir el grupo al crear un producto.

Código clave:

```tsx
<select
    value={data.grupo_id}
    onChange={(e) => setData('grupo_id', e.target.value)}
>
    <option value="">Selecciona un grupo</option>
    {grupos.map((grupo) => (
        <option key={grupo.id} value={grupo.id}>
            {grupo.grupo}
        </option>
    ))}
</select>
```

### Explicación:

- `grupos` viene desde el controlador
- cada opción muestra el nombre del grupo
- el valor de cada opción es el id del grupo
- cuando el usuario selecciona uno, se guarda en `grupo_id`

Eso es importante porque luego Laravel guarda en la base de datos la relación correcta.

---

## ¿Cómo se guarda un producto con su grupo?

El flujo completo es este:

1. El usuario abre la pantalla de productos
2. El backend envía los grupos y los productos
3. La vista renderiza un select con los nombres de los grupos
4. El usuario elige uno
5. El formulario envía un dato como `grupo_id = 5`
6. Laravel valida que `grupo_id` exista en la tabla `grupos`
7. Se crea el producto con esa relación
8. Cuando se vuelve a cargar la lista, Laravel trae el grupo junto con el producto
9. La vista muestra `producto.grupo.grupo`

---

## Ejemplo real del flujo

### Crear un grupo

```php
Grupos::create([
    'grupo' => 'Bebidas',
    'descripcion' => 'Productos líquidos y gaseosos',
]);
```

Esto guarda algo como:

```text
id = 1
grupo = 'Bebidas'
```

### Crear un producto con ese grupo

```php
Productos::create([
    'grupo_id' => 1,
    'nombre' => 'Coca Cola',
    'descripcion' => 'Gaseosa de 600ml',
    'precio' => 25.5,
    'marca' => 'Coca-Cola',
    'completed' => true,
]);
```

### Consultar el grupo desde el producto

```php
$producto = Productos::with('grupo')->first();

echo $producto->grupo->grupo; // Bebidas
```

Eso es lo que la vista usa para mostrar categoría.

---

## ¿Por qué era importante arreglarlo?

Porque la tabla `grupos` era una fuente de verdad y los productos debían depender de ella, no de un texto manual.

Con esta solución:

- no se repite el nombre del grupo en cada producto
- se evita inconsistencia si el nombre del grupo cambia
- la base de datos garantiza que el producto siempre apunta a un grupo válido
- la UI puede mostrar la información de forma segura y ordenada

---

## Validación

Se creó la prueba:

- [tests/Feature/ProductosRelacionTest.php](../tests/Feature/ProductosRelacionTest.php)

La prueba valida que:

- se crea un producto con su grupo
- el producto queda asociado al grupo correcto
- al consultar `/categorias`, la respuesta incluye el objeto `grupo`
- el nombre del grupo aparece en la vista

Se ejecutó:

```bash
php artisan test tests/Feature/ProductosRelacionTest.php
```

Resultado:

- 1 prueba ejecutada
- 1 prueba pasada
- 15 aserciones correctas

---

## Resumen final

La relación se resolvió de esta manera:

- se agregó `grupo_id` a `Productos`
- se definió la relación `belongsTo` en el modelo `Productos`
- se definió la relación `hasMany` en el modelo `Grupos`
- se cargan los datos con `with('grupo')` en el controlador
- se muestra `producto.grupo.grupo` en la vista
- se permite elegir el grupo desde el formulario

Todo eso hace que el listado de productos muestre exactamente lo que está guardado en la tabla `grupos`, y no un valor vacío o un texto aislado.

La solución correcta fue:

- guardar `grupo_id` en `Productos`
- declarar la relación de Eloquent
- cargar la relación en el controlador
- renderizar el nombre del grupo en la vista
- permitir seleccionar el grupo desde el formulario

Con esto, el listado ya no depende del texto manual de `cat`, sino de la relación real con la tabla `grupos`.
