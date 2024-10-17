import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceProps = {
  id?: Id; // criada automaticamente
  name: string;
  price: number;
}

export default class InvoiceItems extends BaseEntity implements AggregateRoot {
  public readonly name: string;
  public readonly price: number;

  constructor(props: InvoiceProps) {
    super(props.id);
    this.name = props.name;
    this.price = props.price;
  }
}
