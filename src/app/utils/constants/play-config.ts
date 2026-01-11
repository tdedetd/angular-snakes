interface PlayConfig {
  playersCount: number;
  applesCount: number;
  autoRestart: boolean;
  tickInterval: number;
}

export const playConfig: PlayConfig = {
  playersCount: 10,
  applesCount: 2,
  autoRestart: false,
  tickInterval: 100,
};
