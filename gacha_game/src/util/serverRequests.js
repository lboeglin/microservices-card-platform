const HOST = import.meta.env.PUBLIC_PROXY_HOST

export const login = async (credentials) => {
	return await authenticationPost(HOST + '/user/login', credentials)
}

export const register = async (credentials) => {
	return await authenticationPost(HOST + '/user/register', credentials)
}

// Common POST request for the login and register paths.
const authenticationPost = async (path, credentials) => {
	const response = await fetch(path, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify(credentials)
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}

export const getUser = async (token) => {
	const response = await fetch(HOST + '/user/', {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}

export const getInventory = async (token) => {
	const response = await fetch(HOST + '/user/collection', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}

export const claimBooster = async (token) => {
	const response = await fetch(HOST + '/user/booster', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}

// do the gacha roll
export const openBooster = async (token) => {
	const response = await fetch(HOST + '/user/booster/use', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}

export const buyBooster = async (token) => {
	const response = await fetch(HOST + '/user/booster/buy/4', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	})
	if (response.ok) {
		return await response.json()
	}
	return null
}