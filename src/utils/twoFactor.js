const TWO_FACTOR_PENDING_KEY = "TWO_FACTOR_PENDING"

export function saveTwoFactorPending(data) {
    const payload = {
        ...data,
        created_at: Date.now(),
    }
    localStorage.setItem(TWO_FACTOR_PENDING_KEY, JSON.stringify(payload))
}

export function getTwoFactorPending() {
    try {
        const raw = localStorage.getItem(TWO_FACTOR_PENDING_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== "object") return null
        if (!parsed.tmp_token || typeof parsed.tmp_token !== "string") return null
        return parsed
    } catch {
        return null
    }
}

export function clearTwoFactorPending() {
    localStorage.removeItem(TWO_FACTOR_PENDING_KEY)
}
