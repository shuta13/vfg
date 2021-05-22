import { InventoryConstants, PreviewConstants } from '../../config';
import { createSkeletonFrame } from '../internal';

describe('internal', () => {
  describe('create-empty-frame', () => {
    test.each([
      [
        'media input',
        {
          name: 'media-input',
          type: InventoryConstants.suffix,
          size: { width: 100, height: 100 },
          nodePosition: { x: 0, y: 0 },
          workspaceName: 'media-input',
        },
        {
          type: InventoryConstants.suffix,
          workspaceName: 'media-input',
        },
      ],
      [
        'preview',
        {
          name: 'preview',
          type: PreviewConstants.suffix,
          size: { width: 100, height: 100 },
          nodePosition: { x: 0, y: 0 },
          workspaceName: 'preview',
        },
        {
          type: PreviewConstants.suffix,
          workspaceName: 'preview',
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
