export const PASSWORD_MIN_LENGTH = 8
const PASSWORD_SYMBOL_REGEX = /[^A-Za-z0-9]/

export function passwordMeetsPolicy(password) {
    if (typeof password !== "string") {
        return false
    }
    return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_SYMBOL_REGEX.test(password)
}

export function passwordPolicyMessage(subject = "La contrasena") {
    return `${subject} debe tener minimo ${PASSWORD_MIN_LENGTH} caracteres y un simbolo`
}
