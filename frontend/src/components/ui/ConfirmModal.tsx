// src/components/ui/ConfirmModal.tsx
import type { ReactNode } from 'react';

export type ConfirmVariant = 'danger' | 'success' | 'warning';

interface ConfirmModalProps {
    /** Controls visibility — the parent owns the open state */
    open: boolean;
    /** Modal heading */
    title: string;
    /** Body text, accepts JSX to allow bold, links, etc. */
    description: ReactNode;
    /** Label for the confirm action button */
    confirmLabel: string;
    /** Label for the cancel button (default: "Cancel") */
    cancelLabel?: string;
    /** Visual style of the confirm button */
    variant?: ConfirmVariant;
    /** Called when the user confirms */
    onConfirm: () => void;
    /** Called when the user cancels or clicks the backdrop */
    onCancel: () => void;
    /** Disables both buttons while an async operation is in progress */
    isLoading?: boolean;
}

const confirmBtnClasses: Record<ConfirmVariant, string> = {
    danger:  'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer',
    success: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed cursor-pointer',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed cursor-pointer',
};

export const ConfirmModal = ({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmModalProps) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            {/* Stop propagation so clicking inside doesn't close the modal */}
            <div
                className="w-full max-w-sm glass-card border-slate-200 dark:border-slate-800 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="confirm-modal-title" className="text-lg font-display font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${confirmBtnClasses[variant]}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                {confirmLabel}
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
