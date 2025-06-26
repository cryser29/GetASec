export interface BaseEvent {
  version: string;
  id: string;
  account_id: string;
  app_id: string;
  room_id: string;
  timestamp: string;
  type: string;
}

export interface PeerJoinSuccessData {
  account_id: string;
  app_id: string;
  joined_at: string;
  peer_id: string;
  role: string;
  room_id: string;
  room_name: string;
  session_id: string;
  session_started_at: string;
  template_id: string;
  type: string;
  user_data: string;
  user_name: string;
}

export interface PeerJoinSuccessEvent extends BaseEvent {
  type: "peer.join.success";
  data: PeerJoinSuccessData;
}

// Union type for all event types - can be extended in the future
export type Event = PeerJoinSuccessEvent;
