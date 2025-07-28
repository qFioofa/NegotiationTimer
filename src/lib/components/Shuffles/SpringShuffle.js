export function SpringShuffle(...elements) {
    return new Promise((resolve) => {
        const duration = 1500;
        const texts = elements.map(el => el.textContent);

        const compressDuration = duration * 0.3;
        const easingCompress = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';

        elements.forEach((element) => {
            element.style.transition = `all ${compressDuration}ms ${easingCompress}`;
            element.style.transform = 'scale(0.1)';
            element.style.opacity = '0.3';
        });

        setTimeout(() => {
            const shuffledTexts = [...texts].sort(() => Math.random() - 0.5);
            elements.forEach((element, index) => {
                element.textContent = shuffledTexts[index];
            });

            const springDuration = duration * 0.5;
            const easingSpring = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            elements.forEach((element) => {
                element.style.transition = `all ${springDuration}ms ${easingSpring}`;
                element.style.transform = 'scale(1.1)';
                element.style.opacity = '1';
            });

            setTimeout(() => {
                const settleDuration = duration * 0.2;
                const easingSettle = 'ease-out';

                elements.forEach((element) => {
                    element.style.transition = `all ${settleDuration}ms ${easingSettle}`;
                    element.style.transform = 'scale(1)';
                });

                setTimeout(() => {
                    elements.forEach(element => {
                        element.style.cssText = '';
                    });
                    resolve();
                }, settleDuration);

            }, springDuration);

        }, compressDuration);
    });
}