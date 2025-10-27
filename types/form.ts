export interface DonorForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  town: string;
  zip: string;
  donatedBefore: string;
  hearAbout: string;
  other: string;
  dropOff: string;
  notes: string;
}

export interface Acknowledgements {
  pickupDonation: boolean;
  refuseAnyItem: boolean;
  refuseDirtyItems: boolean;
}
