import { useState } from 'react'

// Drag-to-reorder for list editors. Only a dedicated drag handle is draggable
// (so it never fights text selection in inputs/textareas); each row is a drop
// target. Returns state + prop-spreaders for the row and the handle.
export function useDragReorder(count: number, onReorder: (from: number, to: number) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const reset = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  const commit = (to: number) => {
    if (dragIndex == null || dragIndex === to) return reset()
    onReorder(dragIndex, to)
    reset()
  }

  // Spread onto the drag handle (e.g. a grip icon).
  const handleProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragIndex(index)
      e.dataTransfer.effectAllowed = 'move'
      // Firefox needs data set for drag to start.
      e.dataTransfer.setData('text/plain', String(index))
    },
    onDragEnd: reset,
    style: { cursor: 'grab' as const },
  })

  // Spread onto each row (the drop target).
  const rowProps = (index: number) => ({
    onDragOver: (e: React.DragEvent) => {
      if (dragIndex == null) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (overIndex !== index) setOverIndex(index)
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      commit(index)
    },
  })

  return { dragIndex, overIndex, handleProps, rowProps }
}

// A simple 6-dot grip icon used as the drag handle.
export function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  )
}
