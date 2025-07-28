export function SideMovingShuffle(element1, element2) {
    return new Promise((resolve) => {
        const text1 = element1.textContent;
        const text2 = element2.textContent;

        const duration = 1000;
        const easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';

        element1.style.transition = `all ${duration}ms ${easing}`;
        element1.style.transform = 'translateX(-100%) rotate(-180deg)';
        element1.style.opacity = '0';

        element2.style.transition = `all ${duration}ms ${easing}`;
        element2.style.transform = 'translateX(100%) rotate(180deg)';
        element2.style.opacity = '0';

        setTimeout(() => {
            const shouldSwap = Math.random() > 0.5;

            if (shouldSwap) {
                element1.textContent = text2;
                element2.textContent = text1;
            }

            element1.style.transition = `all ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            element2.style.transition = `all ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;

            element1.style.transform = 'translateX(0) rotate(0deg) scale(1.2)';
            element2.style.transform = 'translateX(0) rotate(0deg) scale(1.2)';
            element1.style.opacity = '1';
            element2.style.opacity = '1';

            setTimeout(() => {
                element1.style.transition = `all ${duration / 2}ms ease-out`;
                element2.style.transition = `all ${duration / 2}ms ease-out`;

                element1.style.transform = 'scale(1)';
                element2.style.transform = 'scale(1)';

                setTimeout(() => {
                    element1.style.cssText = '';
                    element2.style.cssText = '';
                    resolve();
                }, duration / 2);
            }, duration);
        }, duration);
    });
}