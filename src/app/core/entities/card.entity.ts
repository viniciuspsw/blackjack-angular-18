export enum CardSuit {
  Hearts = 'HEARTS',
  Diamonds = 'DIAMONDS',
  Clubs = 'CLUBS',
  Spades = 'SPADES',
}

export interface ICard {
  code: string;
  value: number;
  suit: CardSuit;
}

export class Card {
  code: string;
  value: number;
  suit: CardSuit;

  constructor({ code, value, suit }: ICard) {
    this.code = code;
    this.value = value;
    this.suit = suit;
  }

  public get image(): string {
    return `https://deckofcardsapi.com/static/img/${this.code}.png`;
  }
}
