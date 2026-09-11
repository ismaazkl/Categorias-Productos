import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Grupo {
    id: number;
    grupo: string;
    descripcion?: string;
}

interface Producto {
    id: number;
    cat?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    marca: string;
    completed: boolean;
    grupo?: {
        id: number;
        grupo: string;
        descripcion?: string;
    };
}

export default function Index({
    productos,
    grupos,
    categorias = [],
}: {
    productos: Producto[];
    grupos: Grupo[];
    categorias?: { id: number; nombre: string; descripcion?: string }[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        grupo_id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        marca: '',
        completed: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/categorias', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    // --- Categorias management (integrated) ---
    interface Categoria {
        id: number;
        nombre: string;
        descripcion?: string;
    }

    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
        null,
    );

    const {
        data: catData,
        setData: setCatData,
        put: putCat,
        processing: catProcessing,
        errors: catErrors,
        reset: resetCat,
    } = useForm({
        nombre: '',
        descripcion: '',
    });



    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategoria) return;
        putCat(`/categorias/${editingCategoria.id}`, {
            onSuccess: () => {
                resetCat();
                setEditingCategoria(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/categorias/${id}`);
        }
    };
    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setCatData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || '',
        });
    };

    return (
        <AppLayout>
            <Head title="Productos" />

            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Listado de Productos
                    </h1>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Añadir producto
                    </button>
                </div>

                <div className="mb-4 flex justify-end">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        Total: {productos.length}
                    </span>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
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
                                    <tr
                                        key={producto.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="p-4 font-mono text-gray-500">
                                            #{producto.id}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {producto.grupo?.grupo ??
                                                producto.cat ??
                                                'Sin grupo'}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {producto.nombre}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {producto.descripcion ||
                                                'Sin descripción'}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {producto.precio || 'Sin precio'}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {producto.marca || ''}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    producto.completed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {producto.completed
                                                    ? 'Completado'
                                                    : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-10">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Listado de Categorías
                    </h1>
                </div>

                <div className="mb-4 flex justify-end">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        Total: {categorias.length}
                    </span>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                                <th className="p-4">ID</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {categorias.length > 0 ? (
                                categorias.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-500">#{cat.id}</td>
                                        <td className="p-4 font-medium text-gray-900">{cat.nombre}</td>
                                        <td className="p-4 text-gray-700">{cat.descripcion || 'Sin descripción'}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Nuevo producto
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Grupo
                                </label>
                                <select
                                    value={data.grupo_id}
                                    onChange={(e) =>
                                        setData('grupo_id', e.target.value)
                                    }
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                >
                                    <option value="">
                                        Selecciona un grupo
                                    </option>
                                    {grupos.map((grupo) => (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.grupo}
                                        </option>
                                    ))}
                                </select>
                                {errors.grupo_id && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors.grupo_id}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.nombre && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors.nombre}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData('descripcion', e.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                />
                                {errors.descripcion && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors.descripcion}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.precio}
                                    onChange={(e) =>
                                        setData('precio', e.target.value)
                                    }
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                />
                                {errors.precio && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors.precio}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Marca
                                </label>
                                <input
                                    type="text"
                                    value={data.marca}
                                    onChange={(e) =>
                                        setData('marca', e.target.value)
                                    }
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                />
                                {errors.marca && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {errors.marca}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 md:col-span-2">
                                <input
                                    id="completed"
                                    type="checkbox"
                                    checked={!!data.completed}
                                    onChange={(e) =>
                                        setData('completed', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="completed"
                                    className="text-sm text-gray-700"
                                >
                                    Producto completado
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Edición de Categoría */}
            {editingCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-bold">
                            Editar Categoría #{editingCategoria.id}
                        </h2>
                        <form
                            onSubmit={handleUpdate}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={catData.nombre}
                                    onChange={(e) =>
                                        setCatData('nombre', e.target.value)
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {catErrors.nombre && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {catErrors.nombre}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Descripción
                                </label>
                                <textarea
                                    value={catData.descripcion}
                                    onChange={(e) =>
                                        setCatData(
                                            'descripcion',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />
                                {catErrors.descripcion && (
                                    <span className="mt-1 block text-xs text-red-500">
                                        {catErrors.descripcion}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCategoria(null);
                                        resetCat();
                                    }}
                                    className="rounded border px-4 py-2 text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={catProcessing}
                                    className="rounded bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
