// Variables
var messages = ["CTIS - Web Technologies 1<br/>PROJECT<br/>Fall 2018",
    "BY<br/>Abdurahman Atakishiyev and Fahad Ahmad<br/>21701324",
    "<br/>Can you solve it?<br/>"];

var board = mov = solution = [], empty = [0, 0];

var init = {
    "00": 0,
    "10": 1,
    "20": 2,
    "01": 3,
    "11": 4,
    "21": 5,
    "02": 6,
    "12": 7,
    "22": 8,
}

var image;

var prev = "null";

var i = 1, state = 0, shufNum = 0, period;

// init
$(function () {


    // Welcome screen
    $("#welcome").css("display", "block");
    $(".button").mouseenter(function () {
        $(this).css("cursor", "pointer");
    });

    // Button hover effect
    $(".button").hover(function () {
        $(this).css({ background: "#34495e", color: "black" });
    }, function () {
        $(this).css({ background: "white", color: "#34495e" });
    });

    var timer = setInterval(function () {

        $("#info p").fadeOut(500, function () {
            $(this).html(messages[i]).fadeIn(500);
            i = (i + 1) % 3;
        })

    }, 2000);

    $("#welcome > .button").click(function () {
        clearInterval(timer);
        $("#welcome").fadeOut(500, function () {
            $("#choose").fadeIn(500);
        });

    });

    // Choose screen

    $("img").click(function () {
        $("img").css('box-shadow', '0px 0px 0px');
        $(this).css('box-shadow', '0px 15px 15px #888');
        image = $(this).attr('src');
        $("#choose > .button").fadeIn(500);
    });

    $("#choose > .button").click(function () {
        $("#choose").animate({ left: "-=1000px", opacity: 0 }, 900, function () {
            $(this).hide();
            $("#game").show().animate({ left: "0px", opacity: 1 }, 1000);
            $("#shuffle").show().animate({ left: "0px", opacity: 1 }, 1000);
            buildBoard();
        });
    });

    // Game

    $("select").change(function () {
        $("#shuffle > .button").fadeIn(500);
    });

    $("#shuffle > .button").click(function () {
        if ($("select").val() !== '0') {
            shufNum = Number($("select").val());
            period = shufNum === 3 ? 700 : 300;
            $("#shuffle").css('display', 'none');
            shuffle();
        }
    });

    $("#game").hover(function () {
        if (state === 1) {
            mov = getMovables();
            $(".piece").each(function () {
                if (!mov.includes($(this).attr("id")))
                    $(this).css("opacity", "0.2");
                else
                    $(this).css("opacity", "1");
            });
        }
    }, function () {
        if (state === 1)
            $(".piece").each(function () {
                $(this).css("opacity", "1");
            });
    });

    function getMovables() {
        /* Returns currently movable pieces */

        var movables = [];
        $(".piece").each(function () {
            var id = $(this).attr('id');
            var coor = [Number(id[0]), Number(id[1])];
            if (Math.abs(empty[0] - coor[0]) + Math.abs(empty[1] - coor[1]) === 1)
                movables.push(id);
        });
        return movables;
    }

    function buildBoard() {
        /* Builds the game board by filling the pieces */

        for (var i = 0; i < 3; i++) {
            $("#game").append("<div class='piece' id='0" + i + "'style='" + "background:url(" + image + ") no-repeat -0px -" + (i * 150) + "px'></div>")
            $("#game").append("<div class='piece' id='1" + i + "'style='" + "background:url(" + image + ") no-repeat -150px -" + (i * 150) + "px'></div>")
            $("#game").append("<div class='piece' id='2" + i + "'style='" + "background:url(" + image + ") no-repeat -300px -" + (i * 150) + "px'></div>")
        }
        $(".piece:first-child").css("background", "none");

        $(".piece").click(function () {
            if (state === 1) {
                var id = $(this).attr('id');
                if (getMovables().includes(id)) {
                    move(id);
                }
            }
        });
    }

    function move(id) {
        /* Moves the piece with the given id. */

        var coor = [Number(id[0]), Number(id[1])], piece = $("#" + id);
        prev = empty.join("");
        if (empty[0] - coor[0] !== 0) {
            piece.animate({ left: "-=" + 152 * (coor[0] - empty[0]) + "px" }, 200, function () { changeOpacity(id, coor, piece) });
        }
        else if (empty[1] - coor[1] !== 0) {
            piece.animate({ top: "-=" + 152 * (coor[1] - empty[1]) + "px" }, 200, function () { changeOpacity(id, coor, piece) });
        }

        // If Esc is not pressed, record all moves
        if (state !== -1)
            solution.push(empty.join(""));
    }

    function changeOpacity(id, coor, piece) {
        /* Changes opacity of the pieces and swaps the ids of the moved pieces. */


        var temp = $("#" + empty.join("")).attr('id');
        $("#" + empty.join("")).attr('id', id);
        piece.attr('id', temp);
        empty = coor;
        mov = getMovables();

        if (state === 1) {
            $(".piece").each(function () {
                if (!mov.includes($(this).attr("id")))
                    $(this).css("opacity", "0.2");
                else
                    $(this).css("opacity", "1");
            });
        }
        checkForWin();
    }

    function checkForWin() {
        /* Checks if all pieces are aligned in increasing order, 
            i.e if the puzze is solved. */

        var next = 0, id, flag = true;
        $("#game").children().each(function (i, item) {
            id = $(item).attr('id');
            if (next !== init[id])
                flag = false;
            next++;
        })
        if (flag) {
            if(state === -1)
                $("#end").text("Now on your own!");

            state = 0;
            $(".piece").each(function () {
                $(this).css("opacity", "0.2");
            });
            $("#solve").hide();
            $("#restart").fadeIn(1000);
            $("#end").fadeIn(200).fadeOut(200).fadeIn(200)
                .animate({ fontSize: "+=35px", bottom: "+=350px" })
                .animate({ bottom: "-=20px" }, 200)
                .animate({ bottom: "+=20px" }, 200);
        }
    }

    function shuffle() {
        /* Shuffles the pieces by moving the randomly chosen movable piece */

        if (shufNum > 0) {
            var id;
            mov = getMovables();
            do {
                id = mov[Math.floor(Math.random() * mov.length)];
            } while (id === prev);
            move(id);
            shufNum -= 1;
            setTimeout(function () { shuffle() }, period);
        } else {
            state = 1;
            $("#solve").show();
            $("#solve").animate({ fontSize: "+=36px" }, 500);
        }
    }

    /* To solve puzzle when Esc is pressed */

    $(window).on('keydown', function (key) {
        if (key.which === 27) {
            state = -1;
            solvePuzzle();
        }
    });

    function solvePuzzle() {
        move(solution.pop())
        if (solution.length > 0)
            setTimeout(solvePuzzle, 500);            
    }

});