import { NotFoundException } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  FindOptionsRelations,
  Repository,
} from 'typeorm';

import { ListDto } from './dto/list.dto';
import { BaseEntity } from './models/base-entity';
import { ListParamsDto } from './dto/list-params.dto';

export abstract class BaseService<T extends BaseEntity> {
  repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async list(
    listParamsDto: ListParamsDto,
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {},
    relations: FindOptionsRelations<T> = {},
  ): Promise<ListDto<T>> {
    const [array, itemsCount] = await this.repository.findAndCount({
      where,
      relations,
      take: listParamsDto.limit,
      skip: listParamsDto.countOffset(),
      order: {
        [listParamsDto.orderField]: listParamsDto.order,
      } as FindOptionsOrder<T>,
    });

    return new ListDto(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  async getBy(
    where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    relations: FindOptionsRelations<T> = {},
    throwError = true,
  ): Promise<T | null> {
    const response = await this.repository.findOne({
      where,
      relations,
    });

    if (!response && throwError) {
      throw new NotFoundException();
    }

    return response;
  }

  async deleteBy(where: FindOptionsWhere<T>) {
    return await this.repository.delete(where);
  }
}
