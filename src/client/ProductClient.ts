import axios, { AxiosResponse } from 'axios';

export class ProductClient {
    // Instância singleton da classe ProductClient
    private static instance: ProductClient;
    // URL base da API
    private readonly url: string;
    // Token de autenticação
    private token: string;

    // Construtor privado para implementar o padrão singleton
    private constructor() {
        this.url = 'http://localhost:3005/'; // Define a URL base da API
    }

    // Método para obter a instância única da classe (singleton)
    public static getInstance(): ProductClient {
        if (!ProductClient.instance) {
            ProductClient.instance = new ProductClient(); // Cria a instância se ainda não existir
        }
        return ProductClient.instance; // Retorna a instância única
    }

    // Método para realizar o processo de autenticação
    public async authenticationProcess(email: string, password: string): Promise<void> {
        try {
            // Faz uma requisição GET para o endpoint de login
            const response: AxiosResponse<{ token: string }> = await axios.get(`${this.url}auth/login`, {
                params: { email, password } // Passa o email e a senha como parâmetros
            });
            // Armazena o token recebido na resposta
            this.token = response.data.token;
        } catch (error) {
            // Loga um erro se a autenticação falhar e lança o erro
            this.logError('Authentication process failed', error);
            throw error;
        }
    }

    // Método para obter a lista de produtos
    public async products(): Promise<AxiosResponse<any>> {
        try {
            // Faz uma requisição GET para o endpoint de produtos com o token de autenticação
            return await axios.get(`${this.url}products`, {
                headers: {
                    Authorization: `Bearer ${this.token}`, // Adiciona o token no cabeçalho da requisição
                },
            });
        } catch (error) {
            // Loga um erro se a requisição falhar e lança o erro
            this.logError('Failed to retrieve products', error);
            throw error;
        }
    }

    // Método para inserir produtos
    public async insertProducts(products: any[]): Promise<any[]> {
        const responses: any[] = [];

        // Itera sobre a lista de produtos a serem inseridos
        for (const product of products) {
            try {
                // Faz uma requisição POST para o endpoint de produtos para inserir um produto
                const response: AxiosResponse = await axios.post(
                    `${this.url}products`,
                    product,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`, // Adiciona o token no cabeçalho da requisição
                        },
                    }
                );
                // Adiciona a resposta bem-sucedida à lista de respostas
                responses.push(response.data);
            } catch (error) {
                // Loga um erro se a inserção falhar, adiciona a mensagem de erro à lista de respostas
                this.logError(`Failed to insert product: ${product.name}`, error);
                responses.push({ error: `Failed to insert product: ${product.name}`, details: error.message });
            }
        }

        return responses; // Retorna a lista de respostas
    }

    // Método para logar erros no console
    private logError(message: string, error: any): void {
        console.error(message, error); // Loga a mensagem de erro e o objeto de erro no console
    }
}
