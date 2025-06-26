export interface StreamKey {
  id: string;
  key: string;
  room_id: string;
  customer_id: string;
  app_id: string;
  enabled: boolean;
  url: string;
  created_at: Date;
  updated_at: Date;
}

export interface GetStreamKeysResponse {
  data: StreamKey[];
  last: string;
}
