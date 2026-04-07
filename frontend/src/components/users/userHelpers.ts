// src/components/users/userHelpers.ts

/** Derives two-letter initials from a full name */
export const getInitials = (name: string) =>
    name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

/** Deterministic HSL background color derived from a string */
export const getAvatarColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 55%, 55%)`;
};

/** Short display ID: "#NP-XXXX" */
export const shortId = (id: string) => `#NP-${id.substring(0, 4).toUpperCase()}`;
