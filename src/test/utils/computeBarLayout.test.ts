import {describe, it, expect} from 'vitest';
import {computeBarLayout} from '../../utils/computeBarLayout';
import {DEFAULT_THEME} from '../../theme/defaultTheme';

describe('computeBarLayout', () => {
    it('should compute horizontal layout correctly', () => {
        const layout = computeBarLayout(600, 200, 'horizontal', DEFAULT_THEME);
        expect(layout.trackLength).toBe(600 - DEFAULT_THEME.bar.trackPadding * 2);
        expect(layout.viewBox).toBe('0 0 600 200');
    });

    it('should compute vertical layout correctly', () => {
        const layout = computeBarLayout(200, 600, 'vertical', DEFAULT_THEME);
        expect(layout.trackLength).toBe(600 - DEFAULT_THEME.bar.trackPadding * 2);
        expect(layout.viewBox).toBe('0 0 200 600');
    });
});
