import axios, {AxiosResponse} from 'axios';

// A classe ProductClient é um singleton que gerencia a comunicação com a API de produtos.
export class ProductClient {
    // Atributo estático que guarda a instância única da classe.
    private static instance: ProductClient;

    // URL base da API.
    private readonly url: string;

    // Token JWT para autenticação.
    private token: string;

    // Construtor privado para evitar a criação de múltiplas instâncias.
    private constructor() {
        this.url = 'http://localhost:3005/';
    }

    // Método estático para obter a instância única da classe.
    public static getInstance(): ProductClient {
        if (!ProductClient.instance) {
            ProductClient.instance = new ProductClient();
        }
        return ProductClient.instance;
    }

    // Método para autenticar o usuário e obter o token JWT.
    public async authenticationProcess(email: string, password: string): Promise<void> {
        try {
            // Envia uma requisição GET para o endpoint de login com email e password como parâmetros.
            const response: AxiosResponse<{ token: string }> = await axios.get(`${this.url}auth/login`, {
                params: { email, password }
            });
            console.log('Authentication response:', response.data);

            // Armazena o token JWT retornado pela API.
            this.token = response.data.token;
        } catch (error) {
            // Registra o erro se a autenticação falhar.
            this.logError('Authentication process failed', error);
            throw error;
        }
    }

    // Método para recuperar a lista de produtos da API.
    public async products(): Promise<AxiosResponse<any>> {
        try {
            // Envia uma requisição GET para o endpoint de produtos com o token JWT no cabeçalho.
            return await axios.get(`${this.url}products`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
        } catch (error) {
            // Registra o erro se a recuperação dos produtos falhar.
            this.logError('Failed to retrieve products', error);
            throw error;
        }
    }

    // Método para inserir múltiplos produtos na API.
    public async insertProducts(products: any[]): Promise<any[]> {
        const responses: any[] = [];

        // Percorre a lista de produtos fornecida.
        for (const product of products) {
            try {
                // Envia uma requisição POST para o endpoint de produtos para cada produto.
                const response: AxiosResponse = await axios.post(
                    `${this.url}products`,
                    product,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    }
                );
                console.log('Product inserted:', product.name);

                // Adiciona a resposta da API à lista de respostas.
                responses.push(response.data);
            } catch (error) {
                // Registra o erro se a inserção do produto falhar e adiciona uma mensagem de erro à lista de respostas.
                this.logError(`Failed to insert product: ${product.name}`, error);
                responses.push({error: `Failed to insert product: ${product.name}`, details: error.message});
            }
        }

        // Retorna a lista de respostas.
        return responses;
    }

    // Método para registrar erros no console.
    private logError(message: string, error: any): void {
        console.error(message, error);
    }
}
