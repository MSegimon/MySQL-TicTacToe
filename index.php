<?php

SESSION_START();
require_once("No Peaking");

if (isset($_POST["start"])) {
    if ($_POST["start"] == "makeGame") {
        $maxID = dbQuery("SELECT max(`id`) FROM `tictactoe`")[0];
        $nextID = 1;
        if (isset($maxID)) {
            $nextID = $maxID["max(`id`)"] + 1;
        }
        $_SESSION["gameID"] = $nextID;
        $_SESSION["playerNum"] = 1;

        dbQuery("INSERT INTO `tictactoe`(`id`, `name1`, `name2`, `positions`, `status`) VALUES (?,?,\"\",\"         \",\"Waiting\")", array($nextID,htmlentities($_POST["name"])));
        echo "Game Created with game id: " . $nextID;

    } else if ($_POST["start"] == "checkID") {
        echo $_SESSION["gameID"];

    } else if ($_POST["start"] == "joinGame") {
        if (!isset(dbQuery("SELECT * FROM `tictactoe` WHERE `id`=?", array($_POST["id"]))[0])) {
            echo "bad id";
        } else {
            dbQuery("UPDATE `tictactoe` SET `name2`=? WHERE `id`=?", array(htmlentities($_POST["name"]), $_POST["id"]));

            $_SESSION["gameID"] = $_POST["id"];
            $_SESSION["playerNum"] = 2;
            
            echo "Joining game: ";
        }
    } else if ($_POST["start"] == "checkPlayer2") {
        if (isset(dbQuery("SELECT `name2` FROM `tictactoe` WHERE `id`=? AND `name2`!=''", array($_SESSION["gameID"]))[0])) {
           
            $_SESSION["player2"] = dbQuery("SELECT `name2` FROM `tictactoe` WHERE `id`=?", array($_SESSION["gameID"]))[0]["name2"];

            dbQuery("UPDATE `tictactoe` SET `status`='playing' WHERE `id`=?", array($_POST["id"]));

            echo ";" . $_SESSION["player2"];
        } else {
            echo "no player2";
        }
    } else if ($_POST["start"] == "checkPos") {

        echo dbQuery("SELECT `positions` FROM `tictactoe` WHERE `id`=?", array($_SESSION["gameID"]))[0]["positions"];

    } else if ($_POST["start"] == "sendPos") {
        
        dbQuery("UPDATE `tictactoe` SET `positions`=? WHERE `id`=?", array($_POST["pos"], $_SESSION["gameID"]));

        echo "Positions Updated";

    } else if ($_POST["start"] == "checkPlayer1") {
        if (isset(dbQuery("SELECT `name1` FROM `tictactoe` WHERE `id`=? AND `name1`!=''", array($_SESSION["gameID"]))[0])) {
           
            $_SESSION["player1"] = dbQuery("SELECT `name1` FROM `tictactoe` WHERE `id`=?", array($_SESSION["gameID"]))[0]["name1"];

            echo ";" . $_SESSION["player1"];
        } else {
            echo "no player1";
        }
    } else if ($_POST["start"] == "closeGame") {
        
        //dbQuery("DELETE FROM `tictactoe` WHERE `id`=?", array($_SESSION["gameID"]));
        //SESSION_CLOSE();
        
    }
    die();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../../images/Logo.png" type="image/gif" sizes="16x16">
    <title>Tic Tac Toe</title>

    <script src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.min.js"></script>
    <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>
    <script src='https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js'></script>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <script src="assets/sketch.js"></script>
</body>
</html>