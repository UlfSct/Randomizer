/**
 * Отвечает за последовательное выполнение функций отработки ошибок, генерации чисел и
 * вывода их на экран, при необходимости прерывается
 *
 * @param boolRepeat Булева переменная, отвечающая за повторную отработку алгоритмов
 */
const generateButtonReaction = (boolRepeat) => {
    invisibleWindowTransition(1);

    let leftBorder = Number(document.getElementById('leftBorder').value);
    let rightBorder = Number(document.getElementById('rightBorder').value);
    let numbersAmount = Number(document.getElementById('numbersAmount').value);

    let noRepeat = document.getElementById('noRepeat').checked;
    let sortingResult = document.getElementById('sortingResult').checked;

    let oddOnly = document.getElementById('oddOnly').checked;
    let evenOnly = document.getElementById('evenOnly').checked;
    let allowFractional = document.getElementById('allowFractional').checked;
    let charactersAfter = Number(document.getElementById('charactersAfter').value);

    let errorArray = errorsCheck(leftBorder, rightBorder, numbersAmount, noRepeat,
        oddOnly, evenOnly, allowFractional, charactersAfter);

    for (let i = 0; i < errorArray.length; i++) {
        if (errorArray[i]) {
            let timeout = 0;

            if (errorBlockPosition) {
                errorBlockAnimation(0);
                timeout = 1000;
            }

            setTimeout(() => {
                errorBlockProcessing(errorArray);
                invisibleWindowTransition(0);
            }, timeout)

            return;
        }
    }

    manipulationsCounting(leftBorder, rightBorder, numbersAmount, noRepeat, oddOnly, evenOnly);

    closingSecondaryBlocks();

    if (boolRepeat) {
        windowTransition('resultWindow', 'loadingWindow');
    } else {
        windowTransition('mainWindow', 'loadingWindow');
    }

    setTimeout(() => {
        let result = numbersGeneration(leftBorder, rightBorder, numbersAmount, noRepeat,
            oddOnly, evenOnly, allowFractional, charactersAfter, sortingResult);

        let importAs = document.getElementById('importAs').checked;
        if (importAs) {
            let importAsSelect = document.getElementById('importAsSelect').value;

            switch (importAsSelect) {
                case '.txt':
                {
                    txtFileGeneration(result);
                    break;
                }
                case '.xls':
                {
                    xlsFileGeneration(result);
                    break;
                }
            }
        }


        let resultInput = document.getElementById('resultInput');
        resultInput.innerHTML = '';
        resultInput.innerHTML += result;

        let resultInputParameters = document.getElementById('resultInputParameters');
        resultInputParameters.innerHTML = '';
        resultInputParameters.innerHTML += '<a class="lato-black">Ваш результат:</a><br>';
        resultInputParameters.innerHTML += `<a class="lato-black">${numbersAmount}</a> чисел от <a class="lato-black">` +
            `${leftBorder}</a> до <a class="lato-black">${rightBorder}</a>`;


        windowTransition('loadingWindow', 'resultWindow');
        invisibleWindowTransition(0);

    }, 1600)


}


/**
 * Генерирует массив по заданным параметрам и возвращает его
 *
 * @param leftBorder левая граница диапазона рандомайзера.
 * @param rightBorder правая граница диапазона рандомайзера.
 * @param numbersAmount количество генерируемых чисел.
 * @param noRepeat булева переменная, отвечает за наличие повторных чисел.
 * @param oddOnly булева переменная, отвечает за наличие только нечётных чисел.
 * @param evenOnly булева переменная, отвечает за наличие только чётных чисел.
 * @param allowFractional булева переменная, отвечает за наличие дробных чисел.
 * @param charactersAfter количество знаков после запятой.
 * @param sortingResult булева переменная, отвечает за сортировку результата
 *
 * @returns возвращает сгенерированный массив
 */
const numbersGeneration = (leftBorder, rightBorder, numbersAmount, noRepeat,
                           oddOnly, evenOnly, allowFractional, charactersAfter, sortingResult) => {
    let result;

    if (allowFractional) {
        result = fractionalGeneration(leftBorder, rightBorder, numbersAmount, noRepeat, charactersAfter);
    } else {
        result = integerGeneration(leftBorder, rightBorder, numbersAmount, noRepeat, oddOnly, evenOnly);
    }

    if (sortingResult) {
        result.sort((a, b) => a - b);
    }

    result.forEach((value, index, array) => {
        if (value === 0) array[index] = 0;
    });

    if (allowFractional) {
        for (let i = 0; i < result.length; i++) {
            result[i] = result[i].toFixed(charactersAfter);
        }

    }

    result = result.join(' ');

    return result;
}


/**
 * Генерирует массив случайных целых чисел по заданным параметрам
 *
 * @param leftBorder левая граница интервала генерации
 * @param rightBorder правая граница интервала генерации
 * @param numbersAmount количество генерируемых чисел
 * @param noRepeat булева переменная, отвечающая за генерацию различных чисел
 * @param oddOnly булева переменная, отвечающая за генерацию только нечётных чисел
 * @param evenOnly булева переменная, отвечающая за генерацию только чётных чисел
 *
 * @returns Возвращает массив сгенерированных чисел
 */
