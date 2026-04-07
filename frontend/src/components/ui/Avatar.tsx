// src/components/ui/Avatar.tsx

export type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
    /** Full name used to derive initials and background color */
    name: string;
    /** Avatar size: sm=28px, md=36px, lg=48px */
    size?: AvatarSize;
    /** Optional image URL. If provided, renders an <img> instead of initials */
    src?: string;
    /** Optional extra classes */
    className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
};

/** Derives two-letter initials from a full name */
const getInitials = (name: string) =>
    name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

/** Deterministic HSL background color derived from the name string */
const getAvatarColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 55%, 55%)`;
};

export const Avatar = ({ name, size = 'md', src, className = '' }: AvatarProps) => {
    const sizeClass = sizeClasses[size];

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`flex-shrink-0 rounded-full object-cover ${sizeClass} ${className}`}
            />
        );
    }

    return (
        <div
            className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass} ${className}`}
            style={{ backgroundColor: getAvatarColor(name) }}
            aria-label={name}
        >
            {getInitials(name)}
        </div>
    );
};
