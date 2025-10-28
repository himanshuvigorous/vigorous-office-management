import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...(isDragging ? { 
      position: 'relative', 
      zIndex: 9999,
      background: '#fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

export default DraggableRow;