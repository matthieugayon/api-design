// Here is a quick description of the obkect we would receive when we fetch an order
// with some additionnal comments
// this may not reflect how exactly we persist the data

export interface Booking {
  id: string; // Supplio id
  booking_id: string; // SF or Opsio id,
  order_id: string; // OPSIO Order id

  // type of the booking
  // see BookingKind enum to see all the different possible booking types
  type: BookingKind;
  
  // status of the booking
  // see status enum to see all the different possible statuses
  status: Status;
  
  budget: Price; 

  /* LOADS */

  // there could be different ideas here
  // either we have two separated loads info, one from opsio and one from the craters
  // or we only have one, and this is representing the current state of the load
  // which may change after the crating
  // Having an history for the booking could also solve this problem

  // original load as coming from Opsio
  booking_load: Load;

  // load edited by the Craters (Optional, only set during the Crating)
  pack_load?: Load;

  /* ---- */

  // details of the start of a booking
  // Ex: PU info for Pickup booking type
  start: {
    // read only, date entered when booking has started ( => IN_PROGRESS )
    date: number; // UNIX timestamp (reliable date accross time zones)

    // expected start date as edited by the supplier
    expected_on: number; // UNIX timestamp (reliable date accross time zones)

    address: Address;
    contact: Contact;
  }

  // details of the end of a booking
  // Ex: DO info for Pickup booking type
  end: {
    // read only, date entered when booking has ended ( => COMPLETED )
    date: number; // UNIX timestamp (reliable date accross time zones)

    // expected start date as edited by the supplier
    // Let's see if it works with bokking CRATING
    // because we need a way to precise when the action of crating is being done
    expected_on: number; // UNIX timestamp (reliable date accross time zones)

    // special to DELIVERY_LAST_MILE
    deadline: number; // UNIX timestamp (reliable date accross time zones)

    address: Address;
    contact: Contact;
  }

  // UNIX timestamp (reliable date accross tile zones)
  // ready for collection date
  // I am not sure we need it, as the end date could serve the same purpose
  // we need to have a discussion on the dates, whether or not we could get rid of all the dates
  // and do everything with start & end
  // I'll leave it commented for the moment
  // ready_on: number; 

  // can be opsio contact
  // but potentially any king of authority for that booking
  referrer: Contact 

  // booking documents
  files: File[]; 

  // LEGACY field, will disappear with the chat/message feature, 
  // additional free text note, can be used as "agent note" field
  note: string;

  created_on: number; // UNIX timestamp (reliable date accross time zones)

  // special to DELIVERY_LAST_MILE
  // deliveryOption: DeliveryOption
}

enum BookingKind {
  PICKUP,
  CRATING,
  TRUCK_TRANSIT,
  DEPOT,
  TRUCK_PRE_FREIGHT,
  TRUCK_PRE_FREIGHT_TERMINAL,
  FREIGHT,
  POST_FREIGHT_TERMINAL,
  TRUCK_POST_FREIGHT,
  DEPOT_LAST_MILE,
  LAST_MILE_DELIVERY
}

// this needs to be completed and may vary according to the BookingType
enum Status {
  PENDING, // booking allocated but not accepted by the supplier, budget is fixed by the referrer
  BUDGET_PROPOSAL_SUPPLIER, // booking not accepted, budget proposal by the supplier
  ACCEPTED, // when booking is accepted (to be scheduled)
  SCHEDULED, // when expected start and end dates have been filld in
  IN_PROGRESS, // when load has been received, or picked up / When start date has been filled in
  COMPLETED // has been delivered / picked up ... / When end date has been filled in
}

enum Currency {
  EUR,
  USD,
  GBP
}

export interface Price {
  value: number;
  currency: Currency;
}

export interface Load {
  // for the booking load , ready for collection date
  ready_on?: number; // UNIX timestamp (reliable date accross time zones)

  items: Item[];

  // total volume in cubic meter or cubic centimeter ? 
  // or would we use Gallons (US) or anything else ? 
  volume: number; 

  // total weight
  weight: Weight;

  // total number of crates / packets / parts
  // so in the case of the original item, automatically derived from the Items information
  parts_number: number;
}

export interface Address {
  name: number;
  streetNumber: string;
  street: string;
  city: string;
  postCode: string;
  state: string;
  district: string;
  country: string;
  lat: string;
  lng: number;
  formattedAddress: string;
  iso2: string;
  info?: string;
}

export interface Contact {
  firstname: string;
  lastname: string;
  emails: string[];
  phones: Phone[];
  language?: string;
}

export interface Phone {
  code: string;
  number: string;
  iso2: string;
}

export interface Phone {
  code: string;
  number: string;
  iso2: string;
}

export interface File {
  url: string
}

enum DeliveryOption {
  Curbside,
  White_glove,
}

export interface Item {
  description: string;
  packing: Packing;
  commercialValue: Price;
  dimensions: Details[];
  quantity: number;
}

enum Packing {
  CRATED,
  NOT_PACKED
}

export interface Details {
  length: number;
  height: number;
  width: number;
  quantity: number;
  weight: Weight;
  description: string;
}

enum WeightMetric {
  KG,
  LB
}

export interface Weight {
  value: number;
  unit: WeightMetric;
}