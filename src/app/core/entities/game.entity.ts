import { Card } from './card.entity';
import { Deck } from './deck.entity';
import { Player, PlayerUsername } from './player.entity';

export interface IHandCard {
  card: Card;
  visible: boolean;
}

export interface IGame {
  id: string;
  deck: Deck;
  player: Player;
  dealer: Player;
  hands: Map<PlayerUsername, IHandCard[]>;
  winner: Player | null;
  createdAt: Date;
  finishedAt: Date | null;
}

export type GameScoreboard = Record<PlayerUsername, number>;

export class Game {
  id: string;
  deck: Deck;
  player: Player;
  dealer: Player;
  hands: Map<PlayerUsername, IHandCard[]>;
  #winner: Player | null = null;
  #finishedAt: Date | null = null;
  createdAt: Date;
  #hasRemovedCard: Set<PlayerUsername> = new Set();

  constructor({
    deck,
    player,
    dealer,
  }: Omit<IGame, 'id' | 'hands' | 'winner' | 'finishedAt' | 'createdAt'>) {
    this.id = Date.now().toString();
    this.deck = deck;
    this.player = player;
    this.dealer = dealer;
    this.hands = new Map<PlayerUsername, IHandCard[]>();
    this.createdAt = new Date();
  }

  public get winner(): Player | null {
    return this.#winner;
  }

  public get finishedAt(): Date | null {
    return this.#finishedAt;
  }

  public getScore(player: Player, includeHidden = false): number {
    const hand = this.hands.get(player.username);
    if (!hand) return 0;
    const points = hand
      .filter((card) => includeHidden || card.visible)
      .reduce((acc, { card }) => acc + card.value, 0);
    return points;
  }

  public getScoreboard(): GameScoreboard {
    return {
      [this.player.username]: this.getScore(this.player),
      [this.dealer.username]: this.getScore(this.dealer),
    };
  }

  public addCardToHand(player: Player, card: Card, visible = true): void {
    const hand = this.hands.get(player.username);
    const newHand = hand ? [...hand, { card, visible }] : [{ card, visible }];
    this.hands.set(player.username, newHand);
  }

  public canRemoveCardFromHand(player: Player): boolean {
    return !this.#hasRemovedCard.has(player.username);
  }

  public removeCardFromHand(player: Player, card: Card): void {
    const hand = this.hands.get(player.username);
    const newHand = hand
      ? hand.filter((handCard) => handCard.card.code !== card.code)
      : [];
    this.hands.set(player.username, newHand);
    this.#hasRemovedCard.add(player.username);
  }

  public revealCards(player: Player): void {
    const hand = this.hands.get(player.username);
    if (!hand) return;
    const newHand = hand.map((handCard) => ({ ...handCard, visible: true }));
    this.hands.set(player.username, newHand);
  }

  public canDraw(player: Player): boolean {
    const score = this.getScore(player);
    if (player.username === this.dealer.username) {
      return score < 17 || score < this.getScore(this.player);
    }
    return score < 21;
  }

  public getResult(): { isDraw: boolean; winner: Player | null } {
    const playerScore = this.getScore(this.player);
    const dealerScore = this.getScore(this.dealer);

    if (playerScore === 21) {
      return { winner: this.player, isDraw: false };
    }

    if (dealerScore === 21) {
      return { winner: this.dealer, isDraw: false };
    }

    if (playerScore > 21) {
      return { winner: this.dealer, isDraw: false };
    }

    if (dealerScore > 21) {
      return { winner: this.player, isDraw: false };
    }

    if (this.canDraw(this.player) && this.canDraw(this.dealer)) {
      return { winner: null, isDraw: false };
    }

    if (
      this.canDraw(this.player) &&
      !this.canDraw(this.dealer) &&
      playerScore === dealerScore
    ) {
      return { winner: null, isDraw: true };
    }

    if (playerScore > dealerScore) {
      return { winner: this.player, isDraw: false };
    }

    return { winner: this.dealer, isDraw: false };
  }

  public end(player: Player | null) {
    this.#winner = player;
    this.#finishedAt = new Date();
  }

  public isFinished(): boolean {
    return !!this.#finishedAt;
  }
}
