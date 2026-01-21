import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    content: `item ${k}`,
    id: `item-${k}`,
  }));

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  margin: `0 0 ${grid}px 0`,
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
  height: 300,
});

export default function VerticalDndList({
  children: renderContent = (item) => item.content,
  state = getItems(10),
  idKey = "id",
  setState,
}) {
  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return;

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    setState((items) =>
      reorder(items, result.source.index, result.destination.index)
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
            ref={provided.innerRef}
          >
            {state?.map((item, index) => (
              <Draggable
                draggableId={item[idKey]}
                key={item[idKey]}
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
                    {renderContent(item)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
