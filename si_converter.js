document.addEventListener('DOMContentLoaded', () => {

    const siPrefixes = [
        { exp: 24, name: 'Yotta', symbol: 'Y' },
        { exp: 21, name: 'Zetta', symbol: 'Z' },
        { exp: 18, name: 'Exa', symbol: 'E' },
        { exp: 15, name: 'Peta', symbol: 'P' },
        { exp: 12, name: 'Tera', symbol: 'T' },
        { exp: 9, name: 'Giga', symbol: 'G' },
        { exp: 6, name: 'Mega', symbol: 'M' },
        { exp: 3, name: 'Kilo', symbol: 'k' },
        { exp: 2, name: 'Hecto', symbol: 'h' },
        { exp: 1, name: 'Deca', symbol: 'da' },
        { exp: 0, name: '-', symbol: '-' },
        { exp: -1, name: 'deci', symbol: 'd' },
        { exp: -2, name: 'centi', symbol: 'c' },
        { exp: -3, name: 'milli', symbol: 'm' },
        { exp: -6, name: 'micro', symbol: 'μ' },
        { exp: -9, name: 'nano', symbol: 'n' },
        { exp: -12, name: 'pico', symbol: 'p' },
        { exp: -15, name: 'femto', symbol: 'f' },
        { exp: -18, name: 'atto', symbol: 'a' },
        { exp: -21, name: 'zepto', symbol: 'z' },
        { exp: -24, name: 'yocto', symbol: 'y' },
    ];

    const input = document.getElementById('exponent-input');
    const resultContainer = document.getElementById('result-container');
    const table = document.getElementById('prefix-table');

    // Function to generate the prefix table
    function generateTable() {
        let tableHTML = '<thead><tr><th>指数 (10^N)</th><th>名称</th><th>記号</th></tr></thead><tbody>';
        siPrefixes.forEach(p => {
            if (p.exp !== 0) { // Don't show the base unit in the table
                tableHTML += `<tr><td>${p.exp}</td><td>${p.name}</td><td>${p.symbol}</td></tr>`;
            }
        });
        tableHTML += '</tbody>';
        table.innerHTML = tableHTML;
    }

    // Function to format large numbers with commas
    function formatNumber(exp) {
        if (exp === 0) return '1';
        let numStr = '1';
        if (exp > 0) {
            numStr = '1'.padEnd(exp + 1, '0');
            let parts = [];
            for (let i = numStr.length; i > 0; i -= 3) {
                parts.unshift(numStr.substring(Math.max(0, i - 3), i));
            }
            return parts.join(',');
        } else { // exp < 0
            numStr = '0.' + '0'.repeat(Math.abs(exp) - 1) + '1';
            return numStr;
        }
    }

    // Function to update the result
    function updateResult() {
        const exp = parseInt(input.value, 10);
        if (isNaN(exp)) {
            resultContainer.innerHTML = '<p>数値を入力してください。</p>';
            return;
        }

        const prefix = siPrefixes.find(p => p.exp === exp);

        if (prefix) {
            const formattedNum = formatNumber(exp);
            resultContainer.innerHTML = `
                <h3>${prefix.name} (${prefix.symbol})</h3>
                <p>${formattedNum}</p>
            `;
        } else {
            resultContainer.innerHTML = '<p>対応する接頭語が見つかりません。</p>';
        }
    }

    // Initial setup
    generateTable();
    resultContainer.innerHTML = '<p>上に指数を入力すると、対応する接頭語と数値が表示されます。</p>';
    input.addEventListener('input', updateResult);

    // --- Part 2: Number to SI Prefix Conversion ---
    const numberInput = document.getElementById('number-input');
    const numberResultContainer = document.getElementById('number-result-container');

    const siPrefixMap = new Map(siPrefixes.map(p => [p.exp, p.symbol]));

    function numberToSi(num) {
        if (isNaN(num) || num === 0) {
            return '...';
        }

        const exponent = Math.floor(Math.log10(Math.abs(num)));
        const siExponent = Math.floor(exponent / 3) * 3;
        
        const symbol = siPrefixMap.get(siExponent);

        if (symbol) {
            const coefficient = num / Math.pow(10, siExponent);
            // Round to a reasonable number of decimal places
            const roundedCoefficient = Math.round(coefficient * 1000) / 1000;
            return `${roundedCoefficient} ${symbol}`;
        } else {
            // For numbers outside the main range, use scientific notation
            return num.toExponential(2).replace('e', ' x 10^');
        }
    }

    function updateNumberResult() {
        const val = parseFloat(numberInput.value);
        if (numberInput.value.trim() === '' || isNaN(val)) {
            numberResultContainer.innerHTML = '...';
            return;
        }
        numberResultContainer.textContent = numberToSi(val);
    }

    numberInput.addEventListener('input', updateNumberResult);
    numberResultContainer.innerHTML = '数値を入力してください。';
});
