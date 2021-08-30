import { Model } from 'sequelize'

import type { Author as AuthorDomainType } from '../../types'

class Author extends Model {
  public id!: AuthorDomainType['id']
  public name!: AuthorDomainType['name']
  public password!: AuthorDomainType['password']
}

export default Author
