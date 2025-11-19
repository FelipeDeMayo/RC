const API_BASE_URL = 'http://localhost:3000/api/sales'; 
export async function fetchSalesHistory(userToken: string): Promise<any[]> { // <--- CORREÇÃO AQUI
    if (!userToken) {
        throw new Error("User not authenticated. Please log in.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`, 
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch sales history.');
        }

        return data;
    } catch (error: any) { // Type assertion for catch block
        console.error("Error fetching sales history:", error.message);
        throw error;
    }
}