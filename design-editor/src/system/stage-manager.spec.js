import {stageManager, StageManager} from './stage-manager';

describe('StageManager', () => {
    it('should contain a constructor', () => {
        expect(stageManager).toBeDefined();
        expect(stageManager instanceof StageManager).toEqual(true);
    });

});

