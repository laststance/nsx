import { Model } from 'sequelize'

class AuthorModel extends Model {
  public id!: Author['id']
  public name!: Author['name']
  public password!: Author['password']
  public createdAt!: Author['createdAt']
  public updateAt!: Author['updatedAt']
}

export default AuthorModel
