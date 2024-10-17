import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items.entity";

type InvoiceProps = {
  id?: Id; // value object
  name: string;
  document: string;
  address: Address; // value object
  items: InvoiceItems[]; // Invoice Items entity
  createdAt?: Date; // criada automaticamente
  updatedAt?: Date; // criada automaticamente
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  public readonly name: string;
  public readonly document: string;
  public readonly address: Address;
  public readonly items: InvoiceItems[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.document = props.document;
    this.address = props.address;
    this.items = props.items;
  }

  get total() {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }
}
