import formatCode from '../../src/message_replies/formatCode';
import sinon from 'sinon';

describe('codeFormat Tests', () => {
  // create a mock interaction. This formatCode only needs the content and reply props so let's just include them
  // reply is just an empty function, that we will spy on
  // TODO: make this a larger toolset so that it can be used across the bot testing
  const interaction = {
    content: '',
    reply: () => {},
  };

  // lets spy on the reply mehtod so we can assert that
  // it has been called with the expected arguments in our tests
  let replySpy = sinon.spy(interaction, 'reply');

  it('!js command should work', () => {
    // lets not mutate the interaction object
    const jsInteraction = { ...interaction, content: '!js test' };
    formatCode(jsInteraction, '!js');

    expect(replySpy.calledWith('```js\n test```')).toBeTruthy();
  });

  it('!css command should work', () => {
    // lets not mutate the interaction object
    const cssInteraction = { ...interaction, content: '!css test' };
    formatCode(cssInteraction, '!css');

    expect(replySpy.calledWith('```css\n test```')).toBeTruthy();
  });

  it('!html command should work', () => {
    // lets not mutate the interaction object
    const htmlInteraction = { ...interaction, content: '!html test' };
    formatCode(htmlInteraction, '!html');

    expect(replySpy.calledWith('```html\n test```')).toBeTruthy();
  });
});
