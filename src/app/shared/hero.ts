export class Hero {

  imagePath: string = '';
}

export class Warrior extends Hero {

  constructor() {
    super();
    this.imagePath = 'warrior';
  }
}

export class Bowman extends Hero {

  constructor() {
    super();
    this.imagePath = 'bowman';
  }
}
