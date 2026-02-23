const ROLE_VALUE_BY_LABEL = {
    Usuario: "user",
    Administrador: "admin",
    Owner: "owner",
    Auditor: "auditor",
}

const ROLE_LABEL_BY_VALUE = {
    user: "Usuario",
    admin: "Administrador",
    owner: "Owner",
    auditor: "Auditor",
}

export function normalizeRoleValue(roleLike, typeLike) {
    const raw = typeof roleLike === "string" ? roleLike.trim() : ""
    const lower = raw.toLowerCase()

    if (ROLE_LABEL_BY_VALUE[lower]) {
        return lower
    }

    if (ROLE_VALUE_BY_LABEL[raw]) {
        return ROLE_VALUE_BY_LABEL[raw]
    }

    const labelEntry = Object.keys(ROLE_VALUE_BY_LABEL).find(function (key) {
        return key.toLowerCase() === lower
    })
    if (labelEntry) {
        return ROLE_VALUE_BY_LABEL[labelEntry]
    }

    const numericType = Number(typeLike)
    if (numericType === 1) return "user"
    if (numericType === 2) return "admin"
    if (numericType === 3) return "owner"
    if (numericType === 4) return "auditor"

    return "user"
}

export function roleLabel(roleValue) {
    return ROLE_LABEL_BY_VALUE[normalizeRoleValue(roleValue)] || "Usuario"
}

export function roleType(roleValue) {
    const role = normalizeRoleValue(roleValue)
    if (role === "admin") return 2
    if (role === "owner") return 3
    if (role === "auditor") return 4
    return 1
}

export function isAdminPanelRole(roleValue) {
    const role = normalizeRoleValue(roleValue)
    return role === "admin" || role === "owner" || role === "auditor"
}

export function canManageUsers(actorRoleValue) {
    const role = normalizeRoleValue(actorRoleValue)
    return role === "owner" || role === "admin"
}

export function canCreateRole(actorRoleValue, newRoleValue) {
    const actor = normalizeRoleValue(actorRoleValue)
    const target = normalizeRoleValue(newRoleValue)

    if (actor === "owner") return true
    if (actor === "admin") return target === "user"
    return false
}

export function canEditTarget(actorRoleValue, targetRoleValue) {
    const actor = normalizeRoleValue(actorRoleValue)
    const target = normalizeRoleValue(targetRoleValue)

    if (actor === "owner") return true
    if (actor === "admin") return target === "user"
    return false
}

export function canDeleteTarget(actorRoleValue, targetRoleValue, isSelf = false) {
    if (isSelf) return false
    return canEditTarget(actorRoleValue, targetRoleValue)
}

export function roleBadgeTheme(roleValue) {
    const role = normalizeRoleValue(roleValue)

    if (role === "owner") {
        return {
            text: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
        }
    }

    if (role === "admin") {
        return {
            text: "text-violet-700",
            bg: "bg-violet-50",
            border: "border-violet-200",
        }
    }

    if (role === "auditor") {
        return {
            text: "text-cyan-700",
            bg: "bg-cyan-50",
            border: "border-cyan-200",
        }
    }

    return {
        text: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
    }
}
