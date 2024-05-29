import axios, { AxiosResponse } from 'axios';

export class ProductClient {
    private static instance: ProductClient;
    private readonly url: string;
    private token: string;

    private constructor() {
        this.url = 'http://localhost:3005/';
    }

    public static getInstance(): ProductClient {
        if (!ProductClient.instance) {
            ProductClient.instance = new ProductClient();
        }
        return ProductClient.instance;
    }

    public async authenticationProcess(email: string, password: string): Promise<void> {
        try {
            const response: AxiosResponse<{ token: string }> = await axios.get(`${this.url}auth/login`, {
                params: { email, password }
            });
            this.token = response.data.token;
        } catch (error) {
            this.logError('Authentication process failed', error);
            throw error;
        }
    }

    public async products(): Promise<AxiosResponse<any>> {
        try {
            return await axios.get(`${this.url}products`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
        } catch (error) {
            this.logError('Failed to retrieve products', error);
            throw error;
        }
    }

    public async insertProducts(products: any[]): Promise<any[]> {
        const responses: any[] = [];

        for (const product of products) {
            try {
                const response: AxiosResponse = await axios.post(
                    `${this.url}products`,
                    product,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    }
                );
                responses.push(response.data);
            } catch (error) {
                this.logError(`Failed to insert product: ${product.name}`, error);
                responses.push({ error: `Failed to insert product: ${product.name}`, details: error.message });
            }
        }

        return responses;
    }

    private logError(message: string, error: any): void {
        console.error(message, error);
    }
}
