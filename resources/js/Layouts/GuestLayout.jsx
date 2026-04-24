import { Link } from '@inertiajs/react';
import { Zap } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6">
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-violet-600">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">AI Page Generator</span>
                </Link>
            </div>

            <div className="w-full max-w-md rounded-sm border border-slate-800 bg-slate-900 px-6 py-8 shadow-xl">
                {children}
            </div>
        </div>
    );
}
