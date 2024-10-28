import { NearBindgen, near, call, view, UnorderedMap, assert,NearPromise } from 'near-sdk-js';


type Bet = {
  title: string;
  creatorName: string;
  creator: string;
  creatorDesc: string;
  amount: number;
  acceptor: string;
  acceptorName: string;
  acceptorDesc: string;
  winner: string;
  creatorSubmittedWinner: string;
  acceptorSubmittedWinner: string;
  isActive: boolean;
};

@NearBindgen({})
class SocialBetting {
  owner: string;
  bets: UnorderedMap<Bet> = new UnorderedMap('h');
  betIDs: string[];
  locked: boolean;


  constructor() {

  }

  @call({payableFunction: true})
  createBet({ betID, title, creatorName, creatorDesc }: { betID: string, title: string, creatorName: string, creatorDesc: string }): any {
    assert(near.attachedDeposit() > 0, "Must send some NEAR to create a bet");
    assert(!this.bets.get(betID), "Bet ID already exists");

    const newBet: Bet = {
      title,
      creatorName,
      creator: near.signerAccountId(),
      creatorDesc,
      amount: Number(near.attachedDeposit()) ,
      acceptor: "",
      acceptorName: "",
      acceptorDesc: "",
      winner: "",
      creatorSubmittedWinner: "",
      acceptorSubmittedWinner: "",
      isActive: true
    };

    this.bets.set(betID, newBet);
    // this.betIDs.push(betID);
    const amount = near.attachedDeposit();
 const bidder = near.predecessorAccountId();
 NearPromise.new(bidder).transfer(amount);

    near.log(`Bet created: ${betID}`);
    return newBet
  }

  @call({payableFunction: true})
  acceptBet({ betID, acceptorName, acceptorDesc }: { betID: string, acceptorName: string, acceptorDesc: string }): any {
    let bet = this.bets.get(betID);
    assert(bet.isActive, "Bet is not active");
    assert(!bet.acceptor, "Bet already accepted");
    assert( Number(near.attachedDeposit()) === bet.amount, "Must match the creator's wager amount");

    bet.acceptor = near.signerAccountId();
    bet.acceptorName = acceptorName;
    bet.acceptorDesc = acceptorDesc;
    bet.amount +=  Number(near.attachedDeposit()); 
    this.bets.set(betID, bet);


    const amount = near.attachedDeposit();
    const bidder = near.predecessorAccountId();
    NearPromise.new(bidder).transfer(amount);

    near.log(`Bet accepted: ${bet}`);
  
    return bet
  }

  @call({payableFunction: true})
  submitResult({ betID, winnerId }: { betID: string, winnerId: string }): any {
    assert(!this.locked, "No re-entrancy allowed");
    this.locked = true;
  
    let bet = this.bets.get(betID);

   assert(bet.isActive, "Bet is not active");
    assert(near.signerAccountId() === bet.creator || near.signerAccountId() === bet.acceptor, "Only participants can submit results");
  
    if (near.signerAccountId() === bet.creator) {
      bet.creatorSubmittedWinner = winnerId;

    } else if (near.signerAccountId() === bet.acceptor) {
      bet.acceptorSubmittedWinner = winnerId;

    }
  
    if (bet.creatorSubmittedWinner && bet.acceptorSubmittedWinner) {
      assert(bet.creatorSubmittedWinner === bet.acceptorSubmittedWinner, "Result mismatch, both parties must submit the same winner");
      bet.winner =  bet.creatorSubmittedWinner === 'Player1' ? bet.creator : bet.acceptor
      bet.isActive = false;
  
     
      near.log(`Bet result submitted: ${betID}, winner: ${bet.winner}`);
      
     
      const promiseIndex = near.promiseBatchCreate(bet.winner);
      
     
      near.promiseBatchActionTransfer(promiseIndex, bet.amount);
    }
  
    this.bets.set(betID, bet);
    this.locked = false;
    return bet;
  }
  

  @view({})
  getTopThreeBets(): any {
    const sortedBets = this.getSortedBets();
    return sortedBets.slice(0, 3);
  }

  @view({})
  getRemainingBets(): any {
    const sortedBets = this.getSortedBets();
    return sortedBets.slice(3);
  }

  getSortedBets(): any[] {
   
    const maindata = this.bets.toArray()

    const btfsHashes = maindata.map(item => item[0]);
    const betList = btfsHashes.map(betID => this.bets.get(betID));
    return betList.sort((a, b) => b.amount - a.amount);
  }
}
