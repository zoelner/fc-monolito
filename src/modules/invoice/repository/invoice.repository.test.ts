import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "./invoice.repository";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items.entity";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Invoice 1",
            document: "123456789",
            street: "Street 1",
            number: "123",
            complement: "Apt 1",
            city: "City 1",
            state: "State 1",
            zipcode: "12345",
            createdAt: new Date(),
            updatedAt: new Date(),
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                    invoiceId: "1",
                },
            ],
        }, {
            include: [InvoiceItemModel]
        });

        const foundInvoice = await invoiceRepository.find("1");

        expect(foundInvoice.id.id).toEqual(invoice.id);
        expect(foundInvoice.name).toEqual(invoice.name);
        expect(foundInvoice.document).toEqual(invoice.document);
        expect(foundInvoice.address.street).toEqual(invoice.street);
        expect(foundInvoice.address.number).toEqual(invoice.number);
        expect(foundInvoice.address.complement).toEqual(invoice.complement);
        expect(foundInvoice.address.city).toEqual(invoice.city);
        expect(foundInvoice.address.state).toEqual(invoice.state);
        expect(foundInvoice.address.zipCode).toEqual(invoice.zipcode);
        expect(foundInvoice.items[0].id.id).toEqual(invoice.items[0].id);
        expect(foundInvoice.items[0].name).toEqual(invoice.items[0].name);
        expect(foundInvoice.items[0].price).toEqual(invoice.items[0].price);
    });

    it("should throw an error when invoice is not found", async () => {
        const invoiceRepository = new InvoiceRepository();

        await expect(invoiceRepository.find("1")).rejects.toThrow("Invoice not found");
    });

    it("should generate an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        const invoice = new Invoice({
            id: new Id("1"),
            name: "Invoice 1",
            document: "123456789",
            address: new Address("Street 1", "123", "Apt 1", "City 1", "State 1", "12345"),
            items: [
                new InvoiceItems({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 100,
                }),
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await invoiceRepository.generate(invoice);

        const foundInvoice = await InvoiceModel.findOne({
          include: [{ model: InvoiceItemModel, as: "items" }],
          where: {
            id: invoice.id.id,
          },
        });

        expect(foundInvoice).not.toBeNull();
        expect(foundInvoice.id).toEqual(invoice.id.id);
        expect(foundInvoice.name).toEqual(invoice.name);
        expect(foundInvoice.document).toEqual(invoice.document);
        expect(foundInvoice.street).toEqual(invoice.address.street);
        expect(foundInvoice.number).toEqual(invoice.address.number);
        expect(foundInvoice.complement).toEqual(invoice.address.complement);
        expect(foundInvoice.city).toEqual(invoice.address.city);
        expect(foundInvoice.state).toEqual(invoice.address.state);
        expect(foundInvoice.zipcode).toEqual(invoice.address.zipCode);
        expect(foundInvoice.items[0].id).toEqual(invoice.items[0].id.id);
        expect(foundInvoice.items[0].name).toEqual(invoice.items[0].name);
        expect(foundInvoice.items[0].price).toEqual(invoice.items[0].price);
    });
});