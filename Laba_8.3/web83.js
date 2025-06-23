document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');
    let draggedItem = null; 

    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => {
            this.classList.add('dragging'); 
        }, 0); 
        e.dataTransfer.setData('text/plain', this.id); 
        e.dataTransfer.effectAllowed = 'move'; 
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging'); 
        draggedItem = null;
    }

    columns.forEach(column => {
        const itemsContainer = column.querySelector('.items'); 

        itemsContainer.addEventListener('dragover', handleDragOver);
        itemsContainer.addEventListener('dragleave', handleDragLeave);
        itemsContainer.addEventListener('drop', handleDrop);
    });

    function handleDragOver(e) {
        e.preventDefault(); 
        if (draggedItem && this !== draggedItem.parentNode) {
            this.classList.add('drag-over'); 
        }
        e.dataTransfer.dropEffect = 'move'; 
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over'); 
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over'); 

        if (draggedItem && this !== draggedItem.parentNode) { 

            const afterElement = getDragAfterElement(this, e.clientY);
            if (afterElement == null) {
                this.appendChild(draggedItem);
            } else {
                this.insertBefore(draggedItem, afterElement);
            }
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});