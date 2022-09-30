/**
 * Подгружает все перехватчики событий, необходима для корректной работы анимаций
 */
const pageLoading = () => {
    document.getElementById('randomizer-window-right__item_options').addEventListener("click", moreOptionsBlockTransition);
    document.getElementById('randomizer-window-right__item_options_animation').addEventListener("click", moreOptionsBlockTransition);
    document.getElementById('randomizer-window-right__item_info').addEventListener("click", infoBlockTransition);
    document.getElementById('allowFractional').addEventListener('click', charactersAfterPermission)
    document.getElementById('importAs').addEventListener('click', allowChoosingType);
    document.getElementById('oddOnlyCheckbox').addEventListener('click', oddOnlyCheck);
    document.getElementById('evenOnlyCheckbox').addEventListener('click', evenOnlyCheck);
    document.getElementById('leftBorder').addEventListener('keydown', correctInputPermission);
    document.getElementById('rightBorder').addEventListener('keydown', correctInputPermission);
    document.getElementById('numbersAmount').addEventListener('keydown', correctInputPermission);
    document.getElementById('charactersAfter').addEventListener('keydown', correctInputPermission);
}


let showInfoPosition = 0;


/**
 * Открывает/закрывает блок информации рандомайзера
 */
const infoBlockTransition = () => {
    let animationTrigger = document.getElementById('randomizer-window-right__item_info');
    let infoBlock = document.getElementById('randomizer-info');

    animationTrigger.removeEventListener("click", infoBlockTransition);

    if (showInfoPosition) {
        showInfoPosition = 0;
        animationTrigger.classList.add('info-animation_hide');
        infoBlock.classList.add('info-animation_hide_content');

        setTimeout(() => {
            animationTrigger.classList.remove('info-animation_hide');
            animationTrigger.classList.remove('info-animation_show');

            infoBlock.classList.remove('info-animation_hide_content');
            infoBlock.classList.remove('info-animation_show_content');
            animationTrigger.addEventListener("click", infoBlockTransition);
        }, 1000);
        return;
    }

    showInfoPosition = 1;
    animationTrigger.classList.add('info-animation_show');
    infoBlock.classList.add('info-animation_show_content');
    setTimeout(() => {
        animationTrigger.addEventListener("click", infoBlockTransition);
    }, 1000);
}


let showMoreOptionsPosition = 0;


/**
 * Открывает/закрывает блок дополнительных функций рандомайзера
 */
const moreOptionsBlockTransition = () => {
    let animationTrigger = document.getElementById('randomizer-window-right__item_options');
    let animatedObject = document.getElementById('randomizer-window-right__item_options_animation');
    let optionsBlock = document.getElementById('randomizer-window-center');
    let overflowElements = document.getElementsByClassName('overflow-elements');

    animationTrigger.removeEventListener("click", moreOptionsBlockTransition);
    animatedObject.removeEventListener("click", moreOptionsBlockTransition);

    if (showMoreOptionsPosition) {
        showMoreOptionsPosition = 0;
        animatedObject.classList.add('options-animation_hide');


        optionsBlock.style.maxHeight = null;

        for (let i = 0; i < overflowElements.length; i++) {
            overflowElements[i].style.opacity = '0';
        }

        setTimeout(() => {
            animatedObject.classList.remove('options-animation_hide');
            animatedObject.classList.remove('options-animation_show');

            animationTrigger.addEventListener("click", moreOptionsBlockTransition);
            animatedObject.addEventListener("click", moreOptionsBlockTransition);
        }, 1000);
        return;
    }


    optionsBlock.style.maxHeight = optionsBlock.scrollHeight + "px";
    showMoreOptionsPosition = 1;
    animatedObject.classList.add('options-animation_show');

    for (let i = 0; i < overflowElements.length; i++) {
        overflowElements[i].style.opacity = '1';
    }

    setTimeout(() => {
        animationTrigger.addEventListener("click", moreOptionsBlockTransition);
        animatedObject.addEventListener("click", moreOptionsBlockTransition);

    }, 1000);
}


/**
 * Функция, отвечающая за смену контента внутри главного окна рандомайзера
 *
 * @param disappearingWindowId идентификатор блока контента, расположенного в окне рандомайзера
 * @param appearingWindowId идентификатор блока контента, который появится в окне рандомайзера
 */
const windowTransition = (disappearingWindowId, appearingWindowId) => {
    let disappearingWindow = document.getElementById(disappearingWindowId);
    let appearingWindow = document.getElementById(appearingWindowId);

    disappearingWindow.classList.add(disappearingWindowId + '-animation_hide');
    setTimeout(() => {
        disappearingWindow.style.opacity = '0';
        disappearingWindow.classList.remove(disappearingWindowId + '-animation_hide');
    }, 1000)

    appearingWindow.classList.add(disappearingWindowId + '-animation_show');
    setTimeout(() => {
        appearingWindow.style.opacity = '1';
        appearingWindow.classList.remove(disappearingWindowId + '-animation_show');
        disappearingWindow.style.zIndex = '2';
        appearingWindow.style.zIndex = '7';
    }, 1300)

}


/**
 * Запрещает пользователю нажатие всех кнопок путём появления невидимого блока над ними
 */
const invisibleWindowTransition = (windowShowBool) => {
    let invisibleWindow = document.getElementById('invisibleWindow');
    if (windowShowBool) {
        invisibleWindow.style.zIndex = '8';
        return;
    }
    invisibleWindow.style.zIndex = '1';
}


let errorBlockPosition = 0;


/**
 * Отвечает за добавление класса анимации движения блоку ошибок
 */
const errorBlockAnimation = (errorBlockShowingBool) => {
    let errorBlock = document.getElementById('randomizerErrors');

    if (errorBlockPosition && !errorBlockShowingBool) {
        errorBlockPosition = 0;
        errorBlock.classList.add('randomizerErrors-animation_hide_content');

        setTimeout(() => {
            errorBlock.classList.remove('randomizerErrors-animation_hide_content');
            errorBlock.classList.remove('randomizerErrors-animation_show');
        }, 1000);
        return;
    }
    if (!errorBlockPosition && errorBlockShowingBool) {
        errorBlockPosition = 1;
        errorBlock.classList.add('randomizerErrors-animation_show');
    }
}


/**
 * Прячет все второстепенные блоки перед началом вычислений
 */
const closingSecondaryBlocks = () => {
    if (showMoreOptionsPosition) {
        moreOptionsBlockTransition();
    }

    if (showInfoPosition) {
        infoBlockTransition();
    }

    if (errorBlockPosition) {
        errorBlockAnimation(0);
    }
}


/**
 * Возвращает пользователя на главный экран для редактирования параметров генерации
 */
const editSettings = () => {
    windowTransition('resultWindow', 'mainWindow');
}