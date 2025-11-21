import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

export const useQueryParams = () => {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [role, setRole] = useQueryState(
    "role",
    parseAsString.withDefault("null")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );

  const clearFilters = () => {
    setSearch("");
    setRole("null");
    setPage(1);
    setLimit(10);
  };

  const hasFilters = useMemo(() => {
    return search !== "" || role !== "null";
  }, [search, role]);

  return {
    search,
    setSearch,
    role,
    setRole,
    page,
    setPage,
    limit,
    setLimit,
    clearFilters,
    hasFilters,
  };
};
