# GraphQL Template

## Overview
This template provides a standardized structure for creating GraphQL schemas, resolvers, and queries in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{ENTITY_NAME}}` - Name of the entity (e.g., `User`, `Task`, `Nutrition`)
- `{{FIELD_NAME}}` - Name of the field (e.g., `name`, `email`, `calories`)
- `{{RESOLVER_NAME}}` - Name of the resolver function
- `{{QUERY_NAME}}` - Name of the query
- `{{MUTATION_NAME}}` - Name of the mutation

## Schema Definition

```graphql
# types/{{ENTITY_NAME}}.graphql

"""
{{ENTITY_NAME}} represents a {{ENTITY_NAME}} entity in the system
"""
type {{ENTITY_NAME}} {
  id: ID!
  {{FIELD_NAME}}: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Add other fields specific to your entity
  # Example:
  # email: String
  # age: Int
  # isActive: Boolean
}

"""
Input type for creating a new {{ENTITY_NAME}}
"""
input Create{{ENTITY_NAME}}Input {
  {{FIELD_NAME}}: String!
  
  # Add other input fields
  # Example:
  # email: String
  # age: Int
}

"""
Input type for updating an existing {{ENTITY_NAME}}
"""
input Update{{ENTITY_NAME}}Input {
  id: ID!
  {{FIELD_NAME}}: String
  
  # Add other updatable fields
  # Example:
  # email: String
  # age: Int
}

"""
Response type for {{ENTITY_NAME}} operations
"""
type {{ENTITY_NAME}}Response {
  success: Boolean!
  message: String
  data: {{ENTITY_NAME}}
  errors: [String!]
}

"""
Response type for {{ENTITY_NAME}} list operations
"""
type {{ENTITY_NAME}}ListResponse {
  success: Boolean!
  message: String
  data: [{{ENTITY_NAME}}!]!
  pagination: PaginationInfo
  errors: [String!]
}

"""
Pagination information
"""
type PaginationInfo {
  page: Int!
  limit: Int!
  total: Int!
  totalPages: Int!
  hasNext: Boolean!
  hasPrev: Boolean!
}
```

## Query Definitions

```graphql
# queries/{{ENTITY_NAME}}.graphql

extend type Query {
  """
  Get a single {{ENTITY_NAME}} by ID
  """
  {{QUERY_NAME}}(id: ID!): {{ENTITY_NAME}}Response
  
  """
  Get a list of {{ENTITY_NAME}}s with pagination
  """
  {{QUERY_NAME}}List(
    page: Int = 1
    limit: Int = 10
    filter: {{ENTITY_NAME}}Filter
    sort: {{ENTITY_NAME}}Sort
  ): {{ENTITY_NAME}}ListResponse
  
  """
  Search {{ENTITY_NAME}}s by criteria
  """
  search{{ENTITY_NAME}}s(
    query: String!
    page: Int = 1
    limit: Int = 10
  ): {{ENTITY_NAME}}ListResponse
}

"""
Filter options for {{ENTITY_NAME}} queries
"""
input {{ENTITY_NAME}}Filter {
  {{FIELD_NAME}}: String
  isActive: Boolean
  createdAt: DateRangeFilter
  
  # Add other filter fields
}

"""
Sort options for {{ENTITY_NAME}} queries
"""
input {{ENTITY_NAME}}Sort {
  field: {{ENTITY_NAME}}SortField!
  direction: SortDirection!
}

"""
Available sort fields for {{ENTITY_NAME}}
"""
enum {{ENTITY_NAME}}SortField {
  {{FIELD_NAME}}
  createdAt
  updatedAt
  
  # Add other sortable fields
}

"""
Sort direction
"""
enum SortDirection {
  ASC
  DESC
}

"""
Date range filter
"""
input DateRangeFilter {
  from: DateTime
  to: DateTime
}
```

## Mutation Definitions

```graphql
# mutations/{{ENTITY_NAME}}.graphql

extend type Mutation {
  """
  Create a new {{ENTITY_NAME}}
  """
  create{{ENTITY_NAME}}(input: Create{{ENTITY_NAME}}Input!): {{ENTITY_NAME}}Response!
  
  """
  Update an existing {{ENTITY_NAME}}
  """
  update{{ENTITY_NAME}}(input: Update{{ENTITY_NAME}}Input!): {{ENTITY_NAME}}Response!
  
  """
  Delete a {{ENTITY_NAME}} by ID
  """
  delete{{ENTITY_NAME}}(id: ID!): {{ENTITY_NAME}}Response!
  
  """
  Bulk operations for {{ENTITY_NAME}}s
  """
  bulkCreate{{ENTITY_NAME}}s(input: [Create{{ENTITY_NAME}}Input!]!): {{ENTITY_NAME}}ListResponse!
  bulkUpdate{{ENTITY_NAME}}s(input: [Update{{ENTITY_NAME}}Input!]!): {{ENTITY_NAME}}ListResponse!
  bulkDelete{{ENTITY_NAME}}s(ids: [ID!]!): {{ENTITY_NAME}}Response!
}
```

## Resolver Implementation

```typescript
// resolvers/{{ENTITY_NAME}}.ts

