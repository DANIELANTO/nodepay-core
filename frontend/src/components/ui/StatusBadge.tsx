// src/components/ui/StatusBadge.tsx

export type StatusVariant = 'success' | 'danger' | 'warning' | 'neutral';

interface StatusBadgeProps {
    /** Text label to display inside the badge */
    label: string;
    /** Visual style variant */
    variant: StatusVariant;
    /** Show the dot indicator (default: true) */
    dot?: boolean;
    /** Optional extra classes for layout/spacing overrides */
    className?: string;
}

const variantClasses: Record<StatusVariant, { badge: string; dot: string }> = {
    success: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    danger:  { badge: 'bg-red-100 text-red-600',    dot: 'bg-red-500'   },
    warning: { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    neutral: { badge: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
};

export const StatusBadge = ({
    label,
    variant,
    dot = true,
    className = '',
}: StatusBadgeProps) => {
    const { badge, dot: dotColor } = variantClasses[variant];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge} ${className}`}
        >
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
            {label}
        </span>
    );
};
