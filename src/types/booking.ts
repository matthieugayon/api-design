// Here is a quick description of the obkect we would receive when we fetch an order
// with some additionnal comments
// this may not reflect how exactly we persist the data

export interface Booking {
  id: string; // Supplio id
  booking_id: string; // SF or Opsio id,

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
  order_load: Load;

  // load edited by the Craters (Optional, only set during the Crating)
  crate_load?: Load;

  /* ---- */

  // details of the start of a booking
  // Ex: PU info for Pickup booking type
  start: {
    // read only
    date: number; // UNIX timestamp (reliable date accross time zones)

    // (Optional) could be used to possibly notify the previous supplier about a availability
    // we need to explore this topic more thoroughly
    ready_on?: number; // UNIX timestamp (reliable date accross time zones)

    expected_on: number;
    address: Address;
    contact: Contact;
    note: string // additional free text note for start event (date/address/contact ..)
  }

  // details of the end of a booking
  // Ex: DO info for Pickup booking type
  end: {
    // (Optional) could be used to possibly notify the next supplier about expected job end
    // we need to explore this topic more thoroughly
    expected_on?: number; // UNIX timestamp (reliable date accross time zones)

    date: number; // UNIX timestamp (reliable date accross time zones)
    address: Address;
    contact: Contact;
    note: string // additional free text note for end event (date/address/contact ..)
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
  note: string 
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
  PENDING, // when booking hasn't been allocated yet
  ACCEPTED, // when booking is accepted
  IN_PROGRESS, // when load has been received, or picked up
  COMPLETED // has been delivered / picked up ...
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

export interface Item {
  description: string;
  packing: Packing;
  commercialValue: Price;
  dimensions: Dimension[];
  quantity: number;
}

enum Packing {
  CRATED,
  NOT_PACKED
}

export interface Dimension {
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
