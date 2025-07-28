export function VoidShuffle(...elements) {
    return new Promise((resolve) => {
        const duration = 2000;
        const texts = elements.map(el => el.textContent);

        const suctionDuration = duration * 0.3;
        const easingIn = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';

        elements.forEach((element) => {
            element.style.transition = `all ${suctionDuration}ms ${easingIn}`;
            element.style.transform = 'scale(0.01) rotate(360deg)';
            element.style.opacity = '0';
        });

        setTimeout(() => {
            const shuffledTexts = [...texts].sort(() => Math.random() - 0.5);
            elements.forEach((element, index) => {
                element.textContent = shuffledTexts[index];
            });

            const expandDuration = duration * 0.5;
            const easingExpand = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            elements.forEach((element) => {
                element.style.transition = `all ${expandDuration}ms ${easingExpand}`;
                element.style.transform = 'scale(1.2)';
                element.style.opacity = '1';
            });

            setTimeout(() => {
                const normalizeDuration = duration * 0.2;
                const easingNormalize = 'ease-out';

                elements.forEach((element) => {
                    element.style.transition = `all ${normalizeDuration}ms ${easingNormalize}`;
                    element.style.transform = 'scale(1) rotate(0deg)';
                });

                setTimeout(() => {
                    elements.forEach(element => {
                        element.style.cssText = '';
                    });
                    resolve();
                }, normalizeDuration);

            }, expandDuration);

        }, suctionDuration);
    });
}