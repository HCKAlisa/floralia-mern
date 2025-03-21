import {useEffect, useState} from "react";
import { GameType } from "./../../../shared/types.ts";
import { getGames, isGameData } from "./../../../shared/data.ts";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { flushSync } from 'react-dom';

const GameList = () => {
    const [games, setGames] = useState<GameType[]>(() => getGames());

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
        <div className="p-6">
            <h1 className="text-4xl">Games</h1>
        </div>
    )
}
export default GameList
