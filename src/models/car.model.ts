import { Stocker } from './stocker.model';
import { RegulatoryInfo } from './regulatory-info.model';
import { PriceWarranty } from './price-warranty.model';

export class Car {
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
}
