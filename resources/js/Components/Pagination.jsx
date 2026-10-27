import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0]?.url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Sebelumnya
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Sebelumnya
                    </span>
                )}
                {links[links.length - 1]?.url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ms-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Selanjutnya
                    </Link>
                ) : (
                    <span className="relative ms-3 inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Selanjutnya
                    </span>
                )}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    {links.map((link, idx) => {
                        const isFirst = idx === 0;
                        const isLast = idx === links.length - 1;
                        const roundedClass = isFirst
                            ? 'rounded-l-md'
                            : isLast
                            ? 'rounded-r-md'
                            : '';

                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`relative inline-flex items-center px-3.5 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 ${roundedClass}`}
                                />
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`relative inline-flex items-center px-3.5 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:outline-offset-0 transition-colors ${roundedClass} ${
                                    link.active
                                        ? 'z-10 bg-[#194f2b] text-white ring-[#194f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                        : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            />
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
