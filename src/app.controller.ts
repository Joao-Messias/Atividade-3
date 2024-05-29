import {Controller, Post, Body, InternalServerErrorException, Inject} from '@nestjs/common';
import {ProductClient} from './client/ProductClient';


@Controller('api')
export class AppController {
    // Injeção da instância do ProductClient.
    constructor(@Inject(ProductClient) private readonly productClient: ProductClient) {
    }

    // Método "core" da Atividade, que consiste em autenticar o usuario, inserir produtos e retornar a lista atualizada.
    @Post('products')
    public async insertProducts(@Body() body: { user: string; password: string; products: any[] }): Promise<any> {
        try {
            // Extrai os dados da requisição.
            const {user, password, products} = body;

            // Autentica o usuário utilizando o ProductClient.
            await this.productClient.authenticationProcess(user, password);

            // Insere os produtos na API utilizando o ProductClient.
            await this.productClient.insertProducts(products);

            // Recupera a lista atualizada de produtos da API.
            const productsData = await this.productClient.products();

            // Retorna a lista de produtos como resposta.
            return productsData.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao inserir produtos.');
        }
    }
}
