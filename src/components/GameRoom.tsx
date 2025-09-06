'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/socket-client';

// Define GameEvent interface locally since socket-server was removed
interface GameEvent {
  type: 'join' | 'leave' | 'move' | 'action';
  userId: string;
  username: string;
  data?: Record<string, unknown>;
  roomId: string;
}

interface GameRoomProps {
  roomId: string;
  gameType?: 'puzzle' | 'racing' | 'strategy';
}

export default function GameRoom({ roomId, gameType = 'puzzle' }: GameRoomProps) {
  const { data: session } = useSession();
  const { 
    isConnected, 
    gameEvents, 
    joinGameRoom, 
    sendGameAction 
  } = useSocket();
  
  const [players, setPlayers] = useState<string[]>([]);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);

  useEffect(() => {
    if (isConnected) {
      joinGameRoom(roomId);
    }
  }, [isConnected, roomId, joinGameRoom]);

  useEffect(() => {
    // Process game events
    if (gameEvents.length > 0) {
      const latestEvent = gameEvents[gameEvents.length - 1];
      setLastEvent(latestEvent);

      if (latestEvent.type === 'join') {
        setPlayers(prev => [...prev, latestEvent.username]);
      } else if (latestEvent.type === 'leave') {
        setPlayers(prev => prev.filter(p => p !== latestEvent.username));
      }
    }
  }, [gameEvents]);

  const handleGameAction = (action: string, data?: Record<string, unknown>) => {
    sendGameAction({
      type: 'action',
      roomId,
      data: data ? { action, ...data } : { action }
    });
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameState('playing');
      handleGameAction('start-game');
    }
  };

  const getGameIcon = () => {
    switch (gameType) {
      case 'puzzle': return '🧩';
      case 'racing': return '🏎️';
      case 'strategy': return '⚔️';
      default: return '🎮';
    }
  };

  const getGameTitle = () => {
    switch (gameType) {
      case 'puzzle': return 'Puzzle Challenge';
      case 'racing': return 'Speed Racing';
      case 'strategy': return 'Strategic Battle';
      default: return 'Multiplayer Game';
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-center text-gray-400">
          Please sign in to join the game
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getGameIcon()}</div>
          <div>
            <h3 className="text-white font-semibold">{getGameTitle()}</h3>
            <p className="text-gray-400 text-sm">Room: #{roomId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Players List */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Players ({players.length})</h4>
        <div className="grid grid-cols-2 gap-2">
          {players.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-4">
              Waiting for players...
            </div>
          ) : (
            players.map((player, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {player.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm">{player}</span>
                {index === 0 && (
                  <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">Host</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-4">
        {gameState === 'waiting' && (
          <div className="text-center">
            <button
              onClick={startGame}
              disabled={players.length < 2 || !isConnected}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Start Game ({players.length}/4 players)
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Need at least 2 players to start
            </p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-white font-medium mb-4">Game in Progress!</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGameAction('move', { direction: 'up' })}
                  className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ⬆️ Up
                </button>
                <button
                  onClick={() => handleGameAction('move', { direction: 'down' })}
                  className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ⬇️ Down
                </button>
                <button
                  onClick={() => handleGameAction('move', { direction: 'left' })}
                  className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ⬅️ Left
                </button>
                <button
                  onClick={() => handleGameAction('move', { direction: 'right' })}
                  className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ➡️ Right
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Last Event Display */}
        {lastEvent && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Last Event</h4>
            <div className="text-sm text-gray-300">
              <span className="text-purple-400">{lastEvent.username}</span>
              <span className="text-gray-500 mx-2">-</span>
              <span className="text-gray-400">{lastEvent.type}</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Status */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Status: {gameState}</span>
          <span>Players: {players.length}/4</span>
        </div>
      </div>
    </div>
  );
}
