import CircularObjectInterface from '../interfaces/CircularObjectInterface';
import { SCREEN_X, SCREEN_Y } from './gameSettings';

const defaultGameObjects: CircularObjectInterface[] = [
  {
    type: 'BALL',
    x: SCREEN_X / 2,
    y: SCREEN_Y / 2,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 15,
    color: '#ffaa00',
  },
  {
    type: 'PLAYER',
    x: 100,
    y: SCREEN_Y / 2,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 25,
    color: '#0000ff',
  },
  {
    type: 'AI',
    x: SCREEN_X - 100,
    y: SCREEN_Y / 2,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 25,
    color: '#00ff00',
  },
];

export default defaultGameObjects;
