export async function fetchCountriesWithCurrency() {
    const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,currencies';
    try {
        const response = await fetch(REST_COUNTRIES_API);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        return data.map(country => {
            // Extracts the primary currency code
            const currencyCode = Object.keys(country.currencies || {})[0];
            return {
                name: country.name.common,
                currency: currencyCode,
            };
        }).filter(item => item.currency); 
        
    } catch (error) {
        console.error("Failed to fetch country data:", error);
        return []; 
    }
}