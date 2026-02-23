import { normalizeRoleValue, roleBadgeTheme, roleLabel } from "../utils/roles"

function CrownIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M3 18h18l-1.4-9.2-4.1 3.6-3.5-5.1-3.5 5.1-4.1-3.6L3 18z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path d="M3 20h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

function ShieldIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 3l7 3v5.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function UserIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5.5 19c1.4-2.7 3.8-4 6.5-4s5.1 1.3 6.5 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    )
}

function RoleBadge({ role, className = "" }) {
    const normalized = normalizeRoleValue(role)
    const theme = roleBadgeTheme(normalized)
    const label = roleLabel(normalized)

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${theme.text} ${theme.bg} ${theme.border} ${className}`}
        >
            {normalized === "owner" ? (
                <CrownIcon className="h-3.5 w-3.5" />
            ) : normalized === "admin" || normalized === "auditor" ? (
                <ShieldIcon className="h-3.5 w-3.5" />
            ) : (
                <UserIcon className="h-3.5 w-3.5" />
            )}
            {label}
        </span>
    )
}

export default RoleBadge
