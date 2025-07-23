// accessLevels.ts
export const AccessLevels = {
  PLAYER: 0,
  VIP: 1,
  MODERATOR: 2,
  ADMIN: 3,
  DEV: 4,
  OWNER: 5,
} as const;

export type AccessLevel = typeof AccessLevels[keyof typeof AccessLevels];
