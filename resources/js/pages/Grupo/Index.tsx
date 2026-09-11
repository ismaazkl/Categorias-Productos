import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Grupo {
    id: number;
    grupo: string;
    descripcion: string;
}

export default function Index({ grupos }: { grupos: Grupo[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        grupo: '',
        descripcion: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/grupos', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const handleEdit = (grupo: Grupo) => {
        setEditingGrupo(grupo);
        setData({
            grupo: grupo.grupo,
            descripcion: grupo.descripcion || '',
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGrupo) return;
        put(`/grupos/${editingGrupo.id}`, {
            onSuccess: () => {
                reset();
                setEditingGrupo(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
            router.delete(`/grupos/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Grupos" />

            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">Listado de Grupos</h1>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Añadir nuevo
                    </button>
                </div>

                <div className="mb-4 flex justify-end">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        Total: {grupos.length}
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
                            {grupos.length > 0 ? (
                                grupos.map((grupo) => (
                                    <tr key={grupo.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-500">#{grupo.id}</td>
                                        <td className="p-4 font-medium text-gray-900">{grupo.grupo}</td>
                                        <td className="p-4 text-gray-700">{grupo.descripcion || 'Sin descripción'}</td>
                                        <td className="p-4 text-right gap-2 flex justify-end">
                                            <button
                                                onClick={() => handleEdit(grupo)}
                                                className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(grupo.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center text-gray-500">
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Nuevo Grupo</h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={data.grupo}
                                    onChange={(e) => setData('grupo', e.target.value)}
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                    required
                                />
                                {errors.grupo && <span className="mt-1 block text-xs text-red-500">{errors.grupo}</span>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={4}
                                    className="w-full rounded border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                                />
                                {errors.descripcion && (
                                    <span className="mt-1 block text-xs text-red-500">{errors.descripcion}</span>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
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

            
            {editingGrupo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Editar Grupo #{editingGrupo.id}</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={data.grupo}
                                    onChange={(e) => setData('grupo', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {errors.grupo && (
                                    <span className="mt-1 block text-xs text-red-500">{errors.grupo}</span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />
                                {errors.descripcion && (
                                    <span className="mt-1 block text-xs text-red-500">{errors.descripcion}</span>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingGrupo(null);
                                        reset();
                                    }}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
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
