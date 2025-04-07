import { FaGripLines } from "react-icons/fa";
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { createPortal } from 'react-dom';
import {
    attachClosestEdge,
    type Edge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '../../../components/drop-indicator.tsx';
import { getGameData, isGameData } from './../../../shared/data.ts';
import {GameType} from "./../../../shared/types";
import { ImBin } from "react-icons/im";
import { FaPen } from "react-icons/fa";

type GameState =
    | {
    type: 'idle';
}
    | {
    type: 'preview';
    container: HTMLElement;
}
    | {
    type: 'is-dragging';
}
    | {
    type: 'is-dragging-over';
    closestEdge: Edge | null;
};

const stateStyles: { [Key in GameState['type']]?: HTMLAttributes<HTMLDivElement>['className'] } = {
    'is-dragging': 'opacity-40',
};

const idle: GameState = { type: 'idle' };

export function Game({ Game }: { Game: GameType }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState<GameState>(idle);

    useEffect(() => {
        const element = ref.current;
        invariant(element);
        return combine(
            draggable({
                element,
                getInitialData() {
                    //return games;
                    return getGameData(Game);
                },
                onGenerateDragPreview({ nativeSetDragImage }) {
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: pointerOutsideOfPreview({
                            x: '16px',
                            y: '8px',
                        }),
                        render({ container }) {
                            setState({ type: 'preview', container });
                        },
                    });
                },
                onDragStart() {
                    setState({ type: 'is-dragging' });
                },
                onDrop() {
                    setState(idle);
                },
            }),
            dropTargetForElements({
                element,
                canDrop({ source }) {
                    // not allowing dropping on yourself
                    if (source.element === element) {
                        return false;
                    }
                    // only allowing Games to be dropped on me
                    return isGameData(source.data);
                },
                getData({ input }) {
                    //const data = games;
                    const data = getGameData(Game);
                    return attachClosestEdge(data, {
                        element,
                        input,
                        allowedEdges: ['top', 'bottom'],
                    });
                },
                getIsSticky() {
                    return true;
                },
                onDragEnter({ self }) {
                    const closestEdge = extractClosestEdge(self.data);
                    setState({ type: 'is-dragging-over', closestEdge });
                },
                onDrag({ self }) {
                    const closestEdge = extractClosestEdge(self.data);

                    // Only need to update react state if nothing has changed.
                    // Prevents re-rendering.
                    setState((current) => {
                        if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
                            return current;
                        }
                        return { type: 'is-dragging-over', closestEdge };
                    });
                },
                onDragLeave() {
                    setState(idle);
                },
                onDrop() {
                    setState(idle);
                },
            }),
        );
    }, [Game]);

    return (
        <>
            <div className="relative">
                <div
                    // Adding data-attribute as a way to query for this for our post drop flash
                    data-Game-id={Game.id}
                    ref={ref}
                    className={`flex px-4 w-[62dvw] h-[8dvh] text-sm shadow bg-white flex-row items-center rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab gap-4 ${stateStyles[state.type] ?? ''}`}
                >
                    <div className="w-12 flex justify-center">
                        <FaGripLines size={15} />
                    </div>
                    <span className="truncate flex-grow flex-shrink text-xl">{Game.name}</span>
                    <a><FaPen /></a>
                    <a><ImBin /></a>
                </div>
                {state.type === 'is-dragging-over' && state.closestEdge ? (
                    <DropIndicator edge={state.closestEdge} gap={'8px'} />
                ) : null}
            </div>
            {state.type === 'preview' ? createPortal(<DragPreview Game={Game} />, state.container) : null}
        </>
    );
}

// A simplified version of our Game for the user to drag around
function DragPreview({ Game }: { Game: GameType }) {
    return <div className="border-solid rounded p-2 bg-white">{Game.name}</div>;
}
