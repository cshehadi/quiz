"use strict";

$(document).ready(function() {

    /** Global Vars **/

    var current_question = 0;
    var score = 0;

    var question_data = [
        {
            topic: 'topic1',
            description: 'description1',
            directions: 'directions1',
            question: 'question1',
            answers: ['1-answer1','1-answer2','1-answer3','1-answer4'],
            correct_idx: 2
        },
        {
            topic: 'topic2',
            description: 'description2',
            directions: 'directions2',
            question: 'question2',
            answers: ['2-answer1','2-answer2','2-answer3','2-answer4'],
            correct_idx: 3
        },
    ];

    /** Functions **/

    function Question(question) {
        for(var prop in question) {
            this[prop] = question[prop];
        }
    }

    function clearBoard() {
        $('section').hide();
    }

    function createAnswer(i, answer_text) {
        var out = '<li class="answer"><input type="radio" name="answer" value="'+i+'"> ';
        out += '<span class="answer-text">'+answer_text+'</span></li>';
        return out;
    }

    function displayError(error) {
        $('.error').html(error);
        $('.error').show();
    }

    function resetFinalPane() {
        // set the "continue" button back to "next" and hide the "Quiz Over" notification
        $('.question-results input[type=submit]').val('Next >');
        $('.question-results .quiz-over').hide();
    }

    function displayQuestion() {
        
        var question = new Question(question_data[current_question]);

        for(var prop in question) {
            // populate the answers
            if (prop == 'answers') { // if this is the list of answers, create an li for each
                $('.answer-list').html(''); // clear out the previous questions answers
                for(var i = 0; i < question[prop].length; i++) {
                    $('.answer-list').append(createAnswer(i, question[prop][i]));
                }
            } else { // if not the list of answers, then just populate the elements by class name (question => .question)
                var elem = $('.'+prop); // construct the class name
                if (elem.length) { // if it exists, then populate it
                    $(elem).html(question[prop]);
                }
            }
        }
        $('.answers').show();
    }

    function displayResult(result) {
        // populate results page
        $('.result').html(result);
        $('.num-right').html(score);
        $('.total').html(current_question + 1);

        // if this is the last page, replace Next button with "That's It"
        if (current_question == (question_data.length - 1)) {
            $('.question-results input[type=submit]').val('Retake the Quiz');
            $('.question-results .quiz-over').show();
        }

        // display result page
        $('.question-results').show();

    }

    function handleAnswer() {
        var result = '';

        // hide question content
        $('.answers').hide();

        // were they right or wrong?
        if ($('.answer input[type=radio]:checked').val() == question_data[current_question].correct_idx) {
            score++;
            displayResult('Correct!');
        } else {
            displayResult('Wrong!');
        }
    }

    function newGame() {

        // hide all screens
        clearBoard();

        // clean up final screen
        resetFinalPane();

        // load up a question (uses current_question)
        displayQuestion();
    }

    /** jQuery Bindings **/

    $('.answers').on('click', '.answer input[type="radio"]', function(e) {
        $('.error').hide();
    });

    // bind the Next button to a handler for processing the user's answer
    $('.answers input[type="submit"]').click(function(e) {

        if (!$('.answer input[type=radio]:checked').length) {
            displayError('Please select an answer, below.');
        } else {
            handleAnswer();
        }
        e.preventDefault();
    });

    // bind the Next button to a handler for displaying the next question
    $('.question-results input[type="submit"]').click(function(e) {
        current_question++;
        clearBoard();
        displayQuestion();
    });

    newGame();
});
