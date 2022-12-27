import BuddiesModel from '../../models/BuddiesModel.js';
import { createMockPoint } from '../../src/utils/seedUtils.js';
import { clearCache, userCache } from '../../src/utils/userCache';
import { connectDb } from '../../src/utils/mongoUtils';

let { db, client } = await connectDb();

describe('BuddiesModel Tests - Success', () => {
  // before each test in this suite runs, let's make sure the test collection and cache are cleared
  beforeEach(async () => {
    db.deleteMany();
    clearCache();
  });

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await client.close();
  });

  it('connectDB - should connect to the correct collection', async () => {
    expect(db.s.namespace.collection).toEqual('test');
  });

  it('addUserToPoints - should add a user to the collection', async () => {
    const fakeId = 'testing1234hello';
    await BuddiesModel.addUserToPoints(fakeId);

    const testUser = await db.findOne({ _id: fakeId });

    expect(testUser._id).toEqual(fakeId);
  });

  it('testDates - should not allow a point to be given within one minute of a point given', async () => {
    const [userId, interaction] = createMockPoint();
    await BuddiesModel.giveUserAPoint(userId, interaction);

    const test = await BuddiesModel.testDates(userId, interaction);

    expect(test).toBeFalsy();
  });

  it('giveUserAPoint - should give a user a point', async () => {
    const [userId, interaction] = createMockPoint();

    await BuddiesModel.giveUserAPoint(userId, interaction).catch((err) =>
      console.log(err)
    );

    const result = await db.findOne({ _id: userId });

    const {
      author: { id },
      channelId,
    } = interaction;

    const { pointsReceived } = result;

    expect(pointsReceived[0].givenBy).toEqual(id);
    expect(pointsReceived[0].channel).toEqual(channelId);
  });

  // NOTE: countGivenPoint is no longer used

  // it('countGivenPoint - should report total points and channel points', async() => {
  //   const [userId, interaction] = createMockPoint();
  //   const { channelId} = interaction
  //   const randomNumber = Math.floor(Math.random() * 25)
  //   console.log(randomNumber)

  //   for(let i=0; i < randomNumber; i++){
  //     // ehh this should be better
  //     await BuddiesModel.giveUserAPoint(userId, interaction)
  //   }

  //   const {score, totalScore} = await BuddiesModel.countGivenPoint(userId, channelId)

  //   expect(score).toEqual(randomNumber)
  // })

  it('channelPoints - should count the points in a given channel and give the top x', async () => {
    const [firstUserId, firstInteraction] = createMockPoint();
    const { channelId } = firstInteraction;
    const firstRandomNumber = Math.floor(Math.random() * 25);

    // dont love these two loops but its a patch for now
    for (let i = 0; i < firstRandomNumber; i++) {
      await BuddiesModel.addUserToPoints(firstUserId);
    }

    for (let i = 0; i < firstRandomNumber; i++) {
      await BuddiesModel.giveUserAPoint(firstUserId, firstInteraction);
    }

    const [secondUserId, secondInteraction] = createMockPoint();
    const secondRandomNumber = Math.floor(Math.random() * 25);

    // dont love these two loops but its a patch for now
    for (let i = 0; i < secondRandomNumber; i++) {
      await BuddiesModel.addUserToPoints(secondUserId);
    }

    for (let i = 0; i < secondRandomNumber; i++) {
      // use first interaction to ensure that the points are going to the same channel
      await BuddiesModel.giveUserAPoint(secondUserId, firstInteraction);
    }

    const test = await BuddiesModel.channelPoints(channelId, 2);

    if (firstUserId !== secondUserId) {
      if (firstRandomNumber > secondRandomNumber) {
        expect(test[0]._id).toEqual(firstUserId);
        expect(test[0].points).toEqual(firstRandomNumber);
        expect(test[0].rank).toEqual(1);
        expect(test[1]._id).toEqual(secondUserId);
        expect(test[1].points).toEqual(secondRandomNumber);
        expect(test[1].rank).toEqual(2);
      }

      if (firstRandomNumber < secondRandomNumber) {
        expect(test[0]._id).toEqual(secondUserId);
        expect(test[0].points).toEqual(secondRandomNumber);
        expect(test[0].rank).toEqual(1);
        expect(test[1]._id).toEqual(firstUserId);
        expect(test[1].points).toEqual(firstRandomNumber);
        expect(test[1].rank).toEqual(2);
      }
    }

    if (firstUserId === secondUserId) {
      expect(test[0]._id).toEqual(firstUserId);
      console.log(firstRandomNumber, secondRandomNumber);
      expect(test[0].points).toEqual(firstRandomNumber + secondRandomNumber);
      expect(test[0].rank).toEqual(1);
    }
  });

  it('globalPoints - should report the total points a user has in the server', async () => {
    const [firstUserId, firstInteraction] = createMockPoint();
    const { channelId } = firstInteraction;
    const firstRandomNumber = Math.floor(Math.random() * 25);

    // dont love these two loops but its a patch for now
    for (let i = 0; i < firstRandomNumber; i++) {
      await BuddiesModel.addUserToPoints(firstUserId);
    }

    for (let i = 0; i < firstRandomNumber; i++) {
      await BuddiesModel.giveUserAPoint(firstUserId, firstInteraction);
    }

    const [secondUserId, secondInteraction] = createMockPoint();
    const secondRandomNumber = Math.floor(Math.random() * 25);

    // dont love these two loops but its a patch for now
    for (let i = 0; i < secondRandomNumber; i++) {
      await BuddiesModel.addUserToPoints(secondUserId);
    }

    for (let i = 0; i < secondRandomNumber; i++) {
      await BuddiesModel.giveUserAPoint(secondUserId, secondInteraction);
    }

    const test = await BuddiesModel.globalPoints();

    if (firstUserId !== secondUserId) {
      if (firstRandomNumber > secondRandomNumber) {
        expect(test[0]._id).toEqual(firstUserId);
        expect(test[0].points).toEqual(firstRandomNumber);
        expect(test[0].rank).toEqual(1);
        expect(test[1]?._id).toEqual(secondUserId);
        expect(test[1].points).toEqual(secondRandomNumber);
        expect(test[1].rank).toEqual(2);
      }

      if (firstRandomNumber < secondRandomNumber) {
        expect(test[0]._id).toEqual(secondUserId);
        expect(test[0].points).toEqual(secondRandomNumber);
        expect(test[0].rank).toEqual(1);
        expect(test[1]?._id).toEqual(firstUserId);
        expect(test[1].points).toEqual(firstRandomNumber);
        expect(test[1].rank).toEqual(2);
      }
    }

    if (firstUserId === secondUserId) {
      expect(test[0]._id).toEqual(firstUserId);
      expect(test[0].points).toEqual(firstRandomNumber + secondRandomNumber);
      expect(test[0].rank).toEqual(1);
    }
  });

  it('populateUserCache - should populate the user cache from all documents in the db', async () => {
    const [firstUserId, firstInteraction] = createMockPoint();
    for (let i = 0; i < 25; i++) {
      await BuddiesModel.giveUserAPoint(firstUserId, firstInteraction);
    }

    expect(userCache[firstUserId]).toEqual(firstUserId);
  });

  it("getUserGlobalPoints - should report a user's total points", async () => {
    const [firstUserId, firstInteraction] = createMockPoint();
    const { channelId: firstChannel } = firstInteraction;
    const firstRandomNumber = Math.floor(Math.random() * 25);

    const [secondUserId, secondInteraction] = createMockPoint();
    let { channelId: secondChannel } = secondInteraction;
    const secondRandomNumber = Math.floor(Math.random() * 25);

    // quickly make sure that we are not populating the same channel
    while (firstChannel === secondChannel) {
      const [newId, newInteraction] = createMockPoint();
      secondChannel = newInteraction.channelId;
    }

    for (let i = 0; i < firstRandomNumber; i++) {
      await BuddiesModel.giveUserAPoint(firstUserId, firstInteraction);
    }

    for (let i = 0; i < secondRandomNumber; i++) {
      await BuddiesModel.giveUserAPoint(firstUserId, secondInteraction);
    }

    const test = await BuddiesModel.getUserGlobalPoints(firstUserId);

    expect(test.points).toEqual(firstRandomNumber + secondRandomNumber);
  });

  it('getUserInfoChannel - should return the amount of points a user has in a given channel', async () => {
    const [userId, interaction] = createMockPoint();
    const { channelId } = interaction;
    const randomNumber = Math.floor(Math.random() * 25);

    for (let i = 0; i < randomNumber; i++) {
      await BuddiesModel.giveUserAPoint(userId, interaction);
    }

    const test = await BuddiesModel.getUserInfoOfChannel(userId, channelId);

    expect(test._id).toEqual(userId);
    expect(test.points).toEqual(randomNumber);
  });
});
