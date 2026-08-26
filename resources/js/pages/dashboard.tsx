import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as categoriasIndex } from '@/routes/categorias';
import { index as gruposIndex } from '@/routes/grupos';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                                Módulo
                            </span>
                            <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Categorias
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Gestiona tus categorías y revisa el listado completo.
                        </p>
                        <Link
                            href={categoriasIndex()}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Ver categorías
                        
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                                Módulo
                            </span>
                            <FolderOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Grupos
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Gestiona tus grupos y revisa el listado completo.
                        </p>
                        <Link
                            href={gruposIndex()}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
                        >
                            Ver grupos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
