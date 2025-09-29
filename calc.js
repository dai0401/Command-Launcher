document.addEventListener('DOMContentLoaded', () => {
    const expressionEl = document.getElementById('expression');
    const resultEl = document.getElementById('result');
    const buttonGrid = document.getElementById('button-grid');

    const parser = math.parser();

    function calculate() {
        const expression = expressionEl.value;

        if (expression.trim() === '') {
            resultEl.textContent = '';
            resultEl.classList.remove('error');
            return;
        }

        try {
            const result = parser.evaluate(expression);
            if (result !== undefined && typeof result !== 'function') {
                resultEl.textContent = '= ' + result.toString();
                resultEl.classList.remove('error');
            } else {
                resultEl.textContent = '';
                resultEl.classList.remove('error');
            }
        } catch (e) {
            resultEl.textContent = e.message;
            resultEl.classList.add('error');
        }
    }

    // Event delegation for all button clicks
    buttonGrid.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') return; // Ignore clicks not on a button

        const button = event.target;
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (value) {
            expressionEl.value += value;
        } else if (action) {
            switch (action) {
                case 'clear':
                    expressionEl.value = '';
                    parser.clear(); // Clear parser memory (variables)
                    break;
                case 'backspace':
                    expressionEl.value = expressionEl.value.slice(0, -1);
                    break;
                case 'equals':
                    // The calculate() call below handles the final calculation
                    break;
            }
        }

        // Recalculate after every button press that modifies the expression
        calculate();
    });

    // Initial calculation on load
    calculate();
});
