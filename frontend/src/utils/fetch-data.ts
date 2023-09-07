const fetchData = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const body = await response.json();
        const message = body.error;
        throw Error("Failed with status " + response.status + ": " + message);
    }
};

export { fetchData };
