import {EntityId} from "@shared/models/id/entity-id";
import {EntityType} from "@shared/models/entity-type.models";

export class TestId implements EntityId {
  entityType = EntityType.TEST;
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
