import type {
  TikTokConnectionState,
  AEPEventType,
  AEPRealtimeEvent,
  AEPChatPayload,
  AEPGiftPayload,
  AEPLikePayload,
  AEPFollowPayload,
  AEPSharePayload,
  AEPViewerUpdatePayload,
  AEPRoomUpdatePayload,
  AEPConnectionStatePayload,
  AEPGatewayHealthMetrics,
} from '@aep/types';

export type {
  TikTokConnectionState,
  AEPEventType,
  AEPRealtimeEvent,
  AEPChatPayload,
  AEPGiftPayload,
  AEPLikePayload,
  AEPFollowPayload,
  AEPSharePayload,
  AEPViewerUpdatePayload,
  AEPRoomUpdatePayload,
  AEPConnectionStatePayload,
  AEPGatewayHealthMetrics,
};

export type EventSubscriber = (event: AEPRealtimeEvent) => void;

export interface GatewayConfig {
  defaultBroadcaster: string;
  heartbeatIntervalMs: number;
  stalenessThresholdMs: number;
  dedupTtlMs: number;
  dedupMaxCapacity: number;
  bufferCapacity: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  maxReconnectAttempts: number;
  connectTimeoutMs: number;
}
