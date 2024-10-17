import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDTO, GenerateInvoiceUseCaseOutputDTO } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDTO
  ): Promise<GenerateInvoiceUseCaseOutputDTO> {
    const newInvoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode,
      ),
      items: input.items.map((item) => (new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      }))),
    });

    await this.invoiceRepository.generate(newInvoice);
    

    return {
      id: newInvoice.id.id,
      name: newInvoice.name,
      document: newInvoice.document,
      street: newInvoice.address.street,
      number: newInvoice.address.number,
      complement: newInvoice.address.complement,
      city: newInvoice.address.city,
      state: newInvoice.address.state,
      zipCode: newInvoice.address.zipCode,
      items: newInvoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: newInvoice.total,
    }
  }
}
