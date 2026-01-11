import { Ai } from '../../game/ai';

interface AiDebugInfo {
  games: number;
  deadEnds: number;
  deadEndOuts: number;
  totalPoints: number;
}

const aiStatsKey = 'aiStats';

const aiStatsDefault: AiDebugInfo = {
  games: 0,
  deadEnds: 0,
  deadEndOuts: 0,
  totalPoints: 0,
};

export function saveAiStatsToLocalStorage(ais: Ai[]): void {
  const aiStatsStr = localStorage.getItem(aiStatsKey);
  const aiStats: AiDebugInfo = aiStatsStr ? JSON.parse(aiStatsStr) : aiStatsDefault;

  const aisStatsLastGame = ais.reduce<Omit<AiDebugInfo, 'games'>>((acc, ai) => {
    return {
      ...acc,
      deadEnds: acc.deadEnds + ai.debugInfo.deadEnds,
      deadEndOuts: acc.deadEndOuts + ai.debugInfo.deadEndOuts,
      totalPoints: acc.totalPoints + ai.points,
    };
  }, { deadEnds: 0, deadEndOuts: 0, totalPoints: 0 });

  const aiStatsNew: AiDebugInfo = {
    games: aiStats.games + 1,
    deadEnds: aiStats.deadEnds + aisStatsLastGame.deadEnds,
    deadEndOuts: aiStats.deadEndOuts + aisStatsLastGame.deadEndOuts,
    totalPoints: aiStats.totalPoints + aisStatsLastGame.totalPoints,
  };

  const persents = (
    aiStatsNew.deadEnds > 0
      ? aiStatsNew.deadEndOuts / aiStatsNew.deadEnds * 100
      : 0
  ).toFixed(2);

  const avgPonts = (
    aiStatsNew.games > 0
      ? aiStatsNew.totalPoints / aiStatsNew.games
      : 0
  ).toFixed(2);

  console.debug(`Ai stats\ngames: ${
    aiStatsNew.games
  }\ndeadEnds: ${
    aiStatsNew.deadEnds
  }\ndeadEndOuts: ${
    aiStatsNew.deadEndOuts
  }\nsurvivesPercent: ${
    persents
  }%\navgPonts: ${avgPonts}`);

  localStorage.setItem(aiStatsKey, JSON.stringify(aiStatsNew));
  localStorage.setItem(`${aiStatsKey}SurvivesPercent`, persents);
  localStorage.setItem(`${aiStatsKey}AvgPoints`, avgPonts);
}
