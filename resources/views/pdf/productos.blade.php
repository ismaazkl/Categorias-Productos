<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Productos</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            color: #047857;
            font-size: 18px;
        }

        .stats {
            margin-bottom: 15px;
            background: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #d1d5db;
            padding: 7px 10px;
            text-align: left;
        }

        th {
            background-color: #059669;
            color: white;
            font-weight: bold;
        }

        .badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Catálogo General de Productos</h1>
        <p>Generado el: {{ date('d/m/Y H:i') }}</p>
    </div>
    <div class="stats">
        <strong>Total Registros:</strong> {{ $totalProducto }} |
        <strong>Precio Promedio:</strong> ${{ number_format($precioPromedio, 2) }} |
        <strong>Precio Total:</strong> ${{ number_format($precioTotal, 2) }}   
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 40%;">Producto</th>
                <th style="width: 30%;">Categoría</th>
                <th style="width: 20%; text-align: right;">Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach($productos as $producto)
                <tr>
                    <td>{{ $producto->id }}</td>
                    <td><strong>{{ $producto->nombre }}</strong></td>
                    <td>
                        <span class="badge">
                            {{ $producto->grupo->grupo ?? $producto->cat ?? 'Sin Categoría' }}
                        </span>
                    </td>
                    <td style="text-align: right;">${{ number_format($producto->precio, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>