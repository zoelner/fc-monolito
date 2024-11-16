import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.dto";

export default class AddClientUseCase implements UseCaseInterface {
  private _clientRepository: ClientGateway;

  constructor(_ClientRepository: ClientGateway) {
    this._clientRepository = _ClientRepository;
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      address: input.address,
    };

    const client = new Client(props);
    this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
