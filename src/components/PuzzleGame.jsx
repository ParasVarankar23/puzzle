"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaClock, FaLightbulb, FaRedo } from "react-icons/fa";

const initialBoard = [1, 2, 3, 4, 5, 6, 7, 8, null];

export default function PuzzleGame() {
    const [board, setBoard] = useState(shuffle(initialBoard));
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [bestScore, setBestScore] = useState({ moves: Infinity, time: Infinity });

    useEffect(() => {
        const saved = window.localStorage.getItem('puzzleBestScore');
        if (saved) {
            setBestScore(JSON.parse(saved));
        }
    }, []);

    function shuffle(arr) {
        let shuffled = [...arr];
        do {
            shuffled = [...arr].sort(() => Math.random() - 0.5);
        } while (!isSolvable(shuffled));
        return shuffled;
    }

    function isSolvable(arr) {
        const tiles = arr.filter(n => n !== null);
        let inversions = 0;
        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i] > tiles[j]) inversions++;
            }
        }
        return inversions % 2 === 0;
    }

    const moveTile = (index) => {
        if (isComplete) return;

        const emptyIndex = board.indexOf(null);
        const row = Math.floor(index / 3);
        const emptyRow = Math.floor(emptyIndex / 3);
        const col = index % 3;
        const emptyCol = emptyIndex % 3;

        const isAdjacent =
            (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
            (col === emptyCol && Math.abs(row - emptyRow) === 1);

        if (isAdjacent) {
            const newBoard = [...board];
            [newBoard[index], newBoard[emptyIndex]] = [
                newBoard[emptyIndex],
                newBoard[index],
            ];
            setBoard(newBoard);
            setMoves(moves + 1);

            if (!startTime) {
                setStartTime(Date.now());
            }

            if (isSolved(newBoard)) {
                setIsComplete(true);
                const endTime = Date.now();
                const timeElapsed = Math.floor((endTime - startTime) / 1000);
                setElapsedTime(timeElapsed);

                if (moves + 1 < bestScore.moves) {
                    const newBest = { moves: moves + 1, time: timeElapsed };
                    setBestScore(newBest);
                    window.localStorage.setItem('puzzleBestScore', JSON.stringify(newBest));
                }
            }
        }
    };

    function isSolved(board) {
        for (let i = 0; i < 8; i++) {
            if (board[i] !== i + 1) return false;
        }
        return board[8] === null;
    }

    const resetGame = () => {
        setBoard(shuffle(initialBoard));
        setMoves(0);
        setStartTime(null);
        setElapsedTime(0);
        setIsComplete(false);
    };

    useEffect(() => {
        let interval;
        if (startTime && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTileColor = (tile) => {
        if (!tile) return "bg-indigo-100 border-2 border-dashed border-indigo-200";
        const colors = [
            "from-red-400 to-rose-500 text-white",
            "from-orange-400 to-amber-500 text-white",
            "from-yellow-400 to-amber-500 text-gray-700",
            "from-green-400 to-emerald-500 text-white",
            "from-teal-400 to-cyan-500 text-white",
            "from-blue-400 to-indigo-500 text-white",
            "from-purple-400 to-violet-500 text-white",
            "from-pink-400 to-rose-500 text-white",
        ];
        return `bg-gradient-to-br ${colors[tile - 1]} shadow-md hover:shadow-xl`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2">
                        🧩 Sliding Puzzle
                    </h1>
                    <p className="text-gray-600 font-medium">Arrange numbers 1-8 in order!</p>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl p-3 text-center shadow-md border border-indigo-100">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Moves</div>
                        <div className="text-2xl font-bold text-indigo-600">{moves}</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-md border border-indigo-100">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Time</div>
                        <div className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                            <FaClock className="text-indigo-400 text-sm" />
                            {formatTime(elapsedTime)}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-md border border-indigo-100 col-span-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">🏆 Best Score</div>
                        <div className="text-lg font-bold text-amber-600">
                            {bestScore.moves === Infinity ? 'Not set' : `${bestScore.moves} moves · ${formatTime(bestScore.time)}`}
                        </div>
                    </div>
                </div>

                {/* Puzzle Grid */}
                <div className="relative bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100">
                    <div className="grid grid-cols-3 gap-3">
                        {board.map((tile, index) => (
                            <button
                                key={index}
                                onClick={() => moveTile(index)}
                                className={`aspect-square text-3xl font-bold rounded-xl transition-all duration-200
                                    ${tile ? getTileColor(tile) : 'bg-indigo-50 border-2 border-dashed border-indigo-200'}
                                    ${tile ? 'hover:scale-105 active:scale-95' : 'cursor-default'}
                                    flex items-center justify-center
                                `}
                            >
                                {tile}
                            </button>
                        ))}
                    </div>

                    {/* Completion Overlay */}
                    {isComplete && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                            <div className="text-center">
                                <div className="text-7xl mb-4 animate-bounce">🎉</div>
                                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-2">
                                    Puzzle Solved!
                                </h2>
                                <p className="text-gray-700 text-lg">
                                    Completed in <span className="text-indigo-600 font-bold">{moves}</span> moves
                                    and <span className="text-indigo-600 font-bold">{formatTime(elapsedTime)}</span>
                                </p>
                                {moves === bestScore.moves && elapsedTime === bestScore.time && (
                                    <p className="text-amber-600 font-bold mt-2 text-xl animate-pulse">
                                        🏆 New Best Score!
                                    </p>
                                )}
                                <button
                                    onClick={resetGame}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl 
                                        transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={resetGame}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl 
                            transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200
                            flex items-center justify-center gap-2"
                    >
                        <FaRedo /> New Game
                    </button>
                    <button
                        onClick={() => setShowRules(!showRules)}
                        className="px-4 py-3 bg-white text-indigo-600 font-bold rounded-xl 
                            transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-indigo-200
                            flex items-center justify-center gap-2"
                    >
                        <FaLightbulb />
                        {showRules ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>

                {/* Rules Section */}
                {showRules && (
                    <div className="mt-4 bg-white rounded-xl p-6 shadow-md border-2 border-indigo-100 animate-fadeIn">
                        <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                            📖 How to Play
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">1.</span>
                                <p>Click on any tile adjacent to the empty space to slide it.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">2.</span>
                                <p>Arrange all tiles in numerical order from <strong>1 to 8</strong>.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">3.</span>
                                <p>The empty space should be at the <strong>bottom-right</strong> corner.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">4.</span>
                                <p>Try to complete the puzzle with the <strong>fewest moves</strong> possible!</p>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3 mt-2 border border-indigo-100">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <span className="text-indigo-500">💡</span>
                                    <span><strong>Tip:</strong> Plan your moves ahead and solve row by row!</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Win Message (when complete but not showing overlay) */}
                {isComplete && (
                    <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 text-center">
                        <p className="text-green-700 font-bold text-lg">
                            🎉 Congratulations! You solved the puzzle in {moves} moves!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}