import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { ProductClient } from './client/ProductClient';

@Controller('api')
export class AppController {
    private productClient: ProductClient;

    constructor() {
        this.productClient = ProductClient.getInstance();
    }

    @Post('products')
    public async insertProducts(@Body() body: { user: string; password: string; products: any[] }): Promise<any> {
        try {
            const { user, password, products } = body;

            // Autenticar o usuário
            await this.productClient.authenticationProcess(user, password);

            // Inserir os produtos
            const insertResponse = await this.productClient.insertProducts(products);

            // Recuperar a lista de produtos
            const productsData = await this.productClient.products();

            return productsData.data;
        } catch (error) {
            console.log('Error inserting products:', error);
            throw new InternalServerErrorException('Erro ao inserir produtos.');
        }
    }
}
