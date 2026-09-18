export class EventSequencer {
  private currentSeq: number = 0;

  constructor(initialSeq: number = 0) {
    this.currentSeq = initialSeq;
  }

  public nextSequence(): number {
    this.currentSeq += 1;
    // Handle integer overflow gracefully (JavaScript safe integer is 9e15)
    if (this.currentSeq >= Number.MAX_SAFE_INTEGER) {
      this.currentSeq = 1;
    }
    return this.currentSeq;
  }

  public current(): number {
    return this.currentSeq;
  }

  public reset(): void {
    this.currentSeq = 0;
  }
}
