import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Fragment, useState } from "react";

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    content: `item ${k + offset}`,
    id: `item-${k + offset}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  margin: `0 0 ${0}px 0`,
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  padding: grid * 2,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  overflow: "auto",
  padding: grid,
  height: 250,
  width: 250,
});

const createId2List = (state) =>
  !state
    ? {}
    : Object.fromEntries(
        Object.keys(state)
          .sort()
          .map((key, i) => [`droppable${i}`, key])
      );

export default function MultipleDndLists({
  state = {
    rowGroups: getItems(5, 10),
    values: getItems(5, 20),
    columns: getItems(10),
  },
  children: renderContent = (item) => item.content,
  itemIdKey = "id",
  setState,
}) {
  // const [state, setState] = useState({
  //   rowGroups: getItems(5, 10),
  //   values: getItems(5, 20),
  //   columns: getItems(10),
  // });

  // const id2List = {
  //   droppable2: "selected",
  //   droppable: "items",
  // };

  const id2List = createId2List(state);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    setState((currState) => {
      const getList = (id) => currState[id2List[id]];

      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
        );

        return { ...currState, [id2List[source.droppableId]]: items };
      } else {
        const result = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
        );

        return {
          ...currState,
          [id2List[destination.droppableId]]: result[destination.droppableId],
          [id2List[source.droppableId]]: result[source.droppableId],
        };
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(id2List).map(([droppableId, listId]) => (
            <div key={droppableId}>
              {listId}
              <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                  <div
                    style={getListStyle(snapshot.isDraggingOver)}
                    ref={provided.innerRef}
                  >
                    {state[listId].map((item, index) => (
                      <Draggable
                        draggableId={item[itemIdKey]}
                        key={item[itemIdKey]}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {renderContent(item, listId)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