import { Resolver, Query, Mutation, Arg, Ctx, Info } from 'type-graphql';
import { {{ENTITY_NAME}} } from '../types/{{ENTITY_NAME}}';
import { Create{{ENTITY_NAME}}Input, Update{{ENTITY_NAME}}Input } from '../inputs/{{ENTITY_NAME}}';
import { {{ENTITY_NAME}}Response, {{ENTITY_NAME}}ListResponse } from '../responses/{{ENTITY_NAME}}';
import { {{ENTITY_NAME}}Service } from '../services/{{ENTITY_NAME}}Service';
import { Context } from '../types/Context';
import { GraphQLResolveInfo } from 'graphql';

@Resolver({{ENTITY_NAME}})
export class {{ENTITY_NAME}}Resolver {
  constructor(private {{ENTITY_NAME}}Service: {{ENTITY_NAME}}Service) {}

  @Query(() => {{ENTITY_NAME}}Response)
  async {{QUERY_NAME}}(
    @Arg('id') id: string,
    @Ctx() context: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<{{ENTITY_NAME}}Response> {
    try {
      // Check authentication
      if (!context.user) {
        return {
          success: false,
          message: 'Authentication required',
          data: null,
          errors: ['UNAUTHORIZED']
        };
      }

      // Get {{ENTITY_NAME}} data
      const {{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Service.findById(id);
      
      if (!{{ENTITY_NAME}}) {
        return {
          success: false,
          message: '{{ENTITY_NAME}} not found',
          data: null,
          errors: ['NOT_FOUND']
        };
      }

      return {
        success: true,
        message: '{{ENTITY_NAME}} retrieved successfully',
        data: {{ENTITY_NAME}},
        errors: []
      };
    } catch (error) {
      console.error('Error in {{QUERY_NAME}}:', error);
      return {
        success: false,
        message: 'Internal server error',
        data: null,
        errors: ['INTERNAL_ERROR']
      };
    }
  }

  @Query(() => {{ENTITY_NAME}}ListResponse)
  async {{QUERY_NAME}}List(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Arg('filter', { nullable: true }) filter: {{ENTITY_NAME}}Filter,
    @Arg('sort', { nullable: true }) sort: {{ENTITY_NAME}}Sort,
    @Ctx() context: Context
  ): Promise<{{ENTITY_NAME}}ListResponse> {
    try {
      // Check authentication
      if (!context.user) {
        return {
          success: false,
          message: 'Authentication required',
          data: [],
          pagination: null,
          errors: ['UNAUTHORIZED']
        };
      }

      // Get {{ENTITY_NAME}}s with pagination
      const result = await this.{{ENTITY_NAME}}Service.findMany({
        page,
        limit,
        filter,
        sort
      });

      return {
        success: true,
        message: '{{ENTITY_NAME}}s retrieved successfully',
        data: result.data,
        pagination: result.pagination,
        errors: []
      };
    } catch (error) {
      console.error('Error in {{QUERY_NAME}}List:', error);
      return {
        success: false,
        message: 'Internal server error',
        data: [],
        pagination: null,
        errors: ['INTERNAL_ERROR']
      };
    }
  }

  @Mutation(() => {{ENTITY_NAME}}Response)
  async create{{ENTITY_NAME}}(
    @Arg('input') input: Create{{ENTITY_NAME}}Input,
    @Ctx() context: Context
  ): Promise<{{ENTITY_NAME}}Response> {
    try {
      // Check authentication
      if (!context.user) {
        return {
          success: false,
          message: 'Authentication required',
          data: null,
          errors: ['UNAUTHORIZED']
        };
      }

      // Validate input
      const validationErrors = await this.validate{{ENTITY_NAME}}Input(input);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          data: null,
          errors: validationErrors
        };
      }

      // Create {{ENTITY_NAME}}
      const {{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Service.create({
        ...input,
        userId: context.user.id
      });

      return {
        success: true,
        message: '{{ENTITY_NAME}} created successfully',
        data: {{ENTITY_NAME}},
        errors: []
      };
    } catch (error) {
      console.error('Error in create{{ENTITY_NAME}}:', error);
      return {
        success: false,
        message: 'Internal server error',
        data: null,
        errors: ['INTERNAL_ERROR']
      };
    }
  }

  @Mutation(() => {{ENTITY_NAME}}Response)
  async update{{ENTITY_NAME}}(
    @Arg('input') input: Update{{ENTITY_NAME}}Input,
    @Ctx() context: Context
  ): Promise<{{ENTITY_NAME}}Response> {
    try {
      // Check authentication
      if (!context.user) {
        return {
          success: false,
          message: 'Authentication required',
          data: null,
          errors: ['UNAUTHORIZED']
        };
      }

      // Check if {{ENTITY_NAME}} exists and user has permission
      const existing{{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Service.findById(input.id);
      if (!existing{{ENTITY_NAME}}) {
        return {
          success: false,
          message: '{{ENTITY_NAME}} not found',
          data: null,
          errors: ['NOT_FOUND']
        };
      }

      // Check ownership or permissions
      if (existing{{ENTITY_NAME}}.userId !== context.user.id) {
        return {
          success: false,
          message: 'Permission denied',
          data: null,
          errors: ['FORBIDDEN']
        };
      }

      // Update {{ENTITY_NAME}}
      const updated{{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Service.update(input.id, input);

      return {
        success: true,
        message: '{{ENTITY_NAME}} updated successfully',
        data: updated{{ENTITY_NAME}},
        errors: []
      };
    } catch (error) {
      console.error('Error in update{{ENTITY_NAME}}:', error);
      return {
        success: false,
        message: 'Internal server error',
        data: null,
        errors: ['INTERNAL_ERROR']
      };
    }
  }

  @Mutation(() => {{ENTITY_NAME}}Response)
  async delete{{ENTITY_NAME}}(
    @Arg('id') id: string,
    @Ctx() context: Context
  ): Promise<{{ENTITY_NAME}}Response> {
    try {
      // Check authentication
      if (!context.user) {
        return {
          success: false,
          message: 'Authentication required',
          data: null,
          errors: ['UNAUTHORIZED']
        };
      }

      // Check if {{ENTITY_NAME}} exists and user has permission
      const existing{{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Service.findById(id);
      if (!existing{{ENTITY_NAME}}) {
        return {
          success: false,
          message: '{{ENTITY_NAME}} not found',
          data: null,
          errors: ['NOT_FOUND']
        };
      }

      // Check ownership or permissions
      if (existing{{ENTITY_NAME}}.userId !== context.user.id) {
        return {
          success: false,
          message: 'Permission denied',
          data: null,
          errors: ['FORBIDDEN']
        };
      }

      // Delete {{ENTITY_NAME}}
      await this.{{ENTITY_NAME}}Service.delete(id);

      return {
        success: true,
        message: '{{ENTITY_NAME}} deleted successfully',
        data: existing{{ENTITY_NAME}},
        errors: []
      };
    } catch (error) {
      console.error('Error in delete{{ENTITY_NAME}}:', error);
      return {
        success: false,
        message: 'Internal server error',
        data: null,
        errors: ['INTERNAL_ERROR']
      };
    }
  }

  private async validate{{ENTITY_NAME}}Input(input: Create{{ENTITY_NAME}}Input): Promise<string[]> {
    const errors: string[] = [];

    // Add validation logic
    if (!input.{{FIELD_NAME}} || input.{{FIELD_NAME}}.trim().length === 0) {
      errors.push('{{FIELD_NAME}} is required');
    }

    // Add other validations
    // Example:
    // if (input.email && !isValidEmail(input.email)) {
    //   errors.push('Invalid email format');
    // }

    return errors;
  }
}
```

## Service Implementation

```typescript
// services/{{ENTITY_NAME}}Service.ts

import { {{ENTITY_NAME}} } from '../types/{{ENTITY_NAME}}';
import { Create{{ENTITY_NAME}}Input, Update{{ENTITY_NAME}}Input } from '../inputs/{{ENTITY_NAME}}';
import { {{ENTITY_NAME}}Repository } from '../repositories/{{ENTITY_NAME}}Repository';
import { PaginationOptions, PaginationResult } from '../types/Pagination';

export class {{ENTITY_NAME}}Service {
  constructor(private {{ENTITY_NAME}}Repository: {{ENTITY_NAME}}Repository) {}

  async findById(id: string): Promise<{{ENTITY_NAME}} | null> {
    return await this.{{ENTITY_NAME}}Repository.findById(id);
  }

  async findMany(options: {
    page: number;
    limit: number;
    filter?: {{ENTITY_NAME}}Filter;
    sort?: {{ENTITY_NAME}}Sort;
  }): Promise<{
    data: {{ENTITY_NAME}}[];
    pagination: PaginationResult;
  }> {
    const { page, limit, filter, sort } = options;
    
    const [data, total] = await Promise.all([
      this.{{ENTITY_NAME}}Repository.findMany({
        page,
        limit,
        filter,
        sort
      }),
      this.{{ENTITY_NAME}}Repository.count(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async create(input: Create{{ENTITY_NAME}}Input & { userId: string }): Promise<{{ENTITY_NAME}}> {
    const {{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Repository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {{ENTITY_NAME}};
  }

  async update(id: string, input: Update{{ENTITY_NAME}}Input): Promise<{{ENTITY_NAME}}> {
    const updated{{ENTITY_NAME}} = await this.{{ENTITY_NAME}}Repository.update(id, {
      ...input,
      updatedAt: new Date()
    });

    return updated{{ENTITY_NAME}};
  }

  async delete(id: string): Promise<void> {
    await this.{{ENTITY_NAME}}Repository.delete(id);
  }

  async search(query: string, options: {
    page: number;
    limit: number;
  }): Promise<{
    data: {{ENTITY_NAME}}[];
    pagination: PaginationResult;
  }> {
    const { page, limit } = options;
    
    const [data, total] = await Promise.all([
      this.{{ENTITY_NAME}}Repository.search(query, { page, limit }),
      this.{{ENTITY_NAME}}Repository.searchCount(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}
```

## Testing

```typescript
// tests/resolvers/{{ENTITY_NAME}}.test.ts

import { {{ENTITY_NAME}}Resolver } from '../../resolvers/{{ENTITY_NAME}}';
import { {{ENTITY_NAME}}Service } from '../../services/{{ENTITY_NAME}}Service';
import { Context } from '../../types/Context';

describe('{{ENTITY_NAME}}Resolver', () => {
  let resolver: {{ENTITY_NAME}}Resolver;
  let mock{{ENTITY_NAME}}Service: jest.Mocked<{{ENTITY_NAME}}Service>;
  let mockContext: Context;

  beforeEach(() => {
    mock{{ENTITY_NAME}}Service = {
      findById: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn()
    } as any;

    resolver = new {{ENTITY_NAME}}Resolver(mock{{ENTITY_NAME}}Service);

    mockContext = {
      user: {
        id: 'user-123',
        email: 'test@example.com'
      }
    } as Context;
  });

  describe('{{QUERY_NAME}}', () => {
    it('should return {{ENTITY_NAME}} when found', async () => {
      const mock{{ENTITY_NAME}} = {
        id: '{{ENTITY_NAME}}-123',
        {{FIELD_NAME}}: 'Test {{ENTITY_NAME}}',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mock{{ENTITY_NAME}}Service.findById.mockResolvedValue(mock{{ENTITY_NAME}});

      const result = await resolver.{{QUERY_NAME}}('{{ENTITY_NAME}}-123', mockContext, {} as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mock{{ENTITY_NAME}});
      expect(mock{{ENTITY_NAME}}Service.findById).toHaveBeenCalledWith('{{ENTITY_NAME}}-123');
    });

    it('should return error when {{ENTITY_NAME}} not found', async () => {
      mock{{ENTITY_NAME}}Service.findById.mockResolvedValue(null);

      const result = await resolver.{{QUERY_NAME}}('non-existent', mockContext, {} as any);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('NOT_FOUND');
    });

    it('should return error when user not authenticated', async () => {
      const unauthenticatedContext = { user: null } as Context;

      const result = await resolver.{{QUERY_NAME}}('{{ENTITY_NAME}}-123', unauthenticatedContext, {} as any);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('UNAUTHORIZED');
    });
  });

  describe('create{{ENTITY_NAME}}', () => {
    it('should create {{ENTITY_NAME}} successfully', async () => {
      const input = {
        {{FIELD_NAME}}: 'New {{ENTITY_NAME}}'
      };

      const created{{ENTITY_NAME}} = {
        id: '{{ENTITY_NAME}}-123',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mock{{ENTITY_NAME}}Service.create.mockResolvedValue(created{{ENTITY_NAME}});

      const result = await resolver.create{{ENTITY_NAME}}(input, mockContext);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(created{{ENTITY_NAME}});
      expect(mock{{ENTITY_NAME}}Service.create).toHaveBeenCalledWith({
        ...input,
        userId: 'user-123'
      });
    });
  });
});
```

## Best Practices

1. **Schema Design**: Use descriptive names and proper types
2. **Error Handling**: Implement comprehensive error handling
3. **Authentication**: Always check user authentication
4. **Authorization**: Verify user permissions for operations
5. **Validation**: Validate all inputs before processing
6. **Pagination**: Implement proper pagination for list queries
7. **Caching**: Use appropriate caching strategies
8. **Testing**: Write comprehensive tests for all resolvers
9. **Documentation**: Document all queries, mutations, and types
10. **Performance**: Optimize queries and avoid N+1 problems

## Related Documentation

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [TypeGraphQL Documentation](https://typegraphql.com/)
- [GraphQL Security](https://graphql.org/learn/authorization/)
- [API Documentation](../API_DOCUMENTATION.md)
