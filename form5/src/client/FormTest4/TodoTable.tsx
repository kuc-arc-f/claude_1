import React from 'react';
import { useTable, Column ,useReactTable } from '@tanstack/react-table';

type Todo = {
  title: string;
};

type TodoTableProps = {
  todos: Todo[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

const TodoTable: React.FC<TodoTableProps> = ({ todos, onEdit, onDelete }) => {
  const columns: Column<Todo>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <button onClick={() => onEdit(row.index)}>Edit</button>
          <button onClick={() => onDelete(row.index)}>Delete</button>
        </>
      ),
    },
  ];

  /*
  const table = useTable({
    data: todos,
    columns,
  });
  */
  const table = useReactTable({
    data: todos,
    columns,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>{header.renderHeader()}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>{cell.renderCell()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TodoTable;
