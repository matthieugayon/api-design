/**
 * GET /booking response body
 */

export interface Booking {
  /**
   * SUPPLIO_ID
   * read only
   */
  id: string; 

  /**
   * EXTERNAL_ID
   * read only
   * 
   * could be used to ref SF booking ID
   */
  external_id: string; 

  /**
   * ORDER_ID
   * read only
   * 
   * Opsio's order id
   */
  order_id: string; // OPSIO Order id

  /**
   * BOOKING_TYPE
   * read only
   * 
   * see BookingKind enum to see all the different possible booking types
   */
  type: BookingKind;
  
  /**
   * STATUS
   * Read-only !!
   * 
   * See status enum to see all the different possible statuses
   */
  status: Status;
  
  /**
   * BUDGET
   * Can be updated by suppliers 
   * 
   * Budget of the booking
   * if updated come from suppliers, status => BUDGET_REQUEST
   * when booking accepted, status => ACCEPTED
   */
  budget: Price; 

  /**
   * BOOKING_LOAD
   * Read-only !!
   * 
   * original load as coming from Opsio, can only be modified from OPSIO
   */
  booking_load: Load;

  /**
   * PACK_LOAD
   * Can be updated by suppliers, only if booking type is CRATING
   * (could other booking types change the packing ? Grouping ?)
   * 
   * Pack load after possible crating transformation
   */
  pack_load?: Load;

  /**
   * START object
   * details of the start of a booking
   */
  start: {

    /**
     * DATE
     * Can be updated by suppliers, only when status = START_SCHEDULED
     * 
     * date entered when booking has started, status => STARTED
     */
    date: number; // UNIX timestamp

    /**
     * EXPECTED_ON
     * Can be updated by suppliers, only when status < START_SCHEDULED
     * 
     * expected start date, used to notify next suppliers and the various contacts
     * involved in the booking, status => START_SCHEDULED 
     */
    expected_on: number; // UNIX timestamp

    /**
     * ADDRESS
     * Read only !! (Marc: why ?)
     * 
     * Address of the start of the job
     * Also holds an optional info field which can be used to add notes about the address
     */
    address: Address;

    /**
     * CONTACT
     * Read only !! (Marc: why ?)
     * 
     * Contact of the start of the job
     */
    contact: Contact;
  }

  /**
   * START object
   * details of the end of a booking
   */
  end: {

    /**
     * DATE
     * Can be updated by suppliers, only when status = END_SCHEDULED
     * 
     * date entered when booking has ended, status => COMPLETED
     */
    date: number; // UNIX timestamp

    /**
     * EXPECTED_ON
     * Can be updated by suppliers, only when status > ACCEPTED && status < END_SCHEDULED
     * 
     * expected end date, used to notify next suppliers and the various contacts
     * involved in the booking
     * if status = IN_PROGRESS  => END_SCHEDULED 
     */
    expected_on: number; // UNIX timestamp

    /**
     * ADDRESS
     * Read only !! (Marc: why ?)
     * 
     * Address of the end of the job
     * Also holds an optional info field which can be used to add notes about the address
     */
    address: Address;

    /**
     * CONTACT
     * Read only !! (Marc: why ?)
     * 
     * Contact of the end of the job
     */
    contact: Contact;
  }

  /**
   * OPTIONS
   * Read only !!
   * 
   * Optional, holds various booking options set by opsio or SF
   * used for special types of bookings like DELIVERY_LAST_MILE or PICKUP
   */
  options?: {

     /**
     * READY_ON
     * Read only !!
     * 
     * When the load is ready, can be used as ready for collection date
     */
    ready_on?: number; // UNIX timestamp
    
    /**
     * DEADLINE
     * Read only !!
     * 
     * Deadline of the booking
     */
    deadline: number; // UNIX timestamp

    /**
     * DELIVERY
     * Read only !!
     * 
     * Delivery options
     */
    delivery?: DeliveryOption 
  }

  // can be opsio contact
  // but potentially any king of authority for that booking

  /**
   * REFERRER
   * Read only !!
   * 
   * The referrer contact fo the booking
   * Ops contact of the booking
   */
  referrer: Contact 

  /**
   * REFERRER
   * Can be updated by suppliers at any time
   * 
   * Booking associated files
   */
  files: File[]; 

  /**
   * Note
   * Can be updated by suppliers at any time
   * 
   * Additional free text note
   * Can be used as "agent notes" field
   * will likely be deprecated once the supplio message/chat feature is ready
   * but could be also used as a special general note about the booking
   */
  note: string;

  /**
   * CREATED_ON
   * Read only !!
   * 
   * Creation date
   */
  created_on: number; // UNIX timestamp

  /**
   * UPDATED_ON
   * Read only !!
   * 
   * Last update date
   */
   updated_on: number; // UNIX timestamp
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
  BUDGET_REQUEST, // booking not accepted, budget proposal by the supplier or opsio
  ACCEPTED, // when booking is accepted (to be scheduled)
  START_SCHEDULED, // when expected start date has been set
  IN_PROGRESS, // when job start date has been set
  END_SCHEDULED, // when expected start AND/OR end dates have been filld in
  COMPLETED // has been delivered / picked up ... / When end date has been filled in
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

  // options field for specializing bookings, Optional
  options?: LoadOptions
}

export interface LoadOptions {
  ready_on?: number; // UNIX timestamp
  delivery?: DeliveryOption 
}



/* SUB TYPES */

enum DeliveryOption {
  Curbside,
  White_glove,
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

  // here we can put address extra information
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
  length: Length;
  height: Length;
  width: Length;
  quantity: Length;
  weight: Weight;
  description: string;
}

export interface Length {
  value: number;
  unit: LengthMetric;
}

export enum LengthMetric {
  CM,
  INCH
}

export interface Weight {
  value: number;
  unit: WeightMetric;
}

export enum WeightMetric {
  KG,
  LB
}