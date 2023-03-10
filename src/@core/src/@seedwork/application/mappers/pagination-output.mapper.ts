import { SearchResult } from "../../../@seedwork/domain/repository/repository-contracts";
import { PaginationOutputDto } from "../dtos/pagination-output.dto";

export default class PaginationOutputMapper {
  static toPaginationOutput(
    result: SearchResult<any>
  ): Omit<PaginationOutputDto, "items"> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
