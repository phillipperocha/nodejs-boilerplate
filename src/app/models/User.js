import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Here we will use sequelize hooks.
    // They are basically code snippets that are executed automatically.
    this.addHook('beforeSave', async user => {
      console.log('FOIII');
      if (user.password) {
        // We want to encrypt and need to say the number of rounds to encrypt
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }
}
export default User;
