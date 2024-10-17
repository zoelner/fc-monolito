import { jest } from '@jest/globals';
import GenerateInvoiceUseCase from './generate-invoice.usecase';
import InvoiceGateway from '../../gateway/invoice.gateway';
import { GenerateInvoiceUseCaseInputDTO } from './generate-invoice.usecase.dto';
import Address from '../../../@shared/domain/value-object/address';
import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItems from '../../domain/invoice-items.entity';
import Invoice from '../../domain/invoice.entity';

describe('GenerateInvoiceUseCase', () => {
    let invoiceRepository: jest.Mocked<InvoiceGateway>;
    let generateInvoiceUseCase: GenerateInvoiceUseCase;

    beforeEach(() => {
        invoiceRepository = {
            generate: jest.fn(),
        } as unknown as jest.Mocked<InvoiceGateway>;

        generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    });

    it('should generate an invoice successfully', async () => {
        const input: GenerateInvoiceUseCaseInputDTO = {
            name: 'John Doe',
            document: '123456789',
            street: 'Main St',
            number: '123',
            complement: 'Apt 4',
            city: 'Anytown',
            state: 'Anystate',
            zipCode: '12345',
            items: [
                { id: '1', name: 'Item 1', price: 100 },
                { id: '2', name: 'Item 2', price: 200 },
            ],
        };




        const output = await generateInvoiceUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: input.items,
            total: 300,
        });
    });

    it('should throw an error if invoice generation fails', async () => {
        const input: GenerateInvoiceUseCaseInputDTO = {
            name: 'John Doe',
            document: '123456789',
            street: 'Main St',
            number: '123',
            complement: 'Apt 4',
            city: 'Anytown',
            state: 'Anystate',
            zipCode: '12345',
            items: [
                { id: '1', name: 'Item 1', price: 100 },
                { id: '2', name: 'Item 2', price: 200 },
            ],
        };

        invoiceRepository.generate.mockRejectedValueOnce(new Error('Failed to generate invoice'));

        await expect(generateInvoiceUseCase.execute(input)).rejects.toThrow('Failed to generate invoice');
    });
});