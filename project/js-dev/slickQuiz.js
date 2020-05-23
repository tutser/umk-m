/*!
 * SlickQuiz jQuery Plugin
 * http://github.com/jewlofthelotus/SlickQuiz
 *
 * @updated October 25, 2014
 * @version 1.5.20
 *
 * @author Julie Cameron - http://www.juliecameron.com
 * @copyright (c) 2013 Quicken Loans - http://www.quickenloans.com
 * @license MIT
 */

(function($){
    $.slickQuiz = function(element, options) {
        var plugin   = this,
            $element = $(element),
            _element = '#' + $element.attr('id'),

            defaults = {
                checkAnswerText:  'Проверить ответы!',
                nextQuestionText: 'Следующий вопрос',
                backButtonText: 'Вернуться назад ',
                completeQuizText: 'Закончить тест',
                tryAgainText: 'Попробовать снова',
                questionCountText: 'Вопрос %current из %total',
                preventUnansweredText: 'Вы должны выбрать хотя бы один ответ.',
                questionTemplateText:  '%count. %text',
                scoreTemplateText: '%score / %total',
                nameTemplateText:  '<span></span>%name',
                skipStartButton: false, // не показывать кнопку начала теста
                numberOfQuestions: null,
                randomSortQuestions: false, // случайно сортировать вопросы
                randomSortAnswers: false, // случайно сортировать ответы
                preventUnanswered: true, // предупреждать о "без ответа"  (модальное окно)
                disableScore: false, // выключить результаты
                disableRanking: false,
                scoreAsPercentage: false, // результат в процентах
                perQuestionResponseMessaging: false, // включить ответы на вопрос
                perQuestionResponseAnswers: false,
                completionResponseMessaging: false,
                displayQuestionCount: true,   // показывать количество вопросов
                displayQuestionNumber: true,  // показывать номера вопросов
                animationCallbacks: { // only for the methods that have jQuery animations offering callback
                    setupQuiz: function () {},
                    startQuiz: function () {},
                    resetQuiz: function () {},
                    checkAnswer: function () {},
                    nextQuestion: function () {},
                    backToQuestion: function () {},
                    completeQuiz: function () {}
                },
                events: {
                    onStartQuiz: function (options) {},
                    onCompleteQuiz: function (options) {}  // reserved: options.questionCount, options.score
                }
            },

            // Названия классов для css (Используется для построения викторины и для селекторов)
            questionCountClass     = 'questionCount',
            questionGroupClass     = 'questions',
            questionClass          = 'question',
            answersClass           = 'answers',
            responsesClass         = 'responses',
            completeClass          = 'complete',
            correctClass           = 'correctResponse',
            incorrectClass         = 'incorrectResponse',
            correctResponseClass   = 'correct',
            incorrectResponseClass = 'incorrect',
            checkAnswerClass       = 'checkAnswer',
            nextQuestionClass      = 'nextQuestion',
            lastQuestionClass      = 'lastQuestion',
            backToQuestionClass    = 'backToQuestion',
            tryAgainClass          = 'tryAgain',

            // Sub-Quiz / Селекторы классов подвопросов
            _questionCount         = '.' + questionCountClass,
            _questions             = '.' + questionGroupClass,
            _question              = '.' + questionClass,
            _answers               = '.' + answersClass,
            _answer                = '.' + answersClass + ' li',
            _responses             = '.' + responsesClass,
            _response              = '.' + responsesClass + ' li',
            _correct               = '.' + correctClass,
            _correctResponse       = '.' + correctResponseClass,
            _incorrectResponse     = '.' + incorrectResponseClass,
            _checkAnswerBtn        = '.' + checkAnswerClass,
            _nextQuestionBtn       = '.' + nextQuestionClass,
            _prevQuestionBtn       = '.' + backToQuestionClass,
            _tryAgainBtn           = '.' + tryAgainClass,

            // Селекторы класса элементов викторины верхнего уровня
            _quizStarter           = _element + ' .startQuiz',
            _quizName              = _element + ' .quizName',
            _quizArea              = _element + ' .quizArea',
            _quizResults           = _element + ' .quizResults',
            _quizResultsCopy       = _element + ' .quizResultsCopy',
            _quizHeader            = _element + ' .quizHeader',
            _quizScore             = _element + ' .quizScore',
            _quizLevel             = _element + ' .quizLevel',

            // Top Level Quiz Element Objects
            $quizStarter           = $(_quizStarter),
            $quizName              = $(_quizName),
            $quizArea              = $(_quizArea),
            $quizResults           = $(_quizResults),
            $quizResultsCopy       = $(_quizResultsCopy),
            $quizHeader            = $(_quizHeader),
            $quizScore             = $(_quizScore),
            $quizLevel             = $(_quizLevel)
        ;


        // Reassign user-submitted deprecated options Переназначить отправленные пользователем устаревшие параметры
        var depMsg = '';

        if (options && typeof options.disableNext != 'undefined') {
            if (typeof options.preventUnanswered == 'undefined') {
                options.preventUnanswered = options.disableNext;
            }
            depMsg += 'The \'disableNext\' option has been deprecated, please use \'preventUnanswered\' in it\'s place.\n\n';
        }

        if (options && typeof options.disableResponseMessaging != 'undefined') {
            if (typeof options.preventUnanswered == 'undefined') {
                options.perQuestionResponseMessaging = options.disableResponseMessaging;
            }
            depMsg += 'The \'disableResponseMessaging\' option has been deprecated, please use' +
                      ' \'perQuestionResponseMessaging\' and \'completionResponseMessaging\' in it\'s place.\n\n';
        }

        if (options && typeof options.randomSort != 'undefined') {
            if (typeof options.randomSortQuestions == 'undefined') {
                options.randomSortQuestions = options.randomSort;
            }
            if (typeof options.randomSortAnswers == 'undefined') {
                options.randomSortAnswers = options.randomSort;
            }
            depMsg += 'The \'randomSort\' option has been deprecated, please use' +
                      ' \'randomSortQuestions\' and \'randomSortAnswers\' in it\'s place.\n\n';
        }

        if (depMsg !== '') {
            if (typeof console != 'undefined') {
                console.warn(depMsg);
            } else {
                alert(depMsg);
            }
        }
        // End of deprecation reassignment


        plugin.config = $.extend(defaults, options);

        // Установить с помощью опции json или переменной quizJSON (смотри slickQuiz-config.js)
        var quizValues = (plugin.config.json ? plugin.config.json : typeof quizJSON != 'undefined' ? quizJSON : null);

        // Получить вопросы, возможно, отсортированы случайным образом
        var questions = plugin.config.randomSortQuestions ?
                        quizValues.questions.sort(function() { return (Math.round(Math.random())-0.5); }) :
                        quizValues.questions;

        // Подсчитайте количество вопросов
        var questionCount = questions.length;

        // Выберите X количество вопросов для загрузки, если заданы параметры
        if (plugin.config.numberOfQuestions && questionCount >= plugin.config.numberOfQuestions) {
            questions = questions.slice(0, plugin.config.numberOfQuestions);
            questionCount = questions.length;
        }

        // некоторые специальные частные / внутренние методы
        var internal = {method: {
            // get a key whose notches are "resolved jQ deferred" objects; one per notch on the key
            // think of the key as a house key with notches on it
            getKey: function (notches) { // returns [], notches >= 1
                var key = [];
                for (i=0; i<notches; i++) key[i] = $.Deferred ();
                return key;
            },

            // put the key in the door, if all the notches pass then you can turn the key and "go"
            turnKeyAndGo: function (key, go) { // key = [], go = function ()
                // when all the notches of the key are accepted (resolved) then the key turns and the engine (callback/go) starts
                $.when.apply (null, key). then (function () {
                    go ();
                });
            },

            // get one jQ
            getKeyNotch: function (key, notch) { // notch >= 1, key = []
                // key has several notches, numbered as 1, 2, 3, ... (no zero notch)
                // we resolve and return the "jQ deferred" object at specified notch
                return function () {
                    key[notch-1].resolve (); // it is ASSUMED that you initiated the key with enough notches
                };
            }
        }};

        plugin.method = {
            // Устанавливает вопросы и ответы на основе вышеуказанного массива
            setupQuiz: function(options) { // use 'options' object to pass args
                var key, keyNotch, kN;
                key = internal.method.getKey (3); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                $quizName.hide().html(plugin.config.nameTemplateText
                    .replace('%name', quizValues.info.name) ).fadeIn(1000, kN(key,1));
                $quizHeader.hide().prepend($('<div class="quizDescription">' + quizValues.info.main + '</div>')).fadeIn(1000, kN(key,2));
                $quizResultsCopy.append(quizValues.info.results);

                // добавить кнопку повтора в просмотр результатов, если она включена
                if (plugin.config.tryAgainText && plugin.config.tryAgainText !== '') {
                    $quizResultsCopy.append('<p><a class="button ' + tryAgainClass + '" href="#">' + plugin.config.tryAgainText + '</a></p>');
                }

                // Setup questions
                var quiz  = $('<ol class="' + questionGroupClass + '"></ol>'),
                    count = 1;

                // Loop through questions object
                for (i in questions) {
                    if (questions.hasOwnProperty(i)) {
                        var question = questions[i];

                        var questionHTML = $('<li class="' + questionClass +'" id="question' + (count - 1) + '"></li>');

                        if (plugin.config.displayQuestionCount) {
                            questionHTML.append('<div class="' + questionCountClass + '">' +
                                plugin.config.questionCountText
                                    .replace('%current', '<span class="current">' + count + '</span>')
                                    .replace('%total', '<span class="total">' +
                                        questionCount + '</span>') + '</div>');
                        }

                        var formatQuestion = '';
                        if (plugin.config.displayQuestionNumber) {
                            formatQuestion = plugin.config.questionTemplateText
                                .replace('%count', count).replace('%text', question.q);
                        } else {
                            formatQuestion = question.q;
                        }
                        questionHTML.append('<h3>' + formatQuestion + '</h3>');

                        // Count the number of true values
                        var truths = 0;
                        for (i in question.a) {
                            if (question.a.hasOwnProperty(i)) {
                                answer = question.a[i];
                                if (answer.correct) {
                                    truths++;
                                }
                            }
                        }

                        // Теперь давайте добавим ответы с флажками или радио в зависимости от количества истин
                        var answerHTML = $('<ul class="' + answersClass + '"></ul>');

                        // Получить ответы
                        var answers = plugin.config.randomSortAnswers ?
                            question.a.sort(function() { return (Math.round(Math.random())-0.5); }) :
                            question.a;

                        // подготовить название для ввода ответов на основе вопроса
                        var selectAny     = question.select_any ? question.select_any : false,
                            forceCheckbox = question.force_checkbox ? question.force_checkbox : false,
                            checkbox      = (truths > 1 && !selectAny) || forceCheckbox,
                            inputName     = $element.attr('id') + '_question' + (count - 1),
                            inputType     = checkbox ? 'checkbox' : 'radio';

                        if( count == quizValues.questions.length ) {
                            nextQuestionClass = nextQuestionClass + ' ' + lastQuestionClass;
                        }

                        for (i in answers) {
                            if (answers.hasOwnProperty(i)) {
                                answer   = answers[i],
                                optionId = inputName + '_' + i.toString();

                                // Если вопрос имеет> 1 истинных ответов и не является выбранным, используйте флажки; в противном случае радио
                                var input = '<input id="' + optionId + '" name="' + inputName +
                                            '" type="' + inputType + '" /> ';

                                var optionLabel = '<label for="' + optionId + '">' + answer.option + '</label>';

                                var answerContent = $('<li></li>')
                                    .append(input)
                                    .append(optionLabel);
                                answerHTML.append(answerContent);
                            }
                        }

                        // Добавить ответы на вопрос
                        questionHTML.append(answerHTML);

                        // Если обмен ответами НЕ отключен, добавьте его
                        if (plugin.config.perQuestionResponseMessaging || plugin.config.completionResponseMessaging) {
                            // Теперь давайте добавим правильные / неправильные ответные сообщения
                            var responseHTML = $('<ul class="' + responsesClass + '"></ul>');
                            responseHTML.append('<li class="' + correctResponseClass + '">' + question.correct + '</li>');
                            responseHTML.append('<li class="' + incorrectResponseClass + '">' + question.incorrect + '</li>');

                            // Добавить ответы на вопрос
                            questionHTML.append(responseHTML);
                        }

                        // Добавляет кнопки проверки ответа / возврата / следующего вопроса
                        if (plugin.config.backButtonText && plugin.config.backButtonText !== '') {
                            questionHTML.append('<a href="#" class="button ' + backToQuestionClass + '">' + plugin.config.backButtonText + '</a>');
                        }

                        var nextText = plugin.config.nextQuestionText;
                        if (plugin.config.completeQuizText && count == questionCount) {
                            nextText = plugin.config.completeQuizText;
                        }

                        // Если мы не показываем ответы на вопрос, покажите кнопку «Следующий вопрос» и заставьте ее тоже проверить ответ
                        if (!plugin.config.perQuestionResponseMessaging) {
                            questionHTML.append('<a href="#" class="button ' + nextQuestionClass + ' ' + checkAnswerClass + '">' + nextText + '</a>');
                        } else {
                            questionHTML.append('<a href="#" class="button ' + nextQuestionClass + '">' + nextText + '</a>');
                            questionHTML.append('<a href="#" class="button ' + checkAnswerClass + '">' + plugin.config.checkAnswerText + '</a>');
                        }

                        // Добавить вопрос и ответы на викторину
                        quiz.append(questionHTML);

                        count++;
                    }
                }

                // Добавить содержание викторины на страницу
                $quizArea.append(quiz);

                // Переключите кнопку запуска ИЛИ запустите тест, если кнопка запуска отключена
                if (plugin.config.skipStartButton || $quizStarter.length == 0) {
                    $quizStarter.hide();
                    plugin.method.startQuiz.apply (this, [{callback: plugin.config.animationCallbacks.startQuiz}]); // TODO: determine why 'this' is being passed as arg to startQuiz method
                    kN(key,3).apply (null, []);
                } else {
                    $quizStarter.fadeIn(500, kN(key,3)); // 3d notch on key must be on both sides of if/else, otherwise key won't turn
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Запускает тест (скрывает кнопку запуска и отображает первый вопрос)
            startQuiz: function(options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                function start(options) {
                    var firstQuestion = $(_element + ' ' + _questions + ' li').first();
                    if (firstQuestion.length) {
                        firstQuestion.fadeIn(500, function () {
                            if (options && options.callback) options.callback ();
                        });
                    }
                }

                if (plugin.config.skipStartButton || $quizStarter.length == 0) {
                    start({callback: kN(key,1)});
                } else {
                    $quizStarter.fadeOut(300, function(){
                        start({callback: kN(key,1)}); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    });
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});

                if (plugin.config.events &&
                        plugin.config.events.onStartQuiz) {
                    plugin.config.events.onStartQuiz.apply (null, []);
                }
            },

            // Сбрасывает (перезапускает) тест (скрывает результаты, сбрасывает входные данные и отображает первый вопрос)
            resetQuiz: function(startButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                $quizResults.fadeOut(300, function() {
                    $(_element + ' input').prop('checked', false).prop('disabled', false);

                    $quizLevel.attr('class', 'quizLevel');
                    $(_element + ' ' + _question).removeClass(correctClass).removeClass(incorrectClass).remove(completeClass);
                    $(_element + ' ' + _answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);

                    $(_element + ' ' + _question          + ',' +
                      _element + ' ' + _responses         + ',' +
                      _element + ' ' + _response          + ',' +
                      _element + ' ' + _nextQuestionBtn   + ',' +
                      _element + ' ' + _prevQuestionBtn
                    ).hide();

                    $(_element + ' ' + _questionCount + ',' +
                      _element + ' ' + _answers + ',' +
                      _element + ' ' + _checkAnswerBtn
                    ).show();

                    $quizArea.append($(_element + ' ' + _questions)).show();

                    kN(key,1).apply (null, []);

                    plugin.method.startQuiz({callback: plugin.config.animationCallbacks.startQuiz},$quizResults); // TODO: determine why $quizResults is being passed
                });

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Подтверждает выбор ответов, отображает объяснения и кнопку «Следующий вопрос»
            checkAnswer: function(checkButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (2); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var questionLI    = $($(checkButton).parents(_question)[0]),
                    answerLIs     = questionLI.find(_answers + ' li'),
                    answerSelects = answerLIs.find('input:checked'),
                    questionIndex = parseInt(questionLI.attr('id').replace(/(question)/, ''), 10),
                    answers       = questions[questionIndex].a,
                    selectAny     = questions[questionIndex].select_any ? questions[questionIndex].select_any : false;

                answerLIs.addClass(incorrectResponseClass);

                // Collect the true answers needed for a correct response
                var trueAnswers = [];
                for (i in answers) {
                    if (answers.hasOwnProperty(i)) {
                        var answer = answers[i],
                            index  = parseInt(i, 10);

                        if (answer.correct) {
                            trueAnswers.push(index);
                            answerLIs.eq(index).removeClass(incorrectResponseClass).addClass(correctResponseClass);
                        }
                    }
                }

                // TODO: Now that we're marking answer LIs as correct / incorrect, we might be able
                // to do all our answer checking at the same time

                // NOTE: Collecting answer index for comparison aims to ensure that HTML entities
                // and HTML elements that may be modified by the browser / other scrips match up

                // Collect the answers submitted
                var selectedAnswers = [];
                answerSelects.each( function() {
                    var id = $(this).attr('id');
                    selectedAnswers.push(parseInt(id.replace(/(.*\_question\d{1,}_)/, ''), 10));
                });

                if (plugin.config.preventUnanswered && selectedAnswers.length === 0) {
                    alert(plugin.config.preventUnansweredText);
                    return false;
                }

                // Verify all/any true answers (and no false ones) were submitted
                var correctResponse = plugin.method.compareAnswers(trueAnswers, selectedAnswers, selectAny);

                if (correctResponse) {
                    questionLI.addClass(correctClass);
                } else {
                    questionLI.addClass(incorrectClass);
                }

                // Toggle appropriate response (either for display now and / or on completion)
                questionLI.find(correctResponse ? _correctResponse : _incorrectResponse).show();

                // If perQuestionResponseMessaging is enabled, toggle response and navigation now
                if (plugin.config.perQuestionResponseMessaging) {
                    $(checkButton).hide();
                    if (!plugin.config.perQuestionResponseAnswers) {
                        // Make sure answers don't highlight for a split second before they hide
                        questionLI.find(_answers).hide({
                            duration: 0,
                            complete: function() {
                                questionLI.addClass(completeClass);
                            }
                        });
                    } else {
                        questionLI.addClass(completeClass);
                    }
                    questionLI.find('input').prop('disabled', true);
                    questionLI.find(_responses).show();
                    questionLI.find(_nextQuestionBtn).fadeIn(300, kN(key,1));
                    questionLI.find(_prevQuestionBtn).fadeIn(300, kN(key,2));
                    if (!questionLI.find(_prevQuestionBtn).length) kN(key,2).apply (null, []); // 2nd notch on key must be passed even if there's no "back" button
                } else {
                    kN(key,1).apply (null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    kN(key,2).apply (null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Переходит к следующему вопросу ИЛИ завершает тест, если последний вопрос
            nextQuestion: function(nextButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var currentQuestion = $($(nextButton).parents(_question)[0]),
                    nextQuestion    = currentQuestion.next(_question),
                    answerInputs    = currentQuestion.find('input:checked');

                // If response messaging has been disabled or moved to completion,
                // make sure we have an answer if we require it, let checkAnswer handle the alert messaging
                if (plugin.config.preventUnanswered && answerInputs.length === 0) {
                    return false;
                }

                if (nextQuestion.length) {
                    currentQuestion.fadeOut(300, function(){
                        nextQuestion.find(_prevQuestionBtn).show().end().fadeIn(500, kN(key,1));
                        if (!nextQuestion.find(_prevQuestionBtn).show().end().length) kN(key,1).apply (null, []); // 1st notch on key must be passed even if there's no "back" button
                    });
                } else {
                    kN(key,1).apply (null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    plugin.method.completeQuiz({callback: plugin.config.animationCallbacks.completeQuiz});
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Вернуться к последнему вопросу
            backToQuestion: function(backButton, options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (2); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var questionLI = $($(backButton).parents(_question)[0]),
                    responses  = questionLI.find(_responses);

                // Back to question from responses
                if (responses.css('display') === 'block' ) {
                    questionLI.find(_responses).fadeOut(300, function(){
                        questionLI.removeClass(correctClass).removeClass(incorrectClass).removeClass(completeClass);
                        questionLI.find(_responses + ', ' + _response).hide();
                        questionLI.find(_answers).show();
                        questionLI.find(_answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);
                        questionLI.find('input').prop('disabled', false);
                        questionLI.find(_answers).fadeIn(500, kN(key,1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                        questionLI.find(_checkAnswerBtn).fadeIn(500, kN(key,2));
                        questionLI.find(_nextQuestionBtn).hide();

                        // if question is first, don't show back button on question
                        if (questionLI.attr('id') != 'question0') {
                            questionLI.find(_prevQuestionBtn).show();
                        } else {
                            questionLI.find(_prevQuestionBtn).hide();
                        }
                    });

                // Вернуться к предыдущему вопросу
                } else {
                    var prevQuestion = questionLI.prev(_question);

                    questionLI.fadeOut(300, function() {
                        prevQuestion.removeClass(correctClass).removeClass(incorrectClass).removeClass(completeClass);
                        prevQuestion.find(_responses + ', ' + _response).hide();
                        prevQuestion.find(_answers).show();
                        prevQuestion.find(_answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);
                        prevQuestion.find('input').prop('disabled', false);
                        prevQuestion.find(_nextQuestionBtn).hide();
                        prevQuestion.find(_checkAnswerBtn).show();

                        if (prevQuestion.attr('id') != 'question0') {
                            prevQuestion.find(_prevQuestionBtn).show();
                        } else {
                            prevQuestion.find(_prevQuestionBtn).hide();
                        }

                        prevQuestion.fadeIn(500, kN(key,1));
                        kN(key,2).apply (null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
                    });
                }

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});
            },

            // Скрывает все вопросы, отображает итоговую оценку и некоторую убедительную информацию
            completeQuiz: function(options) {
                var key, keyNotch, kN;
                key = internal.method.getKey (1); // how many notches == how many jQ animations you will run
                keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
                kN = keyNotch; // you specify the notch, you get a callback function for your animation

                var score        = $(_element + ' ' + _correct).length,
                    displayScore = score;
                if (plugin.config.scoreAsPercentage) {
                    displayScore = (score / questionCount).toFixed(2)*100 + "%";
                }

                if (plugin.config.disableScore) {
                    $(_quizScore).remove()
                } else {
                    $(_quizScore + ' span').html(plugin.config.scoreTemplateText
                        .replace('%score', displayScore).replace('%total', questionCount));
                }

                if (plugin.config.disableRanking) {
                    $(_quizLevel).remove()
                } else {
                    var levels    = [
                                        quizValues.info.level1, // 80-100%
                                        quizValues.info.level2, // 60-79%
                                        quizValues.info.level3, // 40-59%
                                        quizValues.info.level4, // 20-39%
                                        quizValues.info.level5  // 0-19%
                                    ],
                        levelRank = plugin.method.calculateLevel(score),
                        levelText = $.isNumeric(levelRank) ? levels[levelRank] : '';

                    $(_quizLevel + ' span').html(levelText);
                    $(_quizLevel).addClass('level' + levelRank);
                }

                $quizArea.fadeOut(300, function() {
                    // If response messaging is set to show upon quiz completion, show it now
                    if (plugin.config.completionResponseMessaging) {
                        $(_element + ' .button:not(' + _tryAgainBtn + '), ' + _element + ' ' + _questionCount).hide();
                        $(_element + ' ' + _question + ', ' + _element + ' ' + _answers + ', ' + _element + ' ' + _responses).show();
                        $quizResults.append($(_element + ' ' + _questions)).fadeIn(500, kN(key,1));
                    } else {
                        $quizResults.fadeIn(500, kN(key,1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
                    }
                });

                internal.method.turnKeyAndGo (key, options && options.callback ? options.callback : function () {});

                if (plugin.config.events &&
                        plugin.config.events.onCompleteQuiz) {
                    plugin.config.events.onCompleteQuiz.apply (null, [{
                        questionCount: questionCount,
                        score: score
                    }]);
                }
            },

            // Сравнивает выбранные ответы с истинными, возвращает true, если они точно совпадают
            compareAnswers: function(trueAnswers, selectedAnswers, selectAny) {
                if ( selectAny ) {
                    return $.inArray(selectedAnswers[0], trueAnswers) > -1;
                } else {
                    // crafty array comparison (http://stackoverflow.com/a/7726509)
                    return ($(trueAnswers).not(selectedAnswers).length === 0 && $(selectedAnswers).not(trueAnswers).length === 0);
                }
            },

            // Рассчитывает уровень знаний на основе количества правильных ответов (в процентах)
            calculateLevel: function(correctAnswers) {
                var percent = (correctAnswers / questionCount).toFixed(2),
                    level   = null;

                if (plugin.method.inRange(0, 0, percent)) {
                    level = 4;
                } else if (plugin.method.inRange(0, 0.59, percent)) {
                    level = 3;
                } else if (plugin.method.inRange(0.60, 0.79, percent)) {
                    level = 2;
                } else if (plugin.method.inRange(0.80, 0.95, percent)) {
                    level = 1;
                } else if (plugin.method.inRange(0.96, 1.00, percent)) {
                    level = 0;
                }

                return level;
            },

            // Определяет, находится ли процент правильных значений в диапазоне уровней
            inRange: function(start, end, value) {
                return (value >= start && value <= end);
            }
        };

        plugin.init = function() {
            // Setup quiz
            plugin.method.setupQuiz.apply (null, [{callback: plugin.config.animationCallbacks.setupQuiz}]);

            // Привязать кнопку «Пуск»
            $quizStarter.on('click', function(e) {
                e.preventDefault();

                if (!this.disabled && !$(this).hasClass('disabled')) {
                    plugin.method.startQuiz.apply (null, [{callback: plugin.config.animationCallbacks.startQuiz}]);
                }
            });

            // Привязать кнопку «попробовать еще раз»
            $(_element + ' ' + _tryAgainBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.resetQuiz(this, {callback: plugin.config.animationCallbacks.resetQuiz});
            });

            // Привязать кнопки «проверить ответ»
            $(_element + ' ' + _checkAnswerBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.checkAnswer(this, {callback: plugin.config.animationCallbacks.checkAnswer});
            });

            // Bind "back" buttons
            $(_element + ' ' + _prevQuestionBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.backToQuestion(this, {callback: plugin.config.animationCallbacks.backToQuestion});
            });

            // Bind "next" buttons
            $(_element + ' ' + _nextQuestionBtn).on('click', function(e) {
                e.preventDefault();
                plugin.method.nextQuestion(this, {callback: plugin.config.animationCallbacks.nextQuestion});
            });

            // Accessibility (WAI-ARIA).
            var _qnid = $element.attr('id') + '-name';
            $quizName.attr('id', _qnid);
            $element.attr({
              'aria-labelledby': _qnid,
              'aria-live': 'polite',
              'aria-relevant': 'additions',
              'role': 'form'
            });
            $(_quizStarter + ', [href = "#"]').attr('role', 'button');
        };

        plugin.init();
    };

    $.fn.slickQuiz = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('slickQuiz')) {
                var plugin = new $.slickQuiz(this, options);
                $(this).data('slickQuiz', plugin);
            }
        });
    };
})(jQuery);
