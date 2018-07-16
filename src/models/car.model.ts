import { Stocker } from './stocker.model';
import { RegulatoryInfo } from './regulatory-info.model';
import { PriceWarranty } from './price-warranty.model';
import { User } from './user.model';

export class Car {
  id?: String;
  stocker: Stocker;
  regulatoryInfo: RegulatoryInfo;
  priceWarranty: PriceWarranty;
  photo: String;
  duration: Number;
  mileage: String;
  description: String;
  isCarAccidental: Boolean;
  isCarCertified: Boolean;
  isCarFloodAffected: Boolean;
  stock_entryDate: Date;
  createdBy: User;
  createdDate: Date;
}
