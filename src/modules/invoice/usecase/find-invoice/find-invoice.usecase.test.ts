import { jest } from '@jest/globals';
import FindInvoiceUseCase from './find-invoice.usecase';
import InvoiceGateway from '../../gateway/invoice.gateway';
import { FindInvoiceUseCaseInputDTO } from './find-invoice.usecase.dto';
import Invoice from '../../domain/invoice.entity';
import Address from '../../../@shared/domain/value-object/address';
import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItems from '../../domain/invoice-items.entity';

describe('FindInvoiceUseCase', () => {
    let findInvoiceUseCase: FindInvoiceUseCase;
    let invoiceRepository: jest.Mocked<InvoiceGateway>;

    beforeEach(() => {
        invoiceRepository = {
            find: jest.fn(),
        } as unknown as jest.Mocked<InvoiceGateway>;

        findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    });

    it('should find an invoice by id', async () => {
        const input: FindInvoiceUseCaseInputDTO = { id: '1' };
        const mockInvoice = new Invoice({
          id: new Id("1"),
          name: "Test Invoice",
          document: "123456789",
          address: new Address(
            "Test Street",
            "123",
            "Apt 1",
            "Test City",
            "TS",
            "12345"
          ),
          items: [
            new InvoiceItems({ id: new Id("1"), name: "Item 1", price: 100 }),
            new InvoiceItems({ id: new Id("2"), name: "Item 2", price: 200 }),
          ],
          createdAt: new Date(),
        });

        invoiceRepository.find.mockResolvedValue(mockInvoice);

        const result = await findInvoiceUseCase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalledWith('1');
        expect(result).toEqual({
            id: '1',
            name: 'Test Invoice',
            document: '123456789',
            address: {
                street: 'Test Street',
                number: '123',
                complement: 'Apt 1',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
            },
            items: [
                { id: '1', name: 'Item 1', price: 100 },
                { id: '2', name: 'Item 2', price: 200 },
            ],
            total: 300,
            createdAt: mockInvoice.createdAt,
        });
    });

});