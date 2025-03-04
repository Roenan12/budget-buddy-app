import { Button } from "@/components/ui/buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 15, 20],
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex} of {totalItems} results
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Records per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              onItemsPerPageChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[60px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent className="min-w-[65px]">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
              <SelectItem value={String(totalItems)}>All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500 mr-2">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
}

export default Pagination;
