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
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-red-300',
    success: 'bg-green-600 hover:bg-green-700 disabled:bg-green-300',
    warning: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300',
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            {/* Stop propagation so clicking inside doesn't close the modal */}
            <div
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="confirm-modal-title" className="text-base font-semibold text-gray-900">
                    {title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">{description}</p>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed ${confirmBtnClasses[variant]}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
