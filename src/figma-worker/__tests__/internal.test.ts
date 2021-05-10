import { MediaInputConstants } from '../../config';
import { createSkeletonFrame } from '../internal';

describe('internal', () => {
  describe('create-empty-frame', () => {
    test.each([
      [
        'media input',
        {
          name: 'foo',
          type: MediaInputConstants.suffix,
          size: { width: 100, height: 100 },
          nodePosition: { x: 0, y: 0 },
          workspaceName: 'foo',
        },
        {
          type: MediaInputConstants.suffix,
          workspaceName: 'foo',
        },
      ],
    ])('can create %s', (_, input, expected) => {
      const empty = createSkeletonFrame(input);
      expect({
        type: empty.getPluginData('type'),
        workspaceName: empty.getPluginData('workspaceName'),
      }).toStrictEqual(expected);
    });
  });
});