const integerGeneration = (leftBorder, rightBorder, numbersAmount, noRepeat, oddOnly, evenOnly) => {
    let result = [];

    if (noRepeat) {
        let possibleResults = [];

        for (let i = leftBorder; i <= rightBorder; i++) {
            if (evenOnly && i % 2 === 1) {
                continue;
            }

            if (oddOnly && i % 2 === 0) {
                continue;
            }

            possibleResults.push(i);
        }

        for (let i = 0; i < numbersAmount; i++) {
            let randomNumber = Math.round(Math.random() * (possibleResults.length) - 0.5);
            let singleResult = possibleResults.splice(randomNumber, 1)[0];

            result.push(singleResult);
        }

    } else {
        for (let i = 0; i < numbersAmount;) {
            let randomNumber = Math.round(Math.random() * (rightBorder - leftBorder + 1) + leftBorder - 0.5);

            if (evenOnly && randomNumber % 2 === 1) {
                continue;
            }

            if (oddOnly && randomNumber % 2 === 0) {
                continue;
            }

            result.push(randomNumber);
            i++
        }
    }

    return result;
}


/**
 * Генерирует массив случайных дробных чисел по заданным параметрам
 *
 * @param leftBorder левая граница интервала генерации
 * @param rightBorder правая граница интервала генерации
 * @param numbersAmount количество генерируемых чисел
 * @param noRepeat булева переменная, отвечающая за генерацию различных чисел
 * @param charactersAfter количество знаков после запятой
 *
 * @returns Возвращает массив сгенерированных чисел
 */
const fractionalGeneration = (leftBorder, rightBorder, numbersAmount, noRepeat, charactersAfter) => {
    let result = [];
    leftBorder *= Math.pow(10, charactersAfter);
    rightBorder *= Math.pow(10, charactersAfter);
    
    if (noRepeat) {
        if (rightBorder - leftBorder > 40000) {
            for (let i = 0; i < numbersAmount;) {
                let randomNumber = Math.round(Math.random() * (rightBorder - leftBorder + 1) + leftBorder - 0.5) /
                    Math.pow(10, charactersAfter);

                if (result.includes(randomNumber)) continue;

                result.push(randomNumber);
                i++
            }
        } else {
            let possibleResults = [];

            for (let i = leftBorder; i <= rightBorder; i++) {
                possibleResults.push(i);
            }

            for (let i = 0; i < numbersAmount; i++) {
                let randomNumber = Math.round(Math.random() * (possibleResults.length) - 0.5);

                let singleResult = possibleResults.splice(randomNumber, 1)[0] ;
                singleResult /= Math.pow(10, charactersAfter);

                result.push(singleResult);
            }
        }

    } else {
        for (let i = 0; i < numbersAmount; i++) {
            let randomNumber = Math.round(Math.random() * (rightBorder - leftBorder + 1) + leftBorder - 0.5) /
                Math.pow(10, charactersAfter);
            result.push(randomNumber);
        }
    }

    return result;
}


/**
 * Подсчитывает максимальное количество действий, нужное для подсчёта случайного числа путём подбрасывания монетки
 * и выводит результат на экран загрузки
 *
 * @param leftBorder левая граница интервала генерации
 * @param rightBorder правая граница интервала генерации
 * @param numbersAmount количество генерируемых чисел
 * @param noRepeat булева переменная, отвечающая за генерацию различных чисел
 * @param oddOnly булева переменная, отвечающая за генерацию только нечётных чисел
 * @param evenOnly булева переменная, отвечающая за генерацию только чётных чисел
 */
const manipulationsCounting = (leftBorder, rightBorder, numbersAmount, noRepeat, oddOnly, evenOnly) => {
    let num = rightBorder - leftBorder;
    if (oddOnly || evenOnly) num /= 2;

    let noRepeatFactor = 1;

    if (noRepeat) {
        noRepeatFactor = 2
    }

    let tmp = Math.ceil(num / noRepeatFactor);
    let singleIterationsNumber = 0;

    while (tmp > 0) {
        singleIterationsNumber += Math.floor(tmp);
        tmp /= 2;
    }

    num *= singleIterationsNumber * numbersAmount;

    let outputText = document.getElementById('loadingText');

    outputText.innerHTML = '';
    outputText.innerHTML += `Подбрасываем монетку ${num}`;

    if (num % 10 === 0 || num % 10 === 1 || num % 10 === 5 || (num % 100 > 10 && num % 100 < 20)) {
        outputText.innerHTML += ' раз';
    } else {
        outputText.innerHTML += ' раза';
    }
}


/**
 * Создаёт и отдаёт пользователю ответ в формате .txt
 *
 * @param resultString ответ в виде строки
 */
const txtFileGeneration = (resultString) => {
    let blob = new Blob([resultString],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, "txtResult.txt");
}


/**
 * Создаёт и отдаёт пользователю ответ в формате .xlsx
 *
 * @param resultString ответ в виде строки
 */
const xlsFileGeneration = (resultString) => {
    let result = resultString.split(' ');
    let tableSelect = document.getElementById('xlsxTable');
    let innerContent = "";

    tableSelect.innerHTML = '';

    for (let i = 0; i < result.length; i++) {
        innerContent += "<tr><td>" + result[i] + "</tr></td>";
    }

    tableSelect.innerHTML += innerContent;


    let filename = "xlsResult";

    let downloadLink;
    let dataType = 'application/vnd.ms-excel';
    let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);


    // Create a link to the file
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();

}


/**
 * Позволяет пользователю скопировать получившийся результат в буфер обмена
 */
const copyGeneratedNumbers = () => {
    let output = document.getElementById("resultInput").innerHTML;
    window.navigator.clipboard.writeText(output)
        .then(r => {
            console.log(r)
        });
}