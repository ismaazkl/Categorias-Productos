import AppLayout from '@/layouts/app-layout';

interface Producto {
    id: number;
    cat: string;
    nombre: string;
    descripcion: string;
    precio: number;
    marca: string;
    completed: boolean;
}

export default function Index({ productos }: { productos: Producto[] }) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Listado de Productos</h1>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        Total: {productos.length}
                    </span>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                                <th className="p-4">ID</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Nombre del producto</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Marca</th>
                                <th className="p-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {productos.length > 0 ? (
                                productos.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-500">#{producto.id}</td>
                                        <td className="p-4 font-medium text-gray-900">{producto.cat}</td>
                                        <td className="p-4 font-medium text-gray-900">{producto.nombre}</td>
                                        <td className="p-4 text-gray-500">{producto.descripcion || 'Sin descripción'}</td>
                                        <td className="p-4 text-gray-600">{producto.precio || 'Sin precio'}</td>
                                        <td className="p-4 text-gray-700">{producto.marca || ''}</td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    producto.completed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {producto.completed ? 'Completado' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-gray-500">
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
