import { useState, useRef } from "react";

export interface DragItem {
  id: string;
  index: number;
}

export const useDragAndDrop = (
  items: { id: string }[],
  onReorder: (newOrder: string[]) => void
) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart =
    (id: string, index: number) => (e: React.DragEvent) => {
      setDraggedItem({ id, index });
      e.dataTransfer.effectAllowed = "move";
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const newItems = [...items];
    const [removed] = newItems.splice(draggedItem.index, 1);
    newItems.splice(index, 0, removed);

    onReorder(newItems.map((item) => item.id));

    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const getDragHandleProps = (id: string, index: number) => ({
    draggable: true,
    onDragStart: handleDragStart(id, index),
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver(index),
    onDragEnter: handleDragEnter(index),
    onDragLeave: handleDragLeave,
    onDrop: handleDrop(index),
  });

  const getItemClassName = (index: number, baseClassName: string = "") => {
    const classes = [baseClassName];

    if (dragOverIndex === index && draggedItem && draggedItem.index !== index) {
      if (draggedItem.index < index) {
        classes.push("border-b-2 border-blue-500");
      } else {
        classes.push("border-t-2 border-blue-500");
      }
    }

    return classes.filter(Boolean).join(" ");
  };

  return {
    draggedItem,
    dragOverIndex,
    getDragHandleProps,
    getItemClassName,
  };
};
