import {useEffect, useState} from "react";
import { GameType } from "./../../../shared/types.ts";
import { getGames, isGameData } from "./../../../shared/data.ts";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { flushSync } from 'react-dom';
import {Game} from "./game.tsx";
import { FaPlus } from "react-icons/fa";
import {useSearchParams} from "react-router-dom";

const GameList = () => {
    const [games, setGames] = useState<GameType[]>(() => getGames());
    const [_searchParams, setSearchParams] = useSearchParams();

    const changeTab = (newSession: string) => {
        setSearchParams(params => {
            params.set("tab", newSession);
            return params;
        });
    };

    useEffect(() => {
        return monitorForElements({
            canMonitor({ source }) {
                return isGameData(source.data);
            },
            onDrop({ location, source }) {
                const target = location.current.dropTargets[0];
                if (!target) {
                    return;
                }

                const sourceData = source.data;
                const targetData = target.data;

                if (!isGameData(sourceData) || !isGameData(targetData)) {
                    return;
                }

                const indexOfSource = games.findIndex((game) => game.id === sourceData.gameId);
                const indexOfTarget = games.findIndex((game) => game.id === targetData.gameId);

                if (indexOfTarget < 0 || indexOfSource < 0) {
                    return;
                }

                const closestEdgeOfTarget = extractClosestEdge(targetData);

                // Using `flushSync` so we can query the DOM straight after this line
                flushSync(() => {
                    setGames(
                        reorderWithEdge({
                            list: games,
                            startIndex: indexOfSource,
                            indexOfTarget,
                            closestEdgeOfTarget,
                            axis: 'vertical',
                        }),
                    );
                });
                // Being simple and just querying for the game after the drop.
                // We could use react context to register the element in a lookup,
                // and then we could retrieve that element after the drop and use
                // `triggerPostMoveFlash`. But this gets the job done.
                const element = document.querySelector(`[data-game-id="${sourceData.gameId}"]`);
                if (element instanceof HTMLElement) {
                    triggerPostMoveFlash(element);
                }
            },
        });
    }, [games]);

    return (
        <div className="p-6 flex flex-col">
            <h1 className="text-4xl p-8">Games</h1>
            <div className="flex justify-end mx-45">
                <button onClick={() =>changeTab('GameForm')} className="flex gap-4 bg-emerald-100 justify-center items-center py-4 px-10 rounded-lg shadow mb-4"><FaPlus /> Add</button>
            </div>
            <div className="flex flex-col items-center">
                {games.map((game) => (
                    <Game key={game.id} Game={game}/>
                ))}
            </div>

        </div>
    )
}
export default GameList
