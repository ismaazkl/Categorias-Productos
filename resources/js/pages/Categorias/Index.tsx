import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

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

interface ProductoForm {
    grupo_id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    marca: string;
    completed: boolean;
}

export default function Index({
    productos,
    grupos,
}: {
    productos: Producto[];
    grupos: Grupo[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<ProductoForm>({
            grupo_id: '',
            nombre: '',
            descripcion: '',
            precio: '',
            marca: '',
            completed: false,
        });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<ProductoForm>({
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

    const handleEditProduct = (producto: Producto) => {
        setEditingProduct(producto);
        setEditData({
            grupo_id: producto.grupo?.id?.toString() ?? '',
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio?.toString() ?? '',
            marca: producto.marca || '',
            completed: !!producto.completed,
        });
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingProduct) {
            return;
        }

        put(`/categorias/${editingProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                resetEdit();
                setEditingProduct(null);
            },
        });
    };

    const handleDeleteProduct = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(`/categorias/${id}`);
        }
    };

    const renderProductForm = (pending: 'create' | 'edit') => {
        const formData = pending === 'create' ? data : editData;
        const setFormData = pending === 'create' ? setData : setEditData;
        const formErrors = pending === 'create' ? errors : editErrors;
        const isProcessing = pending === 'create' ? processing : editProcessing;

        return {
            formData,
            setFormData,
            formErrors,
            isProcessing,
        };
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
                <a
                    href="/categorias/reporte-pdf"
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                    Generar PDF Productos
                </a>

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
                                <th className="p-4 text-right">Acciones</th>
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
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            producto,
                                                        )
                                                    }
                                                    className="rounded bg-amber-500 px-3 py-1 text-sm text-white transition hover:bg-amber-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            producto.id,
                                                        )
                                                    }
                                                    className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
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

            {isModalOpen &&
                (() => {
                    const { formData, setFormData, formErrors, isProcessing } =
                        renderProductForm('create');

                    return (
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
                                            value={formData.grupo_id}
                                            onChange={(e) =>
                                                setFormData(
                                                    'grupo_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                        >
                                            <option value="">
                                                Selecciona un grupo
                                            </option>
                                            {grupos.map((grupo) => (
                                                <option
                                                    key={grupo.id}
                                                    value={grupo.id}
                                                >
                                                    {grupo.grupo}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.grupo_id && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.grupo_id}
                                            </span>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) =>
                                                setFormData(
                                                    'nombre',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                            required
                                        />
                                        {formErrors.nombre && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.nombre}
                                            </span>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.descripcion}
                                            onChange={(e) =>
                                                setFormData(
                                                    'descripcion',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                        />
                                        {formErrors.descripcion && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.descripcion}
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
                                            value={formData.precio}
                                            onChange={(e) =>
                                                setFormData(
                                                    'precio',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                        />
                                        {formErrors.precio && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.precio}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Marca
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.marca}
                                            onChange={(e) =>
                                                setFormData(
                                                    'marca',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                        />
                                        {formErrors.marca && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.marca}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 md:col-span-2">
                                        <input
                                            id="completed"
                                            type="checkbox"
                                            checked={!!formData.completed}
                                            onChange={(e) =>
                                                setFormData(
                                                    'completed',
                                                    e.target.checked,
                                                )
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
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isProcessing
                                                ? 'Guardando...'
                                                : 'Guardar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    );
                })()}

            {editingProduct &&
                (() => {
                    const { formData, setFormData, formErrors, isProcessing } =
                        renderProductForm('edit');

                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Editar producto #{editingProduct.id}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProduct(null);
                                            resetEdit();
                                        }}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleUpdateProduct}
                                    className="grid gap-4 md:grid-cols-2"
                                >
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Grupo
                                        </label>
                                        <select
                                            value={formData.grupo_id}
                                            onChange={(e) =>
                                                setFormData(
                                                    'grupo_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-amber-500"
                                        >
                                            <option value="">
                                                Selecciona un grupo
                                            </option>
                                            {grupos.map((grupo) => (
                                                <option
                                                    key={grupo.id}
                                                    value={grupo.id}
                                                >
                                                    {grupo.grupo}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.grupo_id && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.grupo_id}
                                            </span>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) =>
                                                setFormData(
                                                    'nombre',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-amber-500"
                                            required
                                        />
                                        {formErrors.nombre && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.nombre}
                                            </span>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.descripcion}
                                            onChange={(e) =>
                                                setFormData(
                                                    'descripcion',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-amber-500"
                                        />
                                        {formErrors.descripcion && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.descripcion}
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
                                            value={formData.precio}
                                            onChange={(e) =>
                                                setFormData(
                                                    'precio',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-amber-500"
                                        />
                                        {formErrors.precio && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.precio}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Marca
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.marca}
                                            onChange={(e) =>
                                                setFormData(
                                                    'marca',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-amber-500"
                                        />
                                        {formErrors.marca && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {formErrors.marca}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 md:col-span-2">
                                        <input
                                            id="edit-completed"
                                            type="checkbox"
                                            checked={!!formData.completed}
                                            onChange={(e) =>
                                                setFormData(
                                                    'completed',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <label
                                            htmlFor="edit-completed"
                                            className="text-sm text-gray-700"
                                        >
                                            Producto completado
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingProduct(null);
                                                resetEdit();
                                            }}
                                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isProcessing
                                                ? 'Guardando...'
                                                : 'Actualizar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    );
                })()}
        </AppLayout>
    );
}
