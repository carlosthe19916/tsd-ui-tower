import React, { use } from "react";

import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import { flexRender } from "@tanstack/react-table";

import { SimplePagination } from "@app/components/SimplePagination";
import { ConditionalTableBody } from "@app/components/ConditionalTableBody";
import { PullRequestListContext } from "./pull-request-context";

export const PullRequestTable: React.FC = () => {
  const { table, paginationProps, isFetching, fetchError, totalFilteredCount } =
    use(PullRequestListContext);

  const headerGroups = table.getHeaderGroups();
  const { rows } = table.getRowModel();
  const numColumns = headerGroups[0]?.headers.length ?? 0;

  return (
    <>
      <Table aria-label="Pull requests table" variant="compact">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { meta } = header.column.columnDef;
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <Th
                    key={header.id}
                    width={meta?.width}
                    sort={
                      canSort
                        ? {
                            sortBy: {
                              index: header.index,
                              direction: sorted || undefined,
                              defaultDirection: "asc",
                            },
                            onSort: () => header.column.toggleSorting(),
                            columnIndex: header.index,
                          }
                        : undefined
                    }
                    info={meta?.tooltip ? { tooltip: meta.tooltip } : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={totalFilteredCount === 0}
          numRenderedColumns={numColumns}
        >
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    dataLabel={cell.column.columnDef.meta?.dataLabel}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="pr-table"
        isTop={false}
        paginationProps={paginationProps}
      />
    </>
  );
};
