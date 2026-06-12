import type { ScaleOfLossView } from './types';

export const scaleOfLossView: ScaleOfLossView = {
  id: 'beat1.scale_of_loss',
  footballPitch: {
    intervalSeconds: 5,
    statement: 'Every 5 seconds, a football pitch of soil is lost to erosion.',
    source: 'FAO, Global Symposium on Soil Erosion (2019)',
    url: 'https://www.fao.org/about/meetings/soil-erosion-symposium/key-messages/en/',
    retrieved: '2026-06-11',
  },
  degradedLand: {
    valueMin: 75,
    valueMax: 80,
    statement: 'of cultivated land in Sub-Saharan Africa is degraded.',
    source: "FAO, Status of the World's Soil Resources (2015)",
    url: 'https://www.fao.org/global-soil-partnership/resources/highlights/detail/en/c/1026401/',
    retrieved: '2026-06-11',
  },
};
