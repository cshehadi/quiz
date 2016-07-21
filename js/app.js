"use strict";

$(document).ready(function() {

    /** Global Vars **/

    var current_question = 0;
    var score = 0;

    var question_data = [
        {
            topic: 'Complete Sentences',
            description: "Every sentence must have a subject and verb. A subject is always a noun or a pronoun. The subject is like the “actor” of a sentence. The verb is the “action” performed by the actor, or the “state of being” of the actor.",
            directions: 'Only one of these is a complete sentence.  Which one is it?',
            answers: [
                    "While you are in the library.",
                    "John Smith lies.",
                    "If you suddenly turn into a cockroach in the middle of the night, for no apparent reason, and you have trouble just climbing out of bed and nothing looks the way you remember it and you don’t know what to do next.",
                    "Where there is smoke."
                    ],
            explanation: "",
            correct_idx: 1
        },
        {
            topic: 'Run-on Sentences',
            description: 'When you run two sentences together without proper punctuation—a semicolon or the comma/conjunction combination—you have a run-on sentence.',
            directions: 'Which sentence is <b>not</b> a run-on sentence?',
            answers: [
                    "The summer was hot and dry, causing the farmers to lose much of their crop.",
                    "I don’t know how this watch is put together, however I will try to fix it.",
                    "There was a long line at the restaurant, we headed elsewhere.",
                    "All their children grew up and went away the house suddenly seemed strange and overly large."
                    ],
            explanation: "",
            correct_idx: 0
        },
        {
            topic: 'Noun/Pronoun Agreement',
            description: 'Pronouns must agree with any related nouns or pronouns that precede them. The noun or pronoun that precedes a pronoun is the antecedent. Pronouns should agree with their antecedents in gender and/or singularity and plurality.',
            directions: 'Only one of these sentences is correct.  Which one is it?',
            answers: [
                    "Martina likes to run errands for Bob and myself.",
                    "Each of the geese return to their home for the season.",
                    "Some of these people don’t know his or her head from a hole in the ground.",
                    "No one should fail her grammar quiz."
                    ],
            explanation: "<em>No one</em> is singular. It’s acceptable to choose either <em>she</em> or <em>he.</em> But <em>they</em> is becoming somewhat acceptable in these cases, if not perfectly correct.",
            correct_idx: 3
        },
        {
            topic: 'Subject/Verb Agreement',
            description: 'Subjects (be they nouns or pronouns) must agree with their verbs. If a subject is singular, the verb must also be singular. If the subject is plural, the verb must also be plural.',
            directions: 'Only one of these sentences is correct.  Which one is it?',
            answers: [
                    "Neither of my high school friends were accepted at Yale.",
                    "The proper agreement of sentences require a knowledge of subjects and verbs.",
                    "Near the fire station on Oak Street stand a department store and a barber shop.",
                    "The president of the firm, in addition to several officers, were attending the convention in the first week of October."
                    ],
            explanation: "If you flip the sentence, you’ll see that the subject is <em>a department store and a barber shop.</em>",
            correct_idx: 2
        },
        {
            topic: 'Modifier Problems',
            description: 'Sometimes it’s easy to mistake an adjective for an adverb, or vice versa. Make sure to use the correct type of modifier.',
            directions: 'Only one of these sentences is correct.  Which one is it?',
            answers: [
                    "You must leave the priest alone when he is thinking deep.",
                    "Being very drunk, the toilet was my best friend.",
                    "While scrambling to get ready, I forgot to take my keys.",
                    "After reading Dostoyevsky, existentialism is still unclear.",
                    "Unable to find a muse, her writing suffered for many years.",
                    ],
            explanation: "",
            correct_idx: 2
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
        out += '<label class="answer-text">'+answer_text+'</label></li>';
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
                var elem = $('.'+prop); // construct the selector class name
                if (elem.length) { // if it exists, then populate it
                    $(elem).html(question[prop]);
                }
            }
        }
        $('.answers').show();
    }

    function displayResult(result) {
        // populate results page
        // right or wrong
        $('.result').html(result);

        var question = new Question(question_data[current_question]);

        // display the correct answer
        if (result == 'Wrong!') {
            $('.correct-answer-text').html('The correct answer is ' + question.answers[question.correct_idx]);
            // give an explanation for the result, if there is one
//            if (question_data[current_question].explanation.length) {
//                $('.explanation').html(question_data[current_question].explanation);
//            }
            $('.correct-answer').show();
        } else {
            $('.correct-answer').hide();
        }

        // update the score and total so far
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

        // reset global vars
        current_question = 0;
        score = 0;
        
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
