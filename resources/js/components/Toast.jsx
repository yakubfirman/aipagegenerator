import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ── Context ─────────────────────────────────────────────── */
const ToastContext = createContext(null);

const ICONS = {
    success: { icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500' },
    error:   { icon: XCircle,      color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/10',     bar: 'bg-red-500'     },
    warning: { icon: AlertTriangle, color: 'text-amber-400',  border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   bar: 'bg-amber-500'   },
    info:    { icon: Info,          color: 'text-sky-400',    border: 'border-sky-500/30',     bg: 'bg-sky-500/10',     bar: 'bg-sky-500'     },
};

let idCounter = 0;

/* ── Provider ────────────────────────────────────────────── */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
    }, []);

    const toast = useCallback((message, type = 'success', duration = 4000) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
        if (duration > 0) setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            {/* Portal */}
            <div
                aria-live="polite"
                className="pointer-events-none fixed right-4 top-20 z-[9999] flex flex-col gap-2 sm:right-6"
                style={{ maxWidth: 'min(380px, calc(100vw - 2rem))' }}
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast: t, onDismiss }) {
    const cfg = ICONS[t.type] ?? ICONS.info;
    const Icon = cfg.icon;
    const [progress, setProgress] = useState(100);
    const startRef = useRef(Date.now());
    const DURATION = 4000;

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startRef.current;
            setProgress(Math.max(0, 100 - (elapsed / DURATION) * 100));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`pointer-events-auto relative overflow-hidden rounded-sm border ${cfg.border} ${cfg.bg} shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 ${
                t.leaving
                    ? 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
            }`}
        >
            <div className="flex items-start gap-3 px-4 py-3 pr-9">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.color}`} />
                <p className="text-sm text-slate-200 leading-relaxed">{t.message}</p>
            </div>
            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 ${cfg.bar} transition-all ease-linear`}
                style={{ width: `${progress}%`, transitionDuration: '50ms' }}
            />
            {/* Dismiss */}
            <button
                onClick={() => onDismiss(t.id)}
                className="absolute right-2 top-2.5 rounded-sm p-0.5 text-slate-500 transition hover:bg-slate-700/50 hover:text-slate-300"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

/* ── Hook ────────────────────────────────────────────────── */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}

/* ── Flash bridge — auto-shows Inertia flash messages ─────── */
export function FlashToastBridge() {
    const { toast } = useToast();
    const { props } = usePage();
    const shownRef = useRef(new Set());

    useEffect(() => {
        const { flash } = props;
        if (!flash) return;
        if (flash.success) {
            const key = `s:${flash.success}`;
            if (!shownRef.current.has(key)) { shownRef.current.add(key); toast(flash.success, 'success'); }
        }
        if (flash.error) {
            const key = `e:${flash.error}`;
            if (!shownRef.current.has(key)) { shownRef.current.add(key); toast(flash.error, 'error', 6000); }
        }
        if (flash.warning) {
            const key = `w:${flash.warning}`;
            if (!shownRef.current.has(key)) { shownRef.current.add(key); toast(flash.warning, 'warning', 5000); }
        }
    }, [props.flash]);

    return null;
}
