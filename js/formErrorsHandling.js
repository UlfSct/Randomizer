/**
 * Возвращает массив наличия ошибок (если ошибка существует, то значение 1, если нет - 0)
 *
 * @param leftBorder левая граница диапазона рандомайзера.
 * @param rightBorder правая граница диапазона рандомайзера.
 * @param numbersAmount количество генерируемых чисел.
 * @param noRepeat булева переменная, отвечает за наличие повторных чисел.
 * @param oddOnly булева переменная, отвечает за наличие только нечётных чисел.
 * @param evenOnly булева переменная, отвечает за наличие только чётных чисел.
 * @param allowFractional булева переменная, отвечает за наличие дробных чисел.
 * @param charactersAfter количество знаков после запятой.
 *
 * @returns возвращает массив наличия ошибок
 * (последний элемент - допустимое количество генерируемых чисел для рандомайзера)
 */
const errorsCheck = (leftBorder, rightBorder, numbersAmount, noRepeat,
                     oddOnly, evenOnly, allowFractional, charactersAfter) => {
    let errorArray = [0, 0, 0, 0, 0, 0, 0];
    let possibleNumbersAmount = rightBorder - leftBorder + 1;

    if (allowFractional) possibleNumbersAmount = possibleNumbersAmount * Math.pow(10, charactersAfter) - 9;

    // errorArray[0]: отрицательная разница правого и левого диапазонов
    if (possibleNumbersAmount < 0) errorArray[0] = 1;

    // errorArray[1]: Превышение максимальных допустимых параметров диапазона
    if (leftBorder < -999999 || rightBorder > 999999 || charactersAfter > 8 || numbersAmount > 10000) errorArray[1] = 1;

    // errorArray[2]: Превышение лимита генерации чисел при "без повторов"
    // errorArray[3]: Максимальное допустимое количество чисел
    if (noRepeat) {
        if (possibleNumbersAmount < numbersAmount) {
            errorArray[2] = 1;
            errorArray[3] = possibleNumbersAmount;
        }
        if ((evenOnly || oddOnly) && possibleNumbersAmount / 2 < numbersAmount) {
            errorArray[2] = 1;
            errorArray[3] = Math.floor(possibleNumbersAmount / 2);
        }
    }

    // errorArray[4]: Дробные числа не могут иметь чётность
    if (allowFractional && (oddOnly || evenOnly)) errorArray[4] = 1;

    // errorArray[5]: numbersAmount = 0
    if (numbersAmount === 0) errorArray[5] = 1;

    // errorArray[6]: в данном диапазоне нет чисел выбранной чётности
    if (oddOnly && leftBorder - rightBorder === 0 && leftBorder % 2 === 0 ||
        evenOnly && leftBorder - rightBorder === 0 && leftBorder % 2 === 1) errorArray[6] = 1;

    return errorArray;
}


/**
 * Отвечает за вывод на экран пользователю всех ошибок ввода
 * @param errorArray булев массив наличия ошибок из функции errorCheck
 * (последний элемент - допустимое количество генерируемых чисел для рандомайзера)
 */
const errorBlockProcessing = (errorArray) => {
    let errorBlockText = document.getElementById('randomizerErrorsText');

    errorBlockText.innerHTML = '';

    let previousErrorExists = 0;

    if (errorArray[2] && errorArray[3]) {
        errorBlockText.innerHTML += '• при выбранных настройках невозможно сгенерировать ' +
            ((errorArray[3] > 0) ? `более ${errorArray[3]}` : 'ни одного числа');
        if (errorArray[3] > 0 && errorArray[3] % 10 === 1 && errorArray[3] % 100 !== 11) {
            errorBlockText.innerHTML += ' числа';
        } else if (errorArray[3] > 0) {
            errorBlockText.innerHTML += ' чисел';
        }
        previousErrorExists = 1;
    }

    if (errorArray[0]) {
        if (previousErrorExists) errorBlockText.innerHTML += "<br>";
        errorBlockText.innerHTML += `• левая граница диапазона не может быть больше правой`;
        previousErrorExists = 1;
    }

    if (errorArray[1]) {
        if (previousErrorExists) errorBlockText.innerHTML += "<br>";
        errorBlockText.innerHTML += `• превышены максимальные допустимые значения параметров`;
        if (!showInfoPosition) {
            infoBlockTransition();
        }
    }

    if (errorArray[4]) {
        if (previousErrorExists) errorBlockText.innerHTML += "<br>";
        errorBlockText.innerHTML += `• Невозможно выбрать чётность для дробных чисел`;
        if (!showInfoPosition) {
            infoBlockTransition();
        }
    }

    if (errorArray[5]) {
        if (previousErrorExists) errorBlockText.innerHTML += "<br>";
        errorBlockText.innerHTML += `• Бесполезно генерировать 0 чисел`;
        if (!showInfoPosition) {
            infoBlockTransition();
        }
    }

    if (errorArray[6]) {
        if (previousErrorExists) errorBlockText.innerHTML += "<br>";
        errorBlockText.innerHTML += `• В данном диапазоне нет чисел выбранной чётности`;
        if (!showInfoPosition) {
            infoBlockTransition();
        }
    }

    errorBlockAnimation(1);
}


/**
 * Снимает отметку с "только нечётные" при нажатии на "только чётные", если ранее она присутствовала
 */
const evenOnlyCheck = () => {
    let evenOnlyCheckbox = document.getElementById('evenOnly');
    let oddOnlyCheckbox = document.getElementById('oddOnly');
    setTimeout(() => {
        if (evenOnlyCheckbox.checked && oddOnlyCheckbox.checked) oddOnlyCheckbox.checked = false;
    }, 10)

}


/**
 * Снимает отметку с "только чётные" при нажатии на "только нечётные", если ранее она присутствовала
 */
const oddOnlyCheck = () => {
    let evenOnlyCheckbox = document.getElementById('evenOnly');
    let oddOnlyCheckbox = document.getElementById('oddOnly');

    setTimeout(() => {
        if (evenOnlyCheckbox.checked && oddOnlyCheckbox.checked) evenOnlyCheckbox.checked = false;
    }, 10)
}


/**
 * Разрешает/запрещает выбрать количество знаков после запятой
 */
const charactersAfterPermission = () => {
    let allowFractionalCheckbox = document.getElementById('allowFractional');
    let charactersAfterInput = document.getElementById('charactersAfter');
    let charactersAfterLabel = document.getElementById('charactersAfterLabel');

    if (allowFractionalCheckbox.checked) {
        charactersAfterInput.disabled = false;
        charactersAfterLabel.style.color = '#000';
        return;
    }

    charactersAfterLabel.style.color = '#949494';
    charactersAfterInput.disabled = true;
}


/**
 * Разрешает/запрещает выбрать формат импортирования по нажатию чекбокса
 */
const allowChoosingType = () => {
    let importAsCheckbox = document.getElementById('importAs');
    let importAsSelect = document.getElementById('importAsSelect');

    if (importAsCheckbox.checked) {
        importAsSelect.disabled = false;
        return;
    }

    importAsSelect.disabled = true;

}

/**
 * Позволяет избегать попадания неправильных символов в поле ввода
 *
 * @param e
 */
const correctInputPermission = (e) => {
    //TODO: УБРАТЬ НАХУЙ БУКВУ Е И ТОЧКУ ИЗ МОЕЙ ЖИЗНИ

}

