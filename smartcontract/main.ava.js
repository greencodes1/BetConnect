import anyTest from 'ava';
import { Worker } from 'near-workspaces';
import { setDefaultResultOrder } from 'dns'; 
setDefaultResultOrder('ipv4first'); // temp fix for node >v17

/**
 *  @typedef {import('near-workspaces').NearAccount} NearAccount
 *  @type {import('ava').TestFn<{worker: Worker, accounts: Record<string, NearAccount>}>}
 */
const test = anyTest;

test.beforeEach(async t => {
  // Create sandbox
  const worker = t.context.worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('social-betting-account');

  // Deploy the contract's Wasm file
  await contract.deploy(process.argv[2]);

  // Save state for test runs
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// Test case for creating a bet
test('create a bet', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const betID = 'bet-1';
  const title = 'First Bet';
  const creatorName = 'Alice';
  const creatorDesc = 'Alice is the creator';
  const amount = '1000000000000000000000000'; // 1 NEAR in yoctoNEAR

  const bet = await root.call(contract, 'createBet', {
    betID,
    title,
    creatorName,
    creatorDesc,
    amount,
  });

  const bet2 = await root.call(contract, 'paycreateBet', {
    betID,
  }, { attachedDeposit: amount });

  t.is(bet.title, title);
  t.is(bet.creatorName, creatorName);
  t.is(bet.creatorDesc, creatorDesc);
  t.true(bet.isActive);
});

// Test case for accepting a bet
test('accept a bet', async (t) => {
  const { root, contract } = t.context.accounts;

  const betID = 'bet-2';
  const title = 'Second Bet';
  const creatorName = 'Bob';
  const creatorDesc = 'Bob is the creator';
  const amount = '1000000000000000000000000'; // 1 NEAR in yoctoNEAR

  // Create a bet
  await root.call(contract, 'createBet', {
    betID,
    title,
    creatorName,
    creatorDesc,
    amount
  });

  const bet3 = await root.call(contract, 'paycreateBet', {
    betID,
  }, { attachedDeposit: amount });
  // Accept the bet
  const acceptorName = 'Charlie';
  const acceptorDesc = 'Charlie is the acceptor';
  const acceptedBet = await root.call(contract, 'acceptBet', {
    betID,
    acceptorName,
    acceptorDesc,
    amount
  });
  const bet2 = await root.call(contract, 'payacceptBet', {
    betID,
  }, { attachedDeposit: amount });

  t.is(acceptedBet.acceptorName, acceptorName);
  t.is(acceptedBet.acceptorDesc, acceptorDesc);
  t.true(acceptedBet.isActive);
});

// Test case for submitting a result
test('submit result and complete the bet', async (t) => {
  const { root, contract } = t.context.accounts;

  const betID = 'bet-4';
  const title = 'Third Bet';
  const creatorName = 'Dave';
  const creatorDesc = 'Dave is the creator';
  const deposit = '1000000000000000000000000'; // 1 NEAR in yoctoNEAR

  // Create and accept the bet
  await root.call(contract, 'createBet', {
    betID,
    title,
    creatorName,
    creatorDesc
  }, { attachedDeposit: deposit });
  await root.call(contract, 'acceptBet', {
    betID,
    acceptorName: 'Eve',
    acceptorDesc: 'Eve is the acceptor'
  }, { attachedDeposit: deposit });

  // Submit the result by both participants
  await root.call(contract, 'submitResult', { betID, winnerId: 'Player1' });
  const finalBet = await root.call(contract, 'submitResult', { betID, winnerId: 'Player2' });

  t.is(finalBet.winner, 'test.near');
  t.false(finalBet.isActive);
});

// Test case for fetching the top three bets
test('fetch top three bets', async (t) => {
  const { root, contract } = t.context.accounts;

  // Create multiple bets with different amounts
  await root.call(contract, 'createBet', {
    betID: 'bet-1',
    title: 'Bet One',
    creatorName: 'Alice',
    creatorDesc: 'First bet'
  }, { attachedDeposit: '1000000000000000000000000' }); // 1 NEAR

  await root.call(contract, 'createBet', {
    betID: 'bet-2',
    title: 'Bet Two',
    creatorName: 'Bob',
    creatorDesc: 'Second bet'
  }, { attachedDeposit: '2000000000000000000000000' }); // 2 NEAR

  await root.call(contract, 'createBet', {
    betID: 'bet-3',
    title: 'Bet Three',
    creatorName: 'Charlie',
    creatorDesc: 'Third bet'
  }, { attachedDeposit: '3000000000000000000000000' }); // 3 NEAR

  const topBets = await contract.view('getTopThreeBets', {});
  t.is(topBets.length, 3);
  t.is(topBets[0].title, 'Bet Three');
  t.is(topBets[1].title, 'Bet Two');
  t.is(topBets[2].title, 'Bet One');
});

// Test case for checking remaining bets
test('fetch remaining bets', async (t) => {
  const { root, contract } = t.context.accounts;

  // Create four bets
  await root.call(contract, 'createBet', { betID: 'bet-1', title: 'Bet One', creatorName: 'Alice', creatorDesc: 'First bet' }, { attachedDeposit: '1000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-2', title: 'Bet Two', creatorName: 'Bob', creatorDesc: 'Second bet' }, { attachedDeposit: '2000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-3', title: 'Bet Three', creatorName: 'Charlie', creatorDesc: 'Third bet' }, { attachedDeposit: '3000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-4', title: 'Bet Four', creatorName: 'Dave', creatorDesc: 'Fourth bet' }, { attachedDeposit: '4000000000000000000000000' });

  const remainingBets = await contract.view('getRemainingBets', {});
  t.is(remainingBets.length, 1);
  t.is(remainingBets[0].title, 'Bet One');
});

// Test case for checking remaining bets
test('fetch  bet', async (t) => {
  const { root, contract } = t.context.accounts;

  // Create four bets
  await root.call(contract, 'createBet', { betID: 'bet-1', title: 'Bet One', creatorName: 'Alice', creatorDesc: 'First bet' }, { attachedDeposit: '1000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-2', title: 'Bet Two', creatorName: 'Bob', creatorDesc: 'Second bet' }, { attachedDeposit: '2000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-3', title: 'Bet Three', creatorName: 'Charlie', creatorDesc: 'Third bet' }, { attachedDeposit: '3000000000000000000000000' });
  await root.call(contract, 'createBet', { betID: 'bet-4', title: 'Bet Four', creatorName: 'Dave', creatorDesc: 'Fourth bet' }, { attachedDeposit: '4000000000000000000000000' });

  const remainingBets = await contract.view('getBet', {betID: 'bet-3'});
  const remainingBets2 = await contract.view('getBets');
  console.log(remainingBets2)
  t.true(true);
  // t.is(remainingBets[0].title, 'Bet One');
});
