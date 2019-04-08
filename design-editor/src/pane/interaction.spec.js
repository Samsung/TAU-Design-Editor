import {Interaction} from './interaction';

describe('Interaction', function () {
    it('should always return the same instance', function () {
        const interaction = Interaction.getInstance();
        expect(Interaction.getInstance()).toBe(interaction);
    });
});
