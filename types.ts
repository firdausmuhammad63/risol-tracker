export interface RisolEntry {
  id: string;
  placeName: string;
  description: string;
  location: string;
  droppedQty: number;
  soldQty: number;
  timestamp: Date;
  imageUrl: string;
}

export type ViewState = 'dashboard' | 'add-entry' | 'detail';