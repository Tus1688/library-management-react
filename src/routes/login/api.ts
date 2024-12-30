export async function ReqLogin(data: {username: string, password: string}) {
    const makeRequest = async() => {
        return await fetch("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    try {
        const response = await makeRequest();

        if (!response.ok) {
            return Promise.reject(await response.json());
        }

        return true;
    } catch(error) {
        return Promise.reject(error);
    }
}