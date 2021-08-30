import { Model } from 'sequelize'

import type { Post as PostDomainType } from '../../types'

class Post extends Model {
  public id!: PostDomainType['id']
  public title!: PostDomainType['title']
  public body!: PostDomainType['body']
}

export default Post
