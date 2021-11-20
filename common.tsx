function apiFetch(path: string, options: RequestInit) {
    options.credentials = 'include'
    return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${path}`, options)
}

export const apiGet = function(path: string) {
    return apiFetch(path, { method: 'GET' })
}

export const apiPost = function(path: string, body?: any) {
    return apiFetch(path, {
        method: 'POST',
        body: body ? JSON.stringify(body) : null,
        headers: { 'Content-Type': 'application/json' }
    })
}

export const apiPut = function(path: string, body?: any) {
    return apiFetch(path, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : null,
        headers: { 'Content-Type': 'application/json' }
    })
}

export const apiDelete = function(path: string) {
    return apiFetch(path, { method: 'DELETE' })
}
